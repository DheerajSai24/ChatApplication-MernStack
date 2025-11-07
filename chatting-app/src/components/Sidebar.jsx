import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SlidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-gradient-to-b from-base-100 to-base-200/50 backdrop-blur-sm">
      <div className="border-b border-base-300 w-full p-5 bg-base-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <Users className="size-6 text-primary" />
          </div>
          <span className="font-bold text-lg hidden lg:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contacts</span>
        </div>
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm font-medium">Show online only</span>
          </label>
          <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-semibold">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-primary/10 transition-all duration-200
              ${selectedUser?._id === user._id 
                ? "bg-gradient-to-r from-primary/20 to-secondary/20 ring-2 ring-primary/30 shadow-md" 
                : "hover:scale-[1.02]"
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="relative group">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-success 
                    rounded-full ring-2 ring-base-100 animate-pulse shadow-lg shadow-success/50"
                  />
                )}
              </div>
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-semibold truncate text-base">{user.fullName}</div>
              <div className={`text-sm flex items-center gap-1 ${
                onlineUsers.includes(user._id) ? "text-success font-medium" : "text-base-content/60"
              }`}>
                {onlineUsers.includes(user._id) ? (
                  <>
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    Online
                  </>
                ) : (
                  "Offline"
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-8">
            <Users className="size-12 mx-auto mb-2 opacity-20" />
            <p className="font-medium">No online users</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
