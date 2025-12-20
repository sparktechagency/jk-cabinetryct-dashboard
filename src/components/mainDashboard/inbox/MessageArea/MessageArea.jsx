/* eslint-disable react/prop-types */
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Spin, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  fetchMessages,
  sendMessage as sendApiMessage,
  sendTypingStart,
  sendTypingStop,
  markConversationSeen,
} from "../../../../utils/messagingService";
import { getUserData } from "../../../../utils/authUtils";
import { useGetSingleUserQuery } from "../../../../redux/features/users/usersApi";
import MessageItem from "./MessageItem";
import {
  getSocket,
  addOnlineStatusListener,
  isUserOnline,
} from "../../../../utils/socket";
const { TextArea } = Input;

const MessageArea = ({ chat, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentUser = getUserData();

  // State for receiverId to update properly when chat prop changes
  const [receiverId, setReceiverId] = useState(() => {
    // Get initial receiverId from chat object - find the participant that's not the current user
    const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserIdFromStorage = currentUserData._id || currentUserData.id;

    let id = chat?.participant?._id;
    if (!id && chat?.participants && chat.participants?.length > 0) {
      // Find the participant that is NOT the current user
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUserIdFromStorage
      );
      id = otherParticipant?._id || chat.participants[0]._id;
    }
    return id;
  });

  // Update receiverId when chat prop changes
  useEffect(() => {
    const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserIdFromStorage = currentUserData._id || currentUserData.id;

    let newReceiverId = chat?.participant?._id;
    if (!newReceiverId && chat?.participants && chat.participants?.length > 0) {
      // Find the participant that is NOT the current user
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUserIdFromStorage
      );
      newReceiverId = otherParticipant?._id || chat.participants[0]._id;
    }

    if (newReceiverId !== receiverId) {
      setReceiverId(newReceiverId);
    }
  }, [chat, receiverId]);

  // If we only have a user ID but no full participant info, fetch user details
  const { data: userData, isLoading: userLoading } = useGetSingleUserQuery(
    receiverId || "",
    {
      skip:
        !receiverId ||
        (chat?.participant?.firstName && chat?.participant?.lastName), // Skip if we already have participant info
    }
  );

  // Load messages when receiverId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!receiverId) return;

      setLoading(true);
      try {
        const data = await fetchMessages(receiverId);
        // Sort messages chronologically when initially loading
        const sortedMessages = (data.docs || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (receiverId) {
      loadMessages();
      // Mark conversation as seen when opening
      markConversationSeen(receiverId).catch(console.error);
      // Check initial online status
      setIsOnline(isUserOnline(receiverId));
    } else {
      setMessages([]);
    }

    // Focus on input when chat changes
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    // Reset typing indicator when changing chat
    setIsTyping(false);

    // Clean up typing timeout
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [receiverId]);

  // Track online status changes for current receiver
  useEffect(() => {
    if (!receiverId) return;

    const removeListener = addOnlineStatusListener((userId, online) => {
      if (userId === receiverId) {
        setIsOnline(online);
      }
    });

    return () => removeListener();
  }, [receiverId]);

  // Set up socket listeners for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      // Handle new message (correct event name from docs)
      const handleNewMessage = (message) => {
        if (
          message.chatId &&
          (message?.receiverId?._id === receiverId ||
            message?.senderId?._id === receiverId ||
            message?.receiverId === receiverId ||
            message?.senderId === receiverId)
        ) {
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some((msg) => msg._id === message._id);
            if (!exists) {
              console.log("New message:", message);
              return [...prev, message].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
            }
            return prev;
          });
          // Mark as seen since we're in the chat
          markConversationSeen(receiverId).catch(console.error);
        }
      };

      // Handle message seen status updates (correct event name from docs)
      const handleMessageSeen = (data) => {
        const { seenBy } = data;
        if (seenBy === receiverId) {
          setMessages((prev) => {
            return prev.map((msg) => ({
              ...msg,
              deliveryStatus: "seen",
            }));
          });
        }
      };

      // Handle message updated
      const handleMessageUpdated = (data) => {
        const { message: updatedMessage } = data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      };

      // Handle message deleted
      const handleMessageDeleted = (data) => {
        const { messageId } = data;
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      };

      // Handle typing indicator (correct event name from docs)
      const handleUserTyping = (data) => {
        const { userId, isTyping: typing } = data;
        if (userId === receiverId) {
          setIsTyping(typing);
        }
      };

      // Handle reaction added
      const handleReactionAdded = (data) => {
        const { messageId, reactions } = data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, reactions } : msg
          )
        );
      };

      // Handle reaction removed
      const handleReactionRemoved = (data) => {
        const { messageId, reactions } = data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, reactions } : msg
          )
        );
      };

      socket.on("new-message", handleNewMessage);
      socket.on("message-seen", handleMessageSeen);
      socket.on("message-updated", handleMessageUpdated);
      socket.on("message-deleted", handleMessageDeleted);
      socket.on("user-typing", handleUserTyping);
      socket.on("reaction-added", handleReactionAdded);
      socket.on("reaction-removed", handleReactionRemoved);

      return () => {
        socket.off("new-message", handleNewMessage);
        socket.off("message-seen", handleMessageSeen);
        socket.off("message-updated", handleMessageUpdated);
        socket.off("message-deleted", handleMessageDeleted);
        socket.off("user-typing", handleUserTyping);
        socket.off("reaction-added", handleReactionAdded);
        socket.off("reaction-removed", handleReactionRemoved);
      };
    }
  }, [receiverId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    try {
      // Prepare the message data for socket
      const messageData = {
        message: message.trim(),
        receiverId,
      };

      // Send the message via socket (wait for actual response)
      const sentMessage = await sendApiMessage(messageData);

      // Only add the message to the UI after it's confirmed by the server
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            ...sentMessage,
            sender: "me",
            time: formatTime(sentMessage.createdAt),
            senderInfo: currentUser,
          },
        ];
        return newMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
    } finally {
      setMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!receiverId) return;

    // Send typing start
    sendTypingStart(receiverId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to send typing stop after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop(receiverId);
    }, 1000);
  };

  // Format date to show time using moment.js in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("hh:mm A"); // 12-hour format with AM/PM
  };

  // Get participant data - find the other participant (not current user) or use fetched data
  const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserIdFromStorage = currentUserData._id || currentUserData.id;

  // First try to use fetched user data
  let participant = userData?.data;

  // If no fetched data, try to find the other participant from the chat object
  if (!participant && chat?.participants && chat.participants.length > 0) {
    // Find the participant that is NOT the current user
    participant =
      chat.participants.find((p) => p._id !== currentUserIdFromStorage) ||
      chat.participants[0];
  }

  // If still no participant, try the direct participant property
  if (!participant) {
    participant = chat?.participant;
  }

  // If we only have a user ID and are waiting for user data, show loading
  if (receiverId && !participant && userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  // If no participant info at all, show message
  if (!participant) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b">
        {/* Back button for mobile */}
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className="md:hidden flex items-center justify-center"
          />
        )}
        <div className="relative">
          {participant?.profileImage ? (
            <Avatar size="large" src={`${participant.profileImage}`} />
          ) : (
            <Avatar
              size="large"
              className="bg-gradient-to-r from-purple-500 to-indigo-600"
            >
              {participant?.firstName?.charAt(0) ||
                participant?.lastName?.charAt(0) ||
                "U"}
            </Avatar>
          )}
          {/* Online status indicator */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">
            {participant?.firstName} {participant?.lastName}
          </h3>
          <p className="text-sm ">
            {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : messages.length > 0 ? (
          <>
            <div className="text-center text-xs text-gray-500 mb-4 py-2">
              {new Date().toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {[...messages]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort messages chronologically (oldest first)
              .map((msg) => {
                // Determine sender info based on the API structure
                const isMe =
                  msg.senderId === currentUser?.id ||
                  msg.senderId === currentUser?._id ||
                  (typeof msg.senderId === "object" &&
                    (msg.senderId._id === currentUser?.id ||
                      msg.senderId._id === currentUser?._id));

                // Get sender info for display - if msg.senderId is an object (like in receiverId), use it directly
                // If it's a string ID, try to get user info from participants or use the participant object
                let senderInfo = null;
                if (isMe) {
                  senderInfo = currentUser;
                } else if (typeof msg.senderId === "object") {
                  // If senderId is already an object with user details
                  senderInfo = msg.senderId;
                } else if (typeof msg.senderId === "string") {
                  // If senderId is a string ID, we need to get user info from chat participants
                  if (chat?.participants && chat.participants.length > 0) {
                    senderInfo = chat.participants.find(
                      (p) => p._id === msg.senderId
                    );
                  }
                }

                // Fallback: if no senderInfo found but we know it's not me, try to get from chat participant
                if (
                  !senderInfo &&
                  !isMe &&
                  chat?.participants &&
                  chat.participants.length > 0
                ) {
                  const otherParticipant = chat.participants.find(
                    (p) => p._id !== (currentUser?.id || currentUser?._id)
                  );
                  senderInfo = otherParticipant || chat.participants[0];
                }

                return (
                  <MessageItem
                    key={msg._id}
                    message={{
                      ...msg,
                      text: msg.content?.text,
                      sender: isMe ? "me" : "them",
                      senderInfo: senderInfo,
                      time: formatTime(msg.createdAt),
                    }}
                  />
                );
              })}
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 px-2">
                <div className="flex space-x-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="text-sm">
                  {participant?.firstName} is typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <Space.Compact style={{ width: "100%" }} className="flex">
          <TextArea
            ref={inputRef}
            size="large"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onPressEnter={handleKeyPress}
            className="flex-1 e rounded "
            rows={1}
          />

          <Button
            size="large"
            type="primary"
            className="!rounded-r-lg bg-primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!message.trim()}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default MessageArea;
