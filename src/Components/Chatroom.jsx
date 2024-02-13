import SendMessageBar from "./UiComponents/SendMessageBar";
import ChatBubble from "./UiComponents/ChatBubble";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import { BACKEND_URL } from "./lib/constants";
import axios from "axios";

export default function Chatroom() {
  const [allMessages, setAllMessages] = useState([]);
  const { chatroomId } = useParams();
  console.log(`chat`, chatroomId);

  const { currentUser } = useCurrentUserContext();

  //Retrieves existing messages for specific chatroom
  const getAllMessages = async () => {
    const messagesData = await axios.get(
      `${BACKEND_URL}/chat/chatroom/${chatroomId}`
    );
    setAllMessages(messagesData.data);
    console.log("allMessages type:", typeof allMessages);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  return (
    <>
      <div className="h-screen mx-4 mt-2">
        <div className="h-10 w-full flex flex-row items-center fixed top-0 z-20 mt-2">
          <div
            onClick={() => navigate(-1)}
            className="flex flex-row items-center mb-2 px-4 bg-[#83C0C1] h-full rounded-full  cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>{" "}
            <h2 className="font-bold ml-4 flex-1 text-white">Back</h2>
          </div>{" "}
          <span className="w-3/4 text-sm font-semibold ml-6 text-slate-500">
            @jessday
          </span>
        </div>
        <div className="h-10"></div>
        <hr />
        <ChatBubble />
        {allMessages &&
          allMessages.map((item) => (
            <ChatBubble
              key={item.id}
              comment={item.comment}
              chatImg={
                item.chat_images.length > 0 ? item.chat_images[0].url : null
              }
              senderId={item.sender}
            />
          ))}

        <SendMessageBar />
      </div>
    </>
  );
}
