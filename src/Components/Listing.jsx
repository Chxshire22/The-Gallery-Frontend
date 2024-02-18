import { useNavigate, useParams } from "react-router-dom";
import Carousel from "./UiComponents/Carousel";
import AddReview from "./AddReview";
import ReviewBlock from "./UiComponents/ReviewBlock";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { useCurrentUserContext } from "./lib/context/currentUserContext";

export default function Listing() {
  const [userId, setUserId] = useState();
  const [listingData, setListingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { currentUser, currentUserLikes } = useCurrentUserContext();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    console.log(listingId);
    getListingData();
  }, []);

  useEffect(() => {
    setUserId(currentUser.id);
    if (listingId in currentUserLikes) {
      setLiked(true);
    }
  }, [currentUserLikes]);

  useEffect(() => {
    if (listingData.listing_images) setLoading(false);
  }, [listingData]);

  const getListingData = async () => {
    const listingData = await axios.get(`${BACKEND_URL}/listings/${listingId}`);
    const likesCount = await axios.get(
      `${BACKEND_URL}/likes/count/${listingId}`
    );

    console.log(listingData.data);
    console.log(`likes count ${likesCount.data}`);
    setListingData(listingData.data);
    setLikesCount(likesCount.data);
    setReviews(listingData.data.reviews);
  };

  const imgArr = listingData.listing_images?.map((image) => image.url);

  // Creates request to find/ create chatroom
  const handleClick = async () => {
    console.log(listingId);

    let response = await axios.post(`${BACKEND_URL}/chat/chatroom`, {
      listingId: listingId,
      potentialBuyerId: userId,
    });

    const chatroomId = response.data.id;
    console.log(chatroomId);

    navigate(`/chat/${chatroomId}`);
  };

  const handleLike = async () => {
    try {
      const like = await axios.post(`${BACKEND_URL}/likes`, {
        listingId,
        userId: currentUser.id,
      });
      console.log(like.data);
      setLikesCount((prev) => prev + 1);
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
      setLikesCount((prev) => prev - 1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen mx-4 mt-4 lg:px-[30rem] ">
        {loading ? (
          <div className="h-full w-full flex justify-center items-center ">
            <span className="loading loading-spinner text-[#6962AD]/60 loading-lg"></span>
          </div>
        ) : (
          <>
            {" "}
            <header className="mx-4 mt-2 mb-4">
              <div className="h-10 w-full flex flex-row items-center">
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
                  <h2 className="font-bold ml-4 flex-1 text-white test">
                    Back
                  </h2>
                </div>{" "}
              </div>
              <hr />
            </header>
            <div className=" lg:w-[40rem] lg:mx-auto">
              <h2 className="font-bold leading-10 mt-4 text-2xl">
                {listingData.title}
              </h2>
              <h3 className="font-bold leading-10 mt-2 mb-4 text-xl">
                ${listingData.price}
              </h3>
              <Carousel imgArr={imgArr} />
              <div className="flex flex-row items-center gap-5 py-4">
                <img
                  src={listingData.seller.profilePicture}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover object-center"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-xl">
                    {listingData.seller.firstName} {listingData.seller.lastName}
                  </h3>
                  <h2 className="font-semibold text-sm">
                    @{listingData.seller.username}
                  </h2>
                </div>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#83C0C1"
                  className="w-10 h-10"
                  onClick={handleClick}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex flex-row justify-center items-center cursor-pointer m-auto">
                  <p className="text-xs font-bold text-[#F38787]">
                    {likesCount}
                  </p>
                  {liked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#F38787"
                      className="w-8 h-8"
                      onClick={handleUnlike}
                    >
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#F38787"
                      className="w-8 h-8"
                      onClick={handleLike}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <h2 className="font-bold text-xl pb-2">Description</h2>
              <p className="text-sm pb-8">{listingData.description}</p>
              {listingData.category ? (
                <button className=" bg-[#6C22A6]/60 text-white outline-none border-none  opacity-80 hover:opacity-100 transition ease-in py-1 px-2 rounded-full mb-4">
                  {listingData.category.name}
                </button>
              ) : null}
            </div>
            <hr />
            <h2 className="font-bold text-xl my-4">Reviews</h2>
            <div className="pt-2 pb-16">
              {reviews &&
                reviews.map((review) => (
                  <ReviewBlock
                    key={review.id}
                    comment={review.comment}
                    rating={review.rating}
                    name={
                      review.user.firstName || review.user.lastName
                        ? `${review.user.firstName} ${review.user.lastName}`
                        : review.user.username
                    }
                    profileImg={review.user.profilePicture}
                  />
                ))}

              {listingData.buyerId === userId && (
                <AddReview userId={userId} listingId={listingId} />
              )}
            </div>
            <button
              onClick={() => navigate(`/checkout/${listingId}`)}
              className="btn w-28 bg-[#6C22A6] text-white outline-none border-none fixed bottom-8 right-5 z-19 opacity-80 hover:opacity-100 transition ease-in"
            >
              {" "}
              Order
            </button>
          </>
        )}
      </div>
    </>
  );
}
