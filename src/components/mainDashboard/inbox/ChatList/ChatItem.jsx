/* eslint-disable react/prop-types */
import { Avatar, Badge } from "antd";
import moment from "moment";

const ChatItem = ({
  conversation,
  participant,
  lastMessage,
  isOnline,
  isSelected,
  onClick,
}) => {
  // Format date to show time or date based on when the message was sent using moment.js
  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = moment(dateString);
    const today = moment();
    const yesterday = moment().subtract(1, "day");

    if (date.isSame(today, "day")) {
      return date.format("hh:mm A"); // 12-hour format with AM/PM
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return date.format("MMM D"); // Month and day (e.g., Jan 5)
    }
  };

  // Get unread count from conversation
  const unreadCount = conversation?.unreadCount || 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
        isSelected ? "bg-primary/10 border-l-4 border-l-primary" : ""
      }`}
    >
      <Badge
        dot={isOnline}
        offset={[-5, 30]}
        color={isOnline ? "green" : "gray"}
      >
        {participant?.profileImage ? (
          <Avatar
            src={`${participant.profileImage}`}
            className="flex-shrink-0 size-12"
          />
        ) : (
          <Avatar className="bg-gradient-to-r from-purple-500 to-indigo-600 flex-shrink-0">
            {participant?.firstName?.charAt(0) ||
              participant?.lastName?.charAt(0) ||
              "U"}
          </Avatar>
        )}
      </Badge>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="font-semibold text-gray-900 truncate">
            {participant?.firstName} {participant?.lastName}
          </h4>
          <span className="text-xs text-gray-500">
            {formatDateTime(conversation?.updatedAt || conversation?.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {lastMessage?.content?.text ? (
            <p className="text-sm text-gray-600 truncate">
              {lastMessage?.content?.text}
            </p>
          ) : (
            <p className="text-sm text-gray-600 truncate">
              {lastMessage?.content?.messageType === "image"
                ? "📷 Photo"
                : lastMessage?.content?.messageType === "document"
                ? "📄 Document"
                : "New message"}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        {unreadCount > 0 && (
          <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
