import Navbar from "./UiComponents/Navbar";
import LargeListingPreviewCard from "./UiComponents/LargeListingPreviewCard";
import ReviewBlock from "./UiComponents/ReviewBlock";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";

export default function Profile() {
  const [userProfile, setUserProfile] = useState({});
  const [listings, setListings] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // we always nav to profile with some param of username. Take the username in params, pass it to backend, then populate profile data on front end with that.

  let { paramUsername } = useParams();

  const getUserByParams = () => {
    axios.get(`${BACKEND_URL}/users/profile/${paramUsername}`).then((res) => {
      setUserProfile(res.data);
    });
  };

  const getListingsOfUser = async () => {
    const listings = await axios.get(
      `${BACKEND_URL}/listings/user/${userProfile.id}`
    );
    setListings(listings.data);
  };

  useEffect(() => {
    if (paramUsername) {
      getUserByParams();
    }
  }, [paramUsername]);

  useEffect(() => {
    if (userProfile) getListingsOfUser();
  }, [userProfile]);


  const navigate = useNavigate();
  return (
    <div>
      <style>{`${userProfile.style}`}</style>
      <main className="h-full px-4 pt-4">
        <div className="flex flex-row items-center gap-2 mb-4">
          {userProfile.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt=""
              className="h-28 w-28 rounded-full object-cover object-center flex-shrink-0"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-slate-300/50 flex-shrink-0 flex justify-center items-center">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          )}
          <div className="flex flex-col gap-1 justify-center">
            <p className="font-semibold text-xl">
              {userProfile.firstName} {userProfile.lastName}
            </p>
            <p className="font-bold text-black/80 text-sm">
              @{userProfile.username}
            </p>
            <p className="text-xs">{userProfile.bio}</p>
            <div className="flex items-center flex-row gap-1">
              <p className="text-xs font-bold text-black/50">Chat</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#83C0C1"
                className="w-6 h-6 chat-icon"
                onClick={() => navigate("/chat/1")}
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-2xl text-center underline">Listings</h2>

        <ul className="flex flex-col justify-center items-center">
          {listings
            .slice()
            .reverse()
            .map((listing) => (
              <LargeListingPreviewCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                id={listing.id}
                images={listing.listing_images}
                email={userProfile.email}
              />
            ))}
        </ul>

        {/* GET ALL LISTINGS, GET ALL REVIEWS TO EACH LISTING AND MAP HERE MAYBE DO PAGINATION?  */}
        <h2 className="font-bold text-xl my-4">Reviews</h2>
        <div className="pt-2 pb-16">
          <ReviewBlock />
          <ReviewBlock />
          <ReviewBlock />
        </div>
        <Navbar />
      </main>
    </div>
  );
}
