/* eslint-disable react/prop-types */

import { Avatar, Image } from "antd";
import moment from "moment";

const MessageItem = ({ message }) => {
  const isMe = message.sender === "me";

  // Format message content based on type
  const renderMessageContent = () => {
    if (
      message.content?.messageType === "image" &&
      message.content?.fileUrls?.length > 0
    ) {
      return (
        <div className="rounded-lg overflow-hidden">
          {message.content.fileUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt="sent"
              className="max-w-xs rounded-lg cursor-pointer shadow-md"
              preview={{ mask: null }} // Remove the preview mask for cleaner look
            />
          ))}
        </div>
      );
    }

    return <div className="px-4 py-2">{message.text}</div>;
  };

  // Format the time using moment.js in 12-hour format
  const formattedTime = message.createdAt
    ? moment(message.createdAt).format("hh:mm A") // 12-hour format with AM/PM
    : message.time || "";

  return (
    <div className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end gap-2 max-w-xs md:max-w-md lg:max-w-lg ${
          isMe ? "flex-row-reverse" : ""
        }`}
      >
        {!isMe &&
          message.senderInfo &&
          (message.senderInfo.profileImage ? (
            <Avatar
              src={`${message.senderInfo.profileImage}`}
              size="small"
              className="flex-shrink-0"
            />
          ) : (
            <Avatar
              size="small"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 flex-shrink-0"
            >
              {message.senderInfo.firstName?.charAt(0) ||
                message.senderInfo.lastName?.charAt(0) ||
                message.senderInfo.name?.charAt(0) ||
                "U"}
            </Avatar>
          ))}

        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          {!isMe && message.senderInfo && (
            <span className="text-xs text-gray-500 mb-1 px-1">
              {message.senderInfo.name}
            </span>
          )}

          <div
            className={`${
              isMe
                ? "bg-primary text-white rounded-br-none" // Use primary color instead of blue
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            } rounded-2xl shadow-sm inline-block min-w-[60px] max-w-full`}
          >
            {renderMessageContent()}
          </div>

          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span>{formattedTime}</span>
            {isMe && message.deliveryStatus && (
              <span className="flex items-center">
                {message.deliveryStatus === "seen" ? (
                  <span className="text-xs text-primary">✓✓</span> // Double filled ticks for seen
                ) : message.deliveryStatus === "delivered" ? (
                  <span className="text-xs text-gray-400">✓✓</span> // Double outline ticks for delivered
                ) : (
                  <span className="text-xs text-gray-400">✓</span> // Single tick for sent
                )}
              </span>
            )}
          </div>
        </div>

        {!isMe && (
          <Avatar
            size="small"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 flex-shrink-0"
          >
            {message.senderInfo.firstName?.charAt(0) ||
              message.senderInfo.lastName?.charAt(0) ||
              message.senderInfo.name?.charAt(0) ||
              "U"}
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
