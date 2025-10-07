import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./sekeltons/MessageSekelton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import { Trash2 } from "lucide-react"; 

const ChatContainer = () => {
  const {
    chats,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage, 
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

 
  useEffect(() => {
    if (!selectedUser) return;

    if (!chats[selectedUser._id]) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  
  useEffect(() => {
    if (messageEndRef.current && selectedUser) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats[selectedUser?._id]]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const messages = chats[selectedUser._id] || [];

  if (isMessagesLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMine
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Message content */}
              <div className="flex flex-col max-w-xs">
                <div className="chat-header flex items-center gap-2 mb-1">
                  <time className="text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>

                  {/*  Show delete only for my messages */}
                  {isMine && (
                    <button
                      onClick={() => deleteMessage(message._id, selectedUser._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
