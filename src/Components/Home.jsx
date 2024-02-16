import { useNavigate } from "react-router-dom";
import Navbar from "./UiComponents/Navbar";
import ListingPreviewCard from "./UiComponents/ListingPreviewCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const observer = useRef();
  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("visible");
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const { isAuthenticated } = useAuth0();

  const getListings = async () => {
    try {
      const listings = await axios.get(
        `${BACKEND_URL}/listings/paginated?page=${page}`
      );
      const homeListings = listings.data.listings;
      setListings((prev) => [...prev, ...homeListings]);
      setHasMore(listings.data.next.exists);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  useEffect(() => {
    setLoading(true);
    setError(false);
    getListings();
    setLoading(false);
  }, [page]);

  return (
    <>
      <div className="h-screen lg:px-20 relative">
        <img
          className="object-cover object-center lg:mx-auto aspect-[16/9] 2xl:w-3/4 max-h-[50%] w-full overflow-hidden lg:mt-14 lg:rounded-b-box"
          src="https://firebasestorage.googleapis.com/v0/b/project3-8f0e6.appspot.com/o/assets%2FWarm%20Tone%20Simple%20Crafts%20Photo%20LinkedIn%20Article%20Cover%20Image.webp?alt=media&token=89409743-5eb0-4f4b-b10b-7f7ab73ad1f2"
          alt=""
        />

        <h1 className="text-center font-bold antialiased underline">For you</h1>
        <div className="w-full flex flex-wrap gap-4 md:gap-10 justify-center mt-4 ">
          {listings.map((listing, index) => {
            if (listings.length === index + 1) {
              return (
                <div ref={lastCardElementRef} key={listing.id}>
                  <ListingPreviewCard
                    listingId={listing.id}
                    title={listing.title}
                    price={listing.price}
                    image={listing.listing_images}
                    seller={listing.seller?.username}
                    profilePicture={listing.seller?.profilePicture}
                  />
                </div>
              );
            } else {
              return (
                <div key={listing.id}>
                  <ListingPreviewCard
                    listingId={listing.id}
                    title={listing.title}
                    price={listing.price}
                    image={listing.listing_images}
                    seller={listing.seller?.username}
                    profilePicture={listing.seller?.profilePicture}
                  />
                </div>
              );
            }
          })}
          <div>{loading && "loading..."}</div>
          <div>{error && "error"}</div>
        </div>
        <div className=" h-20"></div>
        <button
          onClick={() => navigate("/add-listing")}
          className={
            isAuthenticated
              ? "btn w-28 btn-accent fixed bottom-16 right-5 z-19 opacity-80 hover:opacity-100 transition ease-in"
              : "hidden"
          }
        >
          {" "}
          + Sell
        </button>

        <Navbar />
      </div>
    </>
  );
}
