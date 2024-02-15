import axios from "axios";
import MediumListingPreviewCard from "./UiComponents/MediumListingPreviewCard";
import Navbar from "./UiComponents/Navbar";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "./lib/constants";
import { useCurrentUserContext } from "./lib/context/currentUserContext";

export default function Likes() {
  // GET REQ FOR ARR OF LISTING, MAP AND PASS PROPS INTO LISTING PREVIEW CARD
  const [likedListings, setLikedListings] = useState([]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { currentUser,currentUserLikes } = useCurrentUserContext();

  const getLikesList = async () => {
    const likes = await axios.get(
      `${BACKEND_URL}/likes/list/${currentUser.id}`
    );
    const likesList = likes.data;
    const likedListingArr = likesList.map(
      (likedListing) => likedListing.listing
    );
    console.log(likedListingArr);
    setLikedListings(likedListingArr);
  };

  //just to be clear - using the custom hook useCurrentUserContext() does not query db for user. it just retrieves the state
  useEffect(() => {
    console.log(currentUser.id);
    if (currentUser.id) {
      getLikesList();
    }
  }, [currentUser,currentUserLikes]);

  return (
    <>
      <div className="h-screen mx-4 mt-4">
        <div className="flex flex-row items-center w-full justify-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#6962AD"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <h2 className="font-bold">Likes</h2>
        </div>
        <hr />
        <div className="w-full flex flex-col gap-4 justify-center mt-4">
          {likedListings.map((likedListing, index) => (
            <MediumListingPreviewCard
              key={index}
              listingTitle={likedListing.title}
              listingId={likedListing.id}
              sellerUsername={likedListing.seller.username}
              sellerPfp={likedListing.seller.profilePicture}
              listingPrice={likedListing.price}
              listingDescription={likedListing.description}
              listingImage={likedListing.listing_images[0].url}
            />
          ))}
        </div>
        <div className=" h-20"></div>
        <Navbar />
      </div>
    </>
  );
}
