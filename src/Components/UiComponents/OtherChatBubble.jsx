import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../lib/context/currentUserContext";

export default function ChatBubble({
  comment,
  chatImg,
  senderId,
  profilePic,
  timestamp,
}) {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const content = comment;

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    setUserId(currentUser.id);
  }, [currentUser]);

  // Function to convert ISO date to string format
  const convertISOToString = (isoDate) => {
    const dateObject = new Date(isoDate);
    return dateObject.toLocaleString("en-sg"); // You can use other formatting options as needed
  };

  return (
    <div className="mt-2">
      <div className={"chat chat-start"}>
        <div className="chat-image avatar cursor-pointer">
          <div className="w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component" src={profilePic} />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50">
            {convertISOToString(timestamp)}
          </time>
        </div>
        <div className="chat-bubble bg-slate-200">
          {content && content}
          {chatImg && (
            <img
              className="min-w-48 max-w-full object-center object-contain rounded"
              src={chatImg}
            ></img>
          )}
        </div>
      </div>
    </div>
  );
}
