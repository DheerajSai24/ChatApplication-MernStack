import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-3 border-b border-base-300 bg-base-100/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-12 rounded-full relative ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100 animate-pulse shadow-lg shadow-success/50"></span>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-lg">{selectedUser.fullName}</h3>
            <p className={`text-sm flex items-center gap-1 ${
              onlineUsers.includes(selectedUser._id) 
                ? "text-success font-medium" 
                : "text-base-content/60"
            }`}>
              {onlineUsers.includes(selectedUser._id) ? (
                <>
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  Online
                </>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-all hover:scale-110"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
