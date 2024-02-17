import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../lib/context/currentUserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants";

export default function ListingPreviewCard(props) {
  const { listingId, title, price, image, seller, profilePicture } = props;
  const { currentUser, currentUserLikes } = useCurrentUserContext();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    console.log(currentUserLikes);
    if (listingId in currentUserLikes) {
      setLiked(true);
    }
  }, [currentUser, currentUserLikes]);

  const handleLike = async () => {
    try {
      const like = await axios.post(`${BACKEND_URL}/likes`, {
        listingId,
        userId: currentUser.id,
      });
      console.log(like.data);
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async () => {
    try {
      const unlike = await axios.delete(
        `${BACKEND_URL}/likes/delete/${listingId}/${currentUser.id}`
      );
      console.log(unlike.data);
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="w-40 md:w-60 lg:hover:scale-110 transition-transform ease-in flex flex-col listing-card-preview box-border border-2 border-black shadow-[4px_4px_0px_0px_#1a202c] rounded-lg bg-slate-50">
        <div className="h-8  flex flex-row rounded-t-lg items-center">
          <img
            onClick={() => navigate(`/profile/${seller}`)}
            className="w-8 h-8 rounded-full flex-initial cursor-pointer"
            src={profilePicture}
          ></img>
          <h2
            onClick={() => navigate(`/profile/${seller}`)}
            className="font-bold ml-2 flex-1 cursor-pointer"
          >
            {seller}
          </h2>
          {/* Dropdown */}

          <div className="dropdown dropdown-bottom dropdown-end flex-initial">
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
              {liked ? (
                <li onClick={handleUnlike}>
                  <a>Unlike</a>
                </li>
              ) : (
                <li onClick={handleLike}>
                  <a>Like</a>
                </li>
              )}

              <li>
                <a>Report</a>
              </li>
              <li>
                <a>Buy</a>
              </li>
            </ul>
          </div>
        </div>
        <div
          onClick={() => {
            navigate(`/listing/${listingId}`);
            window.location.reload();
          }}
          className="cursor-pointer"
        >
          <img
            className="w-40 md:w-60 aspect-[4/5] object-cover object-center border-black border-t-2 border-b-2"
            src={image ? image[0].url : null}
            alt=""
          />
        </div>
        <div className="rounded-b-lg flex flex-row items-center  h-full">
          <p className="font-bold max-w-50 flex-1 overflow-hidden text-sm ml-1 align-middle whitespace-pre">
            {title}
          </p>
          <div className="bg-black h-full ">
            <p className="text-white font-bold flex-initial align-middle mx-1">
              ${price}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
