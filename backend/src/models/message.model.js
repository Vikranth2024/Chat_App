import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    originalLanguage: {
        type: String,
        default: "en",
    },
    translations: {
        type: Map,
        of: String, // e.g., { "hi": "नमस्ते", "fr": "Bonjour" }
        default: {},
    },
    deletedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;