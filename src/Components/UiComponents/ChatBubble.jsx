import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../lib/context/currentUserContext";

export default function ChatBubble({ comment, chatImg, senderId }) {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const content = comment;

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    setUserId(currentUser.id);
  }, [currentUser]);

  return (
    <div className="mt-2">
      <div
        className={"chat" + (senderId == userId ? " chat-end" : " chat-start")}
      >
        <div
          onClick={() => navigate(`/profile/${senderId}`)}
          className="chat-image avatar cursor-pointer"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <div className="chat-header">
          {/* <time className="text-xs opacity-50">{createdAt}</time> */}
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
