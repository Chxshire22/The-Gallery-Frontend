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
  const lastCardElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && hasMore){
        console.log("visible")
        setPage(prevPage => prevPage + 1)
      }
    })
    if(node)observer.current.observe(node)
    console.log(node);
  },[loading,hasMore]);

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
      <div className="h-screen relative">
        <div className=" h-40 w-full overflow-hidden">
          <img
            className="object-cover object-center"
            src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
        <h1 className="text-center font-bold antialiased underline">For you</h1>
        <div className="w-full flex flex-wrap gap-4 justify-center mt-4">
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
