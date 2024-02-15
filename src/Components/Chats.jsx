import Navbar from "./UiComponents/Navbar";
import Search from "./UiComponents/SearchBar";
import ChatroomBlock from "./UiComponents/ChatroomBlock";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const [chatrooms, setChatrooms] = useState([]);
  const [userId, setUserId] = useState();

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  //Retrieves current user
  useEffect(() => {
    setUserId(currentUser.id);
    console.log("pic", currentUser.profilePicture);
  }, [currentUser]);

  // const {profilePicture} = currentUser
  // get current user
  // get find all chat where currentUser is sender
  // get chat with eager loading for listing
  // if listing sellerId == currentUser
  // do css or html to mark that the chatroom block is a room where currentUser.id is sellerId

  //Retrieves existing chatrooms for user, who can be either seller/ buyer
  const getAllChatrooms = async () => {
    console.log("user", currentUser.id);

    const chatroomsData = await axios.get(
      `${BACKEND_URL}/chat/${currentUser.id}`
    );
    setChatrooms(chatroomsData.data);
  };

  //When user ID is retrieved, get all chatrooms for specific user
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          await getAllChatrooms();
        } catch (error) {
          // show error if getAllChatrooms() fails
          console.error("Error fetching chatrooms:", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  return (
    <>
      <div className="h-screen mx-4 mt-4">
        <div className="flex flex-row items-center">
          <img
            className="h-10 w-10 rounded-full object-cover object-center"
            src={currentUser.profilePicture}
            alt="user profile image"
          />
          <h1 className="font-semibold text-xl ml-2">Messages</h1>
        </div>
        {/* <Search searchType={searchType} /> */}
        <div className="flex flex-col"></div>
        {chatrooms &&
          chatrooms.map((item) => (
            <ChatroomBlock
              key={item.id}
              chatroomId={item.id}
              potentialBuyerId={item.potentialBuyerId}
              userId={userId}
              listing={item.listing}
              user={item.user}
            />
          ))}
        <Navbar />
      </div>
    </>
  );
}
