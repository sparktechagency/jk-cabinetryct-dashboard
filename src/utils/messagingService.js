import { getSocket } from "./socket";

// Conversation List
export const fetchConversationList = (params = {}) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit(
      "conversation-list",
      {
        page: params.page || 1,
        limit: params.limit || 50,
        searchTerm: params.searchTerm || "",
      },
      (response) => {
        if (response.success) {
          // Transform the response to match what the components expect
          const transformedData = {
            docs: response.data.results || [],
            totalDocs: response.data.pagination?.totalResult || 0,
            limit: response.data.pagination?.limit || 50,
            totalPages: response.data.pagination?.totalPages || 1,
            page: response.data.pagination?.page || 1,
            pagingCounter: response.data.pagination?.page || 1,
            hasPrevPage: response.data.pagination?.page > 1,
            hasNextPage:
              response.data.pagination?.page <
              response.data.pagination?.totalPages,
            prevPage:
              response.data.pagination?.page > 1
                ? response.data.pagination.page - 1
                : null,
            nextPage:
              response.data.pagination?.page <
              response.data.pagination?.totalPages
                ? response.data.pagination.page + 1
                : null,
          };
          resolve(transformedData);
        } else {
          reject(
            new Error(response.message || "Failed to fetch conversation list")
          );
        }
      }
    );
  });
};

// Get Messages
export const fetchMessages = (receiverId, params = {}) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit(
      "get-messages",
      {
        receiverId,
        page: params.page || 1,
        limit: params.limit || 50,
      },
      (response) => {
        if (response.success) {
          // Transform the response to match what the components expect
          const transformedData = {
            docs: response.data.results || [],
            totalDocs: response.data.pagination?.totalResult || 0,
            limit: response.data.pagination?.limit || 50,
            totalPages: response.data.pagination?.totalPages || 1,
            page: response.data.pagination?.page || 1,
            pagingCounter: response.data.pagination?.page || 1,
            hasPrevPage: response.data.pagination?.page > 1,
            hasNextPage:
              response.data.pagination?.page <
              response.data.pagination?.totalPages,
            prevPage:
              response.data.pagination?.page > 1
                ? response.data.pagination.page - 1
                : null,
            nextPage:
              response.data.pagination?.page <
              response.data.pagination?.totalPages
                ? response.data.pagination.page + 1
                : null,
          };
          resolve(transformedData);
        } else {
          reject(new Error(response.message || "Failed to fetch messages"));
        }
      }
    );
  });
};

// Send Message via Socket
export const sendMessage = (messageData) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("send-message", messageData, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to send message"));
      }
    });
  });
};

// Get unviewed message count via Socket
export const getUnviewedMessageCount = () => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("get-unviewed-message-count", {}, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(
          new Error(response.message || "Failed to get unviewed message count")
        );
      }
    });
  });
};

// Mark Message as Seen
export const markMessageSeen = (messageId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("mark-seen", { messageId }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to mark message as seen"));
      }
    });
  });
};

// Delete Message
export const deleteMessage = (messageId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("delete-message", { messageId }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to delete message"));
      }
    });
  });
};

// Update Message
export const updateMessage = (messageId, newContent) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit(
      "update-message",
      { messageId, message: newContent },
      (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.message || "Failed to update message"));
        }
      }
    );
  });
};

// Add Reaction
export const addReaction = (messageId, emoji) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("add-reaction", { messageId, emoji }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to add reaction"));
      }
    });
  });
};

// Send Typing Start
export const sendTypingStart = (receiverId) => {
  const socket = getSocket();
  if (!socket) {
    console.error("Socket not connected");
    return;
  }

  socket.emit("typing-start", { receiverId });
};

// Send Typing Stop
export const sendTypingStop = (receiverId) => {
  const socket = getSocket();
  if (!socket) {
    console.error("Socket not connected");
    return;
  }

  socket.emit("typing-stop", { receiverId });
};

// Remove Reaction
export const removeReaction = (messageId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("remove-reaction", { messageId }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to remove reaction"));
      }
    });
  });
};

// Search Messages in Conversation
export const searchMessages = (receiverId, searchTerm, params = {}) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit(
      "search-messages",
      {
        receiverId,
        searchTerm,
        page: params.page || 1,
        limit: params.limit || 20,
      },
      (response) => {
        if (response.success) {
          const transformedData = {
            docs: response.data.results || [],
            totalDocs: response.data.pagination?.totalResult || 0,
            limit: response.data.pagination?.limit || 20,
            totalPages: response.data.pagination?.totalPages || 1,
            page: response.data.pagination?.page || 1,
          };
          resolve(transformedData);
        } else {
          reject(new Error(response.message || "Failed to search messages"));
        }
      }
    );
  });
};

// Get Online Users List
export const fetchOnlineUsers = () => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("get-online-users", (response) => {
      if (response.success) {
        resolve(response.data.onlineUsers || []);
      } else {
        reject(new Error(response.message || "Failed to get online users"));
      }
    });
  });
};

// Mark All Messages from Receiver as Seen
export const markConversationSeen = (receiverId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("mark-seen", { receiverId }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response.message || "Failed to mark conversation as seen"));
      }
    });
  });
};

// Get Unviewed Message Count for Specific Chat
export const getUnviewedCountForChat = (chatId) => {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    if (!socket) {
      reject(new Error("Socket not connected"));
      return;
    }

    socket.emit("get-unviewed-message-count", { chatId }, (response) => {
      if (response.success) {
        resolve(response.data);
      } else {
        reject(
          new Error(response.message || "Failed to get unviewed message count")
        );
      }
    });
  });
};
