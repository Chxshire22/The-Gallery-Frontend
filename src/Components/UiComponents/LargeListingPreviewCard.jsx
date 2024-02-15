import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteListing } from "../lib/utilities";
import { useCurrentUserContext } from "../lib/context/currentUserContext";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants";

export default function LargeListingPreviewCard(props) {
  const { currentUser, currentUserLikes } = useCurrentUserContext();
  const [liked, setLiked] = useState(false);

  const [deleted, setDeleted] = useState(false);

  const { user, isAuthenticated } = useAuth0();

  const { title, price, id, images, email } = props;

  const imgArr = images.map((image) => image.url);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(currentUserLikes);
    if (id in currentUserLikes) {
      setLiked(true);
    }
  }, [currentUserLikes]);

  const handleLike = async () => {
    try {
      const like = await axios.post(`${BACKEND_URL}/likes`, {
        listingId: id,
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
        `${BACKEND_URL}/likes/delete/${id}/${currentUser.id}`
      );
      console.log(unlike.data);
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <article className={`mt-2 ${deleted ? `hidden` : ``}`}>
        <hr />
        <div>
          <div className="flex flex-row items-center">
            <h2
              className="font-bold leading-10 my-auto flex-1 text-2xl"
              onClick={() => navigate(`/listing/${id}`)}
            >
              {title}
            </h2>

            {/* DROPDOWN */}

            {isAuthenticated ? (
              <div className="dropdown dropdown-bottom dropdown-end flex-initial">
                <div tabIndex={0} role="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
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
                  {user.email == email ? (
                    <>
                      <li>
                        <a>Sold</a>
                      </li>
                      <li>
                        <a>Reserved</a>
                      </li>
                      <li
                        onClick={() => {
                          deleteListing(id);
                          setDeleted(true);
                        }}
                      >
                        <a>Delete</a>
                      </li>
                    </>
                  ) : (
                    <>
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
                        <a>Buy</a>
                      </li>
                      <li>
                        <a>Report</a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            ) : null}
          </div>
          <h3
            className="font-bold leading-10 mb-2 text-xl"
            onClick={() => navigate(`/listing/${id}`)}
          >
            ${price}
          </h3>
        </div>
        <div className="">
          <Carousel imgArr={imgArr} />
          <div className="h-10"></div>
        </div>
      </article>
    </>
  );
}
