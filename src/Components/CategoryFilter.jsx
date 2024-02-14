import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "./lib/constants";
import { useAuth0 } from "@auth0/auth0-react";
import ListingPreviewCard from "./UiComponents/ListingPreviewCard";
import Navbar from "./UiComponents/Navbar";

function CategoryFilter() {
  const [filteredListings, setFilteredListings] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { categoryName } = useParams();
  const { isAuthenticated } = useAuth0();

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

  const getCategoryListings = async () => {
    const categoryId = await axios.get(
      `${BACKEND_URL}/categories/name/${categoryName}`
    );
    const filteredResults = await axios.get(
      `${BACKEND_URL}/listings/category?category=${categoryId.data.id}&page=${page}`
    );
    const filteredListings = filteredResults.data.listings;
    setFilteredListings((prev) => [...prev, ...filteredListings]);
    setHasMore(filteredResults.data.next.exists);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    setError(false);
    console.log(categoryName);
    getCategoryListings();
  }, [page]);

  useEffect(() => {
    console.log("filteredListings", filteredListings);
  }, [filteredListings]);

  return (
    <>
      <div className="h-screen mx-4 mt-4">
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
              <h2 className="font-bold ml-4 flex-1 text-white test">Back</h2>
            </div>{" "}
          </div>
          <hr />
          <h2 className="font-semibold text-lg text-black/80 mt-4 text-center">
            {categoryName}
          </h2>
        </header>
        <div className="w-full flex flex-wrap gap-4 justify-center mt-4">
          {filteredListings.map((listing, index) => {
            if (filteredListings.length === index + 1) {
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
        <Navbar />
      </div>
    </>
  );
}

export default CategoryFilter;
