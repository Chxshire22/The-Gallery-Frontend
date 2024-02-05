import SendMessageBar from "./UiComponents/SendMessageBar";
import ChatBubbles from "./UiComponents/ChatBubble";
import { useNavigate } from "react-router-dom";
export default function Chatroom(){
	const navigate = useNavigate()
	return (
    <>
      <div className="h-screen mx-4 mt-2">
        <div className="h-10 w-full flex flex-row items-center">
          <div onClick={()=> navigate(`/chats`)} className="flex flex-row items-center mb-2 px-4 bg-[#83C0C1] h-full rounded-full  cursor-pointer">
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
        <hr />
        <ChatBubbles />
        <SendMessageBar />
      </div>
    </>
  );
}
