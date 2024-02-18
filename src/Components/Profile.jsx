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
    getUserByParams();
  }, []);

  useEffect(() => {
    if (userProfile.id) {
      getListingsOfUser();
    }
  }, [userProfile]);

  const navigate = useNavigate();
  return (
    <div>
      {userProfile.style && <style>{`${userProfile.style}`}</style>}

      <main className="h-full px-4 lg:px-[30rem] pt-4">
        <div className="flex flex-row items-center gap-2  lg:h-[10rem] lg:mt-24 mb-4">
          {userProfile.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt=""
              className="h-28 w-28 lg:w-45 lg:h-45 rounded-full object-cover object-center flex-shrink-0"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-slate-300/50 flex-shrink-0 flex justify-center items-center">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          )}
          <div className="flex flex-col gap-1 justify-center">
            <h1 className="font-semibold text-xl">
              {userProfile.firstName} {userProfile.lastName}
            </h1>
            <h2 className="font-bold text-black/80 text-sm">
              @{userProfile.username}
            </h2>
            <p className="text-xs">{userProfile.bio}</p>
          </div>
        </div>

        <h2 className="font-bold text-2xl text-center underline">Listings</h2>

        <ul className="flex flex-col  lg:gap-8 lg:flex-row lg:flex-wrap justify-center items-center">
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
        <div className="pt-2 pb-16"></div>
        <Navbar />
      </main>
    </div>
  );
}
