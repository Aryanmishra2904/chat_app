import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  
  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 text-white shadow-md">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullname}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
        />
        <div>
          <h3 className="font-semibold text-white">{selectedUser.fullname}</h3>
          <p className="text-sm">
            {isOnline ? (
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                Offline
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
