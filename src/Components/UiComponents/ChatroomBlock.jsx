import { useNavigate } from "react-router-dom";

function ChatroomBlock({
  chatroomId,
  potentialBuyerId,
  userId,
  username,
  profileImg,
  name,
  listing,
}) {
  const navigate = useNavigate();

  return (
    <div className=" h-16 w-full flex flex-row items-center mt-2 hover:bg-slate-50 transition ease-in">
      <img
        onClick={() => navigate(`/profile/${username}`)}
        className="h-12 w-12 rounded-full object-cover object-center flex-initial cursor-pointer"
        src={profileImg}
        alt="User profile image"
      />
      <div
        onClick={() => navigate(`/chat/${chatroomId}`)}
        className="flex-1 cursor-pointer h-full"
      >
        <div className="flex flex-col h-full ">
          <div className="h-[1px] bg-slate-400 opacity-60"></div>
          <div className=" h-1/2 flex flex-row items-center">
            <h3 className="font-bold ml-6">
              {name !== "null null" ? name : username}
            </h3>
            <p className="text-xs font-semibold opacity-60 ml-4">{`@${username}`}</p>
            <span className="mx-1 text-xs font-semibold opacity-60">|</span>{" "}
            {potentialBuyerId === userId ? (
              <p className="text-xs font-semibold opacity-60 ml-1">Buyer</p>
            ) : (
              <p className="text-xs font-semibold opacity-60 ml-1">Seller</p>
            )}
            {/* <p className="text-xs font-semibold opacity-60 ml-1">10 days ago</p> */}
          </div>
          <div className=" h-1/2">
            <p className="ml-6 text-sm text-slate-500 font-medium">{listing}</p>
          </div>
        </div>
      </div>
      {/* Dropdown */}

      {/* <div className="dropdown dropdown-bottom dropdown-end flex-initial">
        <div tabIndex={0} role="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-28"
        >
          <li>
            <a>Report</a>
          </li>
          <li>
            <a>Delete</a>
          </li>
        </ul>
      </div> */}
    </div>
  );
}

export default ChatroomBlock;
