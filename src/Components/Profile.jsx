import Navbar from "./UiComponents/Navbar";
import LargeListingPreviewCard from "./UiComponents/LargeListingPreviewCard";
import ReviewBlock from "./UiComponents/ReviewBlock";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen mx-4 mt-4">
        <div className="flex flex-row items-center gap-2 mb-4">
          <img
            src="https://i.pinimg.com/564x/44/63/ea/4463ea41b6c5660b096afbd16f31039c.jpg"
            alt=""
            className="h-28 w-28 rounded-full object-cover object-center flex-shrink-0"
          />
          <div className="flex flex-col gap-1 justify-center">
            <p className="font-semibold text-xl">Annabelle</p>
            <p className="font-bold text-black/80 text-sm">@anna</p>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit,
              architecto.
            </p>
            <div className="flex items-center flex-row gap-1">
              <p className="text-xs font-bold text-black/50">Chat</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#83C0C1"
                className="w-6 h-6"
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

        <div className="flex flex-col justify-center items-center">
          <LargeListingPreviewCard />
          <LargeListingPreviewCard />
          <LargeListingPreviewCard />
        </div>

        {/* GET ALL LISTINGS, GET ALL REVIEWS TO EACH LISTING AND MAP HERE MAYBE DO PAGINATION?  */}
        <h2 className="font-bold text-xl my-4">Reviews</h2>
        <div className="pt-2 pb-16">
          <ReviewBlock />
          <ReviewBlock />
          <ReviewBlock />
        </div>
        <Navbar />
      </div>
    </>
  );
}
