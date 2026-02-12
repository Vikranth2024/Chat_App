import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen futuristic-bg overflow-hidden flex flex-col">
      {/* Navbar Spacer */}
      <div className="h-24 shrink-0" />
      
      <div className="flex-1 flex justify-center p-4 sm:p-8 sm:pt-0 min-h-0">
        <div className="glass w-full max-w-7xl h-full flex rounded-[2.5rem] overflow-hidden neo-shadow animate-scale-in">
          <div className={`${selectedUser ? "hidden lg:block border-r border-base-content/10" : "w-full lg:w-[380px]"} h-full`}>
            <Sidebar />
          </div>

          <div className={`${!selectedUser ? "hidden lg:flex" : "flex"} flex-1 h-full`}>
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>

  );
};



export default HomePage;