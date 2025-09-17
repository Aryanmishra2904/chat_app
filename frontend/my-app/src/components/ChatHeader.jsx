import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  // ✅ Check if this user is online
  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullname}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">{selectedUser.fullname}</h3>
          <p className="text-sm text-gray-500">
            {isOnline ? (
              <span className="text-green-600">🟢 Online</span>
            ) : (
              <span className="text-gray-400">⚪ Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
