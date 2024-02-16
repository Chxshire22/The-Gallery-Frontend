import SendMessageBar from "./UiComponents/SendMessageBar";
import ChatBubble from "./UiComponents/ChatBubble";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import { BACKEND_URL } from "./lib/constants";
import axios from "axios";
import io from "socket.io-client";
import { storage, DB_STORAGE_CHAT_IMAGE_KEY } from "./lib/firebase";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

export default function Chatroom() {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState();
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { chatroomId } = useParams();
  console.log(`chat`, chatroomId);

  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(currentUser);
    setUserId(currentUser.id);
    setUsername(currentUser.username);
  }, [currentUser]);

  //Set-up for socket.io
  const socket = io.connect(BACKEND_URL);

  //Retrieves existing messages for specific chatroom
  const getAllMessages = async () => {
    const messagesData = await axios.get(
      `${BACKEND_URL}/chat/chatroom/${chatroomId}`
    );
    setAllMessages(messagesData.data);
  };

  useEffect(() => {
    getAllMessages();
  }, [loaded]);

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const convertISOToString = (isoDate = new Date().toISOString()) => {
    const dateObject = new Date(isoDate);
    return dateObject.toLocaleString("en-sg"); // You can use other formatting options as needed
  };

  /*
   * Submitting data will happen in 3 steps
   * 1) If there is image, first upload to firebase to retrieve URL.
   * 2) POST message to chatroom_messages to get message ID.
   * 3) POST image to chat_images with the URL and ID
   *
   * */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageSrc = "";

    try {
      // Emit message to socket
      const emitSocketMessage = async () => {
        // Check if there's an image
        if (image !== "") {
          // Upload image to storage and get image URL
          const storageRefInstance = storageRef(
            storage,
            DB_STORAGE_CHAT_IMAGE_KEY + userId
          );
          await uploadBytes(storageRefInstance, image);
          imageSrc = await getDownloadURL(storageRefInstance);
          console.log("image", imageSrc);
        }
        // Emit message to socket with imageSrc
        socket.emit("send_message", {
          id: newMessage.length,
          comment: newMessage,
          sender: userId,
          chat_images: imageSrc, // Include imageSrc if there's an image
        });
      };

      await emitSocketMessage();

      // Post message to backend
      const messageResponse = await axios.post(`${BACKEND_URL}/chat/message`, {
        comment: newMessage,
        chatroomId: chatroomId,
        sender: userId,
      });

      // If there's an image, post image data to backend
      if (image !== "") {
        const messageId = messageResponse.data.id;
        await axios.post(`${BACKEND_URL}/chat/image`, {
          url: imageSrc, // Use imageSrc from the response
          chatroomMessagesId: messageId,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Clear new message state
    setNewMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) =>
      setAllMessages([...allMessages, data])
    );
    console.log("new");
  }, [socket, allMessages]);

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
          {/* <span className="w-3/4 text-sm font-semibold ml-6 text-slate-500">
            @jessday
          </span> */}
        </div>
        <div className="h-10"></div>
        <hr />
        <div className="pb-20">
          {allMessages &&
            allMessages.map((item) => (
              <ChatBubble
                key={item.id}
                comment={item.comment}
                username={item.sender == userId ? username : item.user.username}
                chatImg={
                  item.chat_images.length > 0 ? item.chat_images[0].url : null
                }
                senderId={item.sender}
                // profilePic={item.user.profilePicture}
                timestamp={item.createdAt}
              />
            ))}
        </div>

        <form className="fixed right-0 left-0 bottom-0 pb-2 w-full flex justify-center">
          <div className=" rounded-full h-12 flex flex-row bg-slate-200 mt-10 items-center">
            <button type="button" className="ml-3">
              <input
                type="file"
                onChange={handleImageChange}
                name=""
                id="file-upload"
                className="hidden"
              />
              <label className="cursor-pointer" htmlFor="file-upload">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#83C0C1"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </button>
            <input
              className=" ml-4 border-0 h-8 flex-1 outline-none p-4 bg-slate-200 caret-white text-left font-semibold"
              type="text"
              autoFocus
              placeholder="Send message"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
            />
            {/* SUBMIT */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="h-9 rounded-full w-9 mr-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#83C0C1"
                className="w-6 h-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
