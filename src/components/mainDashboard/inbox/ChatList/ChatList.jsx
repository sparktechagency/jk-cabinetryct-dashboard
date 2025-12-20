/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchConversationList } from "../../../../utils/messagingService";
import ChatItem from "./ChatItem";
import {
  initSocket,
  getSocket,
  addOnlineStatusListener,
} from "../../../../utils/socket";
import { getToken } from "../../../../utils/authUtils";

const { Search } = Input;

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Initialize socket connection
  useEffect(() => {
    const token = getToken();
    if (token && !getSocket()) {
      const initializedSocket = initSocket(token);
      setSocket(initializedSocket);
    } else if (getSocket()) {
      setSocket(getSocket());
    }
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages to update conversation list (correct event name)
    const handleNewMessage = (message) => {
      setConversations((prev) => {
        // Check if conversation already exists
        const existingConvIndex = prev.findIndex(
          (conv) => conv._id === message.chatId
        );

        if (existingConvIndex !== -1) {
          // Update existing conversation
          const updated = prev.map((conv) => {
            if (conv._id === message.chatId) {
              return {
                ...conv,
                lastMessage: {
                  ...message,
                  content: message.content,
                },
                updatedAt: message.createdAt,
              };
            }
            return conv;
          });

          // Sort conversations by last message time (most recent first)
          return updated.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
        } else {
          // New conversation - get participant info from message object
          // The server should send senderId and receiverId as populated objects
          const currentUserData = JSON.parse(
            localStorage.getItem("user") || "{}"
          );
          const currentUserIdFromStorage =
            currentUserData._id || currentUserData.id;

          // Determine the other participant (the one who is not current user)
          let otherParticipant = null;

          // Check if senderId/receiverId are objects with user details
          if (typeof message.senderId === "object" && message.senderId?._id) {
            if (message.senderId._id !== currentUserIdFromStorage) {
              otherParticipant = message.senderId;
            }
          }
          if (
            !otherParticipant &&
            typeof message.receiverId === "object" &&
            message.receiverId?._id
          ) {
            if (message.receiverId._id !== currentUserIdFromStorage) {
              otherParticipant = message.receiverId;
            }
          }

          // If we have proper participant data, add the new conversation
          if (otherParticipant && otherParticipant.firstName) {
            const newConversation = {
              _id: message.chatId,
              participants: [otherParticipant],
              lastMessage: {
                ...message,
                content: message.content,
              },
              updatedAt: message.createdAt,
              createdAt: message.createdAt,
            };

            return [newConversation, ...prev];
          } else {
            // If participant data is incomplete, refresh the conversation list
            // to get proper data from server
            loadConversations(searchText);
            return prev;
          }
        }
      });
    };

    // Listen for message sent confirmation (for new conversations)
    const handleMessageSent = (message) => {
      // Check if this creates a new conversation
      setConversations((prev) => {
        const exists = prev.some((conv) => conv._id === message.chatId);
        if (!exists && message.chatId) {
          // Refresh to get the new conversation with proper participant data
          loadConversations(searchText);
        }
        return prev;
      });
    };

    // Listen for conversation updates
    const handleConversationUpdated = (data) => {
      const { lastMessage, chatId, timestamp } = data;
      setConversations((prev) => {
        // Check if conversation exists
        const exists = prev.some((conv) => conv._id === chatId);

        if (!exists) {
          // New conversation created - refresh list to get full data
          loadConversations(searchText);
          return prev;
        }

        const updated = prev.map((conv) => {
          if (conv._id === chatId) {
            return { ...conv, lastMessage, updatedAt: timestamp };
          }
          return conv;
        });
        // Sort by most recent
        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );
      });
    };

    // Listen for unviewed count updates
    const handleUnviewedCountUpdated = () => {
      loadConversations(searchText);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("message-sent", handleMessageSent);
    socket.on("conversation-updated", handleConversationUpdated);
    socket.on("unviewed-count-updated", handleUnviewedCountUpdated);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("message-sent", handleMessageSent);
      socket.off("conversation-updated", handleConversationUpdated);
      socket.off("unviewed-count-updated", handleUnviewedCountUpdated);
    };
  }, [socket, searchText]);

  // Track online users
  useEffect(() => {
    const removeListener = addOnlineStatusListener((userId, isOnline) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (isOnline) {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    return () => removeListener();
  }, []);

  // Helper function to get the other participant (not the current user)
  const getOtherParticipant = (conversation) => {
    const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserIdFromStorage = currentUserData._id || currentUserData.id;

    return (
      conversation.participants?.find(
        (p) => p._id !== currentUserIdFromStorage
      ) || conversation.participants?.[0]
    ); // fallback to first if current user not found
  };

  // Fetch conversations
  const loadConversations = useCallback(async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await fetchConversationList({
        page: 1,
        limit: 50,
        searchTerm,
      });
      setConversations(data?.docs || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load conversations on component mount and when search changes
  useEffect(() => {
    loadConversations(searchText);
  }, [searchText, loadConversations]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = getOtherParticipant(conv);
    return (
      otherParticipant?.firstName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      otherParticipant?.lastName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      conv.chatName?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-5 border-b">
        <Search
          placeholder="Search keyword"
          allowClear
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-full"
        />
      </div>

      {/* Chat Items */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            const lastMessage = conversation.lastMessage;
            const isOnline = onlineUsers.has(otherParticipant?._id);

            return (
              <ChatItem
                key={conversation._id}
                conversation={conversation}
                participant={otherParticipant}
                lastMessage={lastMessage}
                isOnline={isOnline}
                isSelected={
                  selectedChat?._id === conversation._id ||
                  selectedChat?.participant?._id === otherParticipant?._id ||
                  selectedChat?.participants?.[0]?._id === otherParticipant?._id
                }
                onClick={() =>
                  onSelectChat({
                    ...conversation,
                    participant: otherParticipant,
                  })
                }
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
