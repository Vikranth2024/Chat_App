import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { translateText } from "../lib/ai.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedBy: { $ne: myId }, // Filter out messages deleted by this user
      isDeleted: { $ne: true } // Exclude messages deleted for everyone
    });

    // Convert Mongoose Maps to plain objects for proper serialization
    const messagesWithTranslations = messages.map(msg => {
      const msgObj = msg.toObject();
      if (msgObj.translations && msgObj.translations instanceof Map) {
        msgObj.translations = Object.fromEntries(msgObj.translations);
      }
      return msgObj;
    });

    res.status(200).json(messagesWithTranslations);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // --- AI Translation Logic ---
    const receiver = await User.findById(receiverId);
    let translations = {};
    
    if (receiver && text) {
        const targetLang = receiver.preferredLanguage || "en";
        
        if (targetLang !== "en") {
            const translatedText = await translateText(text, targetLang);
            
            if (translatedText && translatedText !== text) {
                translations[targetLang] = translatedText;
                console.log(`Translation: "${text}" → [${targetLang}] "${translatedText}"`);
            }
        }
    }
    // -----------------------------

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      originalLanguage: "en",
      translations
    });

    await newMessage.save();

    // Convert to plain object and manually serialize the translations Map
    const messageObject = newMessage.toObject();
    
    // Mongoose Maps don't serialize well - convert to plain object
    if (messageObject.translations && messageObject.translations instanceof Map) {
      messageObject.translations = Object.fromEntries(messageObject.translations);
    }
    
    console.log("Translation: Sending message with translations:", JSON.stringify(messageObject.translations));
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageObject);
    }

    res.status(201).json(messageObject);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        // Check query first, then body, and handle boolean conversion from string
        const deleteForEveryoneRaw = req.query.deleteForEveryone || req.body.deleteForEveryone;
        const deleteForEveryone = deleteForEveryoneRaw === 'true' || deleteForEveryoneRaw === true;
        
        const userId = req.user._id;

        console.log("Delete Request:", { messageId, deleteForEveryone, userId, raw: deleteForEveryoneRaw }); 


        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (deleteForEveryone) {
            // Check if user is the sender
            if (message.senderId.toString() !== userId.toString()) {
                return res.status(403).json({ message: "You can only delete your own messages for everyone" });
            }
            message.isDeleted = true;
             // Notify receiver via socket if needed (optional implementation detail)
             const receiverSocketId = getReceiverSocketId(message.receiverId);
             if(receiverSocketId) {
                 io.to(receiverSocketId).emit("messageDeleted", { messageId, deleteForEveryone: true });
                 console.log("Emitted messageDeleted to:", receiverSocketId);
             } else {
                 console.log("User not connected, skipping socket");
             }
        } else {
            // Delete for me
            if (!message.deletedBy.includes(userId)) {
                message.deletedBy.push(userId);
            }
        }

        await message.save();
        res.status(200).json({ message: "Message deleted successfully", data: message });

    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Instead of hard deleting, we might want to just "hide" them for the user, 
    // but for now keeping the existing logic or upgrading it to soft delete is a choice.
    // The previous implementation was a hard delete. 
    // Let's stick to the existing hard delete for "clear chat" or upgrade it? 
    // The user requested "delete for me" on individual messages. 
    // "Clear chat" usually implies clearing history for the user.
    // For now, I will keep the previous clearMessages as is or minor fix if needed, 
    // but the main focus is deleteMessage.
    
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.log("Error in clearMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
