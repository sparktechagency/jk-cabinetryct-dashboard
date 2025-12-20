import { io } from "socket.io-client";
const socketUrl = `${import.meta.env.VITE_BASE_URL}`;

let socket;
let onlineUsers = new Set();
let connectionListeners = [];
let onlineStatusListeners = [];

export const initSocket = (token) => {
  if (socket) {
    return socket;
  }

  // Connect to the socket server with authentication
  socket = io(socketUrl, {
    auth: {
      token: token, // JWT token for authentication
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
    notifyConnectionListeners(true);
  });

  socket.on("user:connected", (data) => {
    console.log("User connected:", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
    notifyConnectionListeners(false);
    if (reason === "io server disconnect") {
      // Server disconnected - need to reconnect manually
      socket.connect();
    }
    // else: socket will try to reconnect automatically
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
    if (error.message.includes("Authentication")) {
      // Token expired or invalid - notify app to handle refresh
      notifyConnectionListeners(false, "auth_error");
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("Reconnected after", attemptNumber, "attempts");
    notifyConnectionListeners(true, "reconnected");
  });

  socket.on("reconnect_failed", () => {
    console.error("Failed to reconnect after all attempts");
    notifyConnectionListeners(false, "reconnect_failed");
  });

  socket.on("auth-error", (error) => {
    console.error("Authentication failed:", error.message);
    notifyConnectionListeners(false, "auth_error");
  });

  socket.on("rate-limited", (data) => {
    console.warn(
      `Rate limited on ${data.event}. Retry after ${data.retryAfter}s`
    );
    // Notify listeners about rate limiting
    connectionListeners.forEach((listener) => {
      if (listener.onRateLimited) {
        listener.onRateLimited(data);
      }
    });
  });

  // Online status tracking
  socket.on("user:online", (data) => {
    const { userId, isOnline } = data;
    if (isOnline) {
      onlineUsers.add(userId);
    } else {
      onlineUsers.delete(userId);
    }
    notifyOnlineStatusListeners(userId, isOnline, data.userProfile);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    onlineUsers.clear();
  }
};

// Connection status listeners
const notifyConnectionListeners = (isConnected, reason = null) => {
  connectionListeners.forEach((listener) => {
    if (listener.onConnectionChange) {
      listener.onConnectionChange(isConnected, reason);
    }
  });
};

export const addConnectionListener = (listener) => {
  connectionListeners.push(listener);
  return () => {
    connectionListeners = connectionListeners.filter((l) => l !== listener);
  };
};

// Online status listeners
const notifyOnlineStatusListeners = (userId, isOnline, userProfile) => {
  onlineStatusListeners.forEach((listener) => {
    listener(userId, isOnline, userProfile);
  });
};

export const addOnlineStatusListener = (listener) => {
  onlineStatusListeners.push(listener);
  return () => {
    onlineStatusListeners = onlineStatusListeners.filter((l) => l !== listener);
  };
};

// Get current online users
export const getOnlineUsers = () => new Set(onlineUsers);

// Check if a specific user is online
export const isUserOnline = (userId) => onlineUsers.has(userId);
