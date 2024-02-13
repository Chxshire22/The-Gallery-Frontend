import { useNavigate, useParams } from "react-router-dom";
import Carousel from "./UiComponents/Carousel";
import ReviewBlock from "./UiComponents/ReviewBlock";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { useCurrentUserContext } from "./lib/context/currentUserContext";

export default function Listing() {
  const [userId, setUserId] = useState();
  const [listingData, setListingData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    console.log(listingId);
    getListingData();
  }, []);

  useEffect(() => {
    setUserId(currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    if (listingData.listing_images) setLoading(false);
  }, [listingData]);

  const getListingData = async () => {
    const listingData = await axios.get(`${BACKEND_URL}/listings/${listingId}`);
    console.log(listingData.data);
    setListingData(listingData.data);
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

  return (
    <>
      <div className="h-screen mx-4 mt-4">
        {loading ? (
          <div className="h-full w-full flex justify-center items-center">
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
            </div>
            <h2 className="font-bold text-xl pb-2">Description</h2>
            <p className="text-sm pb-8">{listingData.description}</p>
            {listingData.category ? (
              <button className=" bg-[#6C22A6]/60 text-white outline-none border-none  opacity-80 hover:opacity-100 transition ease-in py-1 px-2 rounded-full mb-4">
                {listingData.category.name}
              </button>
            ) : null}
            <hr />
            <h2 className="font-bold text-xl my-4">Reviews</h2>
            <div className="pt-2 pb-16">
              <ReviewBlock />
              <ReviewBlock />
              <ReviewBlock />
            </div>
            <button
              onClick={() => navigate("/checkout")}
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
