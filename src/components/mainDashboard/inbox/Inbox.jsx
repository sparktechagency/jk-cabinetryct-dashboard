import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchConversationList } from "../../../utils/messagingService";
import ChatList from "./ChatList/ChatList";
import MessageArea from "./MessageArea/MessageArea";

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Handle query parameters to open specific chat
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId && !selectedChat) {
      // Try to find the conversation for this user
      fetchConversationList({ page: 1, limit: 50, searchTerm: "" })
        .then((data) => {
          // Look for a conversation where this user is a participant (but not the current user)
          const conversation = data.docs?.find((conv) =>
            conv.participants?.some((participant) => participant._id === userId)
          );

          if (conversation) {
            // If conversation exists, select it
            setSelectedChat(conversation);
            setShowMobileChat(true);
          } else {
            // If no conversation exists, just store the user ID to initiate a new chat
            // We'll need to get the user details for proper display
            setSelectedChat({
              participants: [{ _id: userId }],
              participant: { _id: userId },
              _id: null, // Indicate this is not a real conversation yet
            });
            setShowMobileChat(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
          // Create a minimal chat object with just the participant info
          setSelectedChat({
            participants: [{ _id: userId }],
            participant: { _id: userId },
            _id: null, // Indicate this is not a real conversation yet
          });
          setShowMobileChat(true);
        });
    }
  }, [searchParams, selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    // Update URL with the user ID
    const userId = chat.participant?._id || chat.participants?.[0]?._id;
    if (userId) {
      setSearchParams({ user: userId });
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="border border-gray-200 h-[calc(100vh-160px)] flex shadow-none overflow-hidden rounded-lg">
      {/* Left: Chat List - hide on mobile when chat is selected */}
      <div
        className={`w-full md:w-96 border-r border-gray-200 bg-white ${
          showMobileChat ? "hidden md:block" : "block"
        }`}
      >
        <ChatList selectedChat={selectedChat} onSelectChat={handleSelectChat} />
      </div>

      {/* Right: Message Area - show on mobile when chat is selected */}
      <div
        className={`flex-1 flex-col ${
          showMobileChat ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedChat ? (
          <MessageArea chat={selectedChat} onBack={handleBackToList} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
