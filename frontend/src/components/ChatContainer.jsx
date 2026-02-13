import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { X, ZoomIn, Search, Image as ImageIcon, Trash2, Download, MoreVertical } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    searchQuery,
    isSearchOpen,
    sharedMediaOpen,
    setSharedMediaOpen,
    chatWallpapers,
    deleteMessage
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [zoomedImage, setZoomedImage] = useState(null); // { url, id, senderId } or just url? Let's use whole object if possible or just store what we need. For now let's store the message object if possible or just metadata.
  // Actually, zoomedImage was just the URL string previously. 
  // To support Delete from image view, we need the message ID.
  // So I'll change zoomedImage state to store the whole message object or null.
  
  const [imageToView, setImageToView] = useState(null); // { url: string, messageId: string, senderId: string }
  const [messageToDelete, setMessageToDelete] = useState(null); // Message object
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const filteredMessages = messages.filter(msg => 
    msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    !msg.text
  );

  const sharedMedia = messages.filter(msg => msg.image).map(msg => msg.image);

  const renderDateDivider = (currentMsg, prevMsg) => {
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;

    if (currentDate !== prevDate) {
      return (currentDate === new Date().toDateString() ? "Today" : currentDate);
    }
    return null;
  };

  const handleDownloadImage = async (url) => {
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.download = `chat_image_${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          console.error("Download failed", error);
      }
  };
  
  const handleDeleteConfirm = async (deleteForEveryone) => {
      if (!messageToDelete) return;
      
      const id = messageToDelete._id;
      setMessageToDelete(null);
      setDeletingMessageId(id);

      // Wait for animation to finish (1s)
      setTimeout(async () => {
          await deleteMessage(id, deleteForEveryone);
          setDeletingMessageId(null);
          if (imageToView?.messageId === id) setImageToView(null);
      }, 1000);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col futuristic-bg">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const wallpaper = chatWallpapers[selectedUser._id];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full">
      <ChatHeader />

      {/* Main Chat Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 lg:px-12 py-8 space-y-2 custom-scrollbar relative"
        style={{ 
          backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: wallpaper ? 'rgba(0,0,0,0.2)' : 'transparent',
          backgroundBlendMode: 'overlay'
        }}
      >
        {filteredMessages.length === 0 && searchQuery && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
             <Search size={48} className="mb-4" />
             <p className="font-black uppercase tracking-widest text-sm">No results for "{searchQuery}"</p>
          </div>
        )}

        {filteredMessages.map((message, idx) => {
          const isSentByMe = message.senderId === authUser._id;
          const prevMessage = filteredMessages[idx - 1];
          const isSameSenderAsPrev = prevMessage?.senderId === message.senderId;
          const dateDivider = renderDateDivider(message, prevMessage);
          
          return (
            <div key={message._id}>
              {dateDivider && (
                <div className="flex justify-center my-6 sticky top-2 z-10">
                  <span className="px-4 py-1 rounded-full bg-base-300/50 backdrop-blur-md text-[13px] font-bold text-base-content/60 shadow-sm border border-base-content/5">
                    {dateDivider}
                  </span>
                </div>
              )}
              <div
                className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"} ${isSameSenderAsPrev ? "mt-1" : "mt-6"} group/message ${message._id === deletingMessageId ? "dust-effect" : "animate-fade-in"}`}
                ref={idx === filteredMessages.length - 1 ? messageEndRef : null}
              >
                <div className="relative flex items-center gap-2 max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]">
                    
                    {/* Delete action for sender (or receiver for 'delete for me') */}
                    <button 
                        onClick={() => setMessageToDelete(message)}
                        className={`opacity-0 group-hover/message:opacity-100 transition-opacity p-2 rounded-full hover:bg-base-300/50 text-error/70 ${isSentByMe ? "-order-1" : "order-1"}`}
                        title="Delete message"
                    >
                        <Trash2 size={16} />
                    </button>

                    <div
                    className={`
                        relative px-4 py-3 neo-shadow-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]
                        ${isSentByMe 
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-content rounded-[1.8rem] rounded-tr-[0.2rem] shadow-primary/20 -rotate-1" 
                        : "bg-base-100/90 backdrop-blur-md text-base-content rounded-[1.8rem] rounded-tl-[0.2rem] border border-base-content/5 rotate-1"}
                    `}
                    >
                    {message.image && (
                        <div 
                            className="relative group/img cursor-pointer mb-2 overflow-hidden rounded-xl max-w-[240px]" // Reduced max-width as requested
                            onClick={() => setImageToView({ url: message.image, messageId: message._id, senderId: message.senderId })}
                        >
                        <img
                            src={message.image}
                            alt="Attachment"
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white scale-0 group-hover/img:scale-100 transition-transform duration-300">
                                <ZoomIn size={20} />
                            </div>
                        </div>
                        </div>
                    )}
                    
                    <div className="flex items-end gap-3 min-w-[60px]">
                        {message.text && (
                        <div className="flex flex-col">
                            <p className="text-[15px] leading-relaxed font-medium">
                                {/* Display translation if available for user's preferred language, otherwise original text */}
                                {message.translations && (message.translations instanceof Map ? message.translations.get(authUser.preferredLanguage) : message.translations[authUser.preferredLanguage])
                                    ? (message.translations instanceof Map ? message.translations.get(authUser.preferredLanguage) : message.translations[authUser.preferredLanguage])
                                    : message.text}
                            </p>
                            {/* Indicator for translation */}
                            {message.translations && (message.translations instanceof Map ? message.translations.get(authUser.preferredLanguage) : message.translations[authUser.preferredLanguage]) && (
                                <div className="flex items-center gap-1.5 mt-1 opacity-50">
                                    <div className="size-1 rounded-full bg-current"/>
                                    <span className="text-[9px] uppercase tracking-widest font-black">AI Translated</span>
                                </div>
                            )}
                        </div>
                        )}
                        <span className={`text-[10px] whitespace-nowrap opacity-60 font-black tracking-widest ml-auto ${isSentByMe ? "text-primary-content" : "text-base-content"}`}>
                        {formatMessageTime(message.createdAt)}
                        </span>
                    </div>

                    {/* 3D Indicator */}
                    {isSentByMe && (
                        <div className="absolute top-0 right-[-8px] border-l-[12px] border-t-[12px] border-l-primary/80 border-t-transparent filter brightness-90 -z-10" />
                    )}
                    {!isSentByMe && (
                        <div className="absolute top-0 left-[-8px] border-r-[12px] border-t-[12px] border-r-base-100/80 border-t-transparent filter brightness-90 -z-10" />
                    )}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <MessageInput />

      {/* Image Viewer Modal */}
      {imageToView && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 lg:p-12 animate-fade-in" onClick={() => setImageToView(null)}>
          <div className="absolute top-6 right-6 flex items-center gap-4 z-20" onClick={(e) => e.stopPropagation()}>
             <button 
                onClick={() => handleDownloadImage(imageToView.url)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl"
                title="Save Image"
             >
                <Download size={24} />
             </button>
             <button 
                onClick={() => setMessageToDelete(messages.find(m => m._id === imageToView.messageId))}
                className="p-3 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full text-white transition-all shadow-xl"
                title="Delete Image"
             >
                <Trash2 size={24} />
             </button>
             <button 
                onClick={() => setImageToView(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl"
             >
                <X size={24} />
             </button>
          </div>
          
          <img 
            src={imageToView.url} 
            alt="Zoomed attachment" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
          <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setMessageToDelete(null)}>
              <div className="bg-base-100 rounded-2xl p-6 w-full max-w-sm neo-shadow animate-scale-in" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold mb-4">Delete Message?</h3>
                  <div className="flex flex-col gap-3">
                      {/* Only Show "Delete for everyone" if current user is the sender */}
                      {messageToDelete.senderId === authUser._id && (
                          <button 
                            className="btn btn-error text-white w-full"
                            onClick={() => handleDeleteConfirm(true)}
                          >
                              Delete for Everyone
                          </button>
                      )}
                      <button 
                        className="btn btn-neutral w-full"
                        onClick={() => handleDeleteConfirm(false)}
                      >
                          Delete for Me
                      </button>
                      <button 
                        className="btn btn-ghost w-full"
                        onClick={() => setMessageToDelete(null)}
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Shared Media Sidebar/Modal */}
      {sharedMediaOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex justify-end animate-fade-in" onClick={() => setSharedMediaOpen(false)}>
           <div 
            className="w-full max-w-md h-full glass neo-shadow border-l border-white/10 p-8 flex flex-col gap-8 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
           >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                       <ImageIcon size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black tracking-tighter">Shared Media</h2>
                       <p className="text-sm text-base-content/40 font-bold">{sharedMedia.length} Items</p>
                    </div>
                 </div>
                 <button onClick={() => setSharedMediaOpen(false)} className="p-2 hover:bg-base-content/5 rounded-xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 {sharedMedia.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                       {sharedMedia.map((img, i) => (
                          <div 
                            key={i} 
                            className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-base-content/5"
                            onClick={() => {
                                // Find message associated with this image if possible, or just view it. 
                                // Since sharedMedia is just an array of strings, we might lose context.
                                // For better UX, sharedMedia should probably be objects.
                                // iterating messages to find match (inefficient but works for small logic)
                                const msg = messages.find(m => m.image === img);
                                if(msg) setImageToView({ url: img, messageId: msg._id, senderId: msg.senderId });
                            }}
                          >
                             <img src={img} alt="media" className="w-full h-full object-cover" />
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                       <ImageIcon size={64} strokeWidth={1} />
                       <p className="font-black uppercase tracking-widest text-sm">No media shared yet</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
