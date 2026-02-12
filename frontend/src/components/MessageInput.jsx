import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage } = useChatStore();
  const { theme } = useThemeStore();

  const isDarkMode = ["dark", "synthwave", "halloween", "forest", "black", "luxury", "dracula", "night", "coffee", "dim", "sunset"].includes(theme);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-transparent border-t border-base-content/5 relative">
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-24 left-4 z-50 glass rounded-[2rem] shadow-2xl animate-scale-in p-1 border border-primary/20"
        >
          <EmojiPicker 
            theme={isDarkMode ? "dark" : "light"}
            onEmojiClick={onEmojiClick}
            lazyLoadEmojis={true}
            searchDisabled={false}
            skinTonesDisabled={true}
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {imagePreview && (
        <div className="mb-4 flex items-center gap-3 animate-fade-in px-4">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-2xl border-2 border-primary/30 shadow-xl"
            />
            <button
              onClick={removeImage}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-base-100 shadow-xl border border-base-300 flex items-center justify-center text-error hover:bg-error/10 transition-all hover:scale-110 active:scale-95"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-5xl mx-auto">
        <div className="flex-1 flex items-end gap-1 glass neo-shadow-sm rounded-[1.8rem] px-3 border border-base-content/10 focus-within:border-primary/30 transition-all">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 transition-all mb-1 rounded-full hover:bg-base-content/5 ${showEmojiPicker ? "text-primary bg-primary/10" : "text-base-content/40 hover:text-primary"}`}
          >
            <Smile size={24} />
          </button>
          
          <div className="flex-1 relative mb-1">
            <textarea
              rows="1"
              className="w-full bg-transparent border-none outline-none py-3.5 px-1 text-[15px] font-medium text-base-content placeholder:text-base-content/30 resize-none max-h-32 custom-scrollbar"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`p-3 transition-all mb-1 rounded-full hover:bg-base-content/5 ${imagePreview ? "text-primary bg-primary/10" : "text-base-content/40 hover:text-primary"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={22} className="-rotate-45" />
          </button>
        </div>

        <button
          type="submit"
          className={`
            size-13 rounded-full flex items-center justify-center transition-all shadow-xl mb-1
            ${(!text.trim() && !imagePreview)
              ? "bg-base-content/10 text-base-content/20 cursor-not-allowed"
              : "bg-primary text-primary-content shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-90 animate-glow"
            }
          `}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className={(!text.trim() && !imagePreview) ? "" : "translate-x-0.5"} />
        </button>
      </form>
    </div>

  );
};

export default MessageInput;

