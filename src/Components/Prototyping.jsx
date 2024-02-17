import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";

export default function OrderPreviewCard(props) {
  const [liked, setLiked] = useState(false);
  const { currentUser, currentUserLikes } = useCurrentUserContext();

  const navigate = useNavigate();

  const {
    cardType,
    listingTitle,
    listingId,
    sellerUsername,
    sellerPfp,
    listingImage,
    listingDescription,
    listingPrice,
    buyerReceived,
    sellerSent,
    trackingUrl,
    buyerId,
    buyerUsername,
    buyerPfp,
    buyerAddress,
  } = props;

  useEffect(() => {
    console.log(currentUserLikes);
    if (listingId in currentUserLikes) {
      setLiked(true);
    }
  }, [currentUser, currentUserLikes]);

  const handleLike = async () => {
    try {
      const like = await axios.post(`${BACKEND_URL}/likes`, {
        listingId,
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
        `${BACKEND_URL}/likes/delete/${listingId}/${currentUser.id}`
      );
      console.log(unlike.data);
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen mx-4 mt-4">
        <div className="w-full max-w-[35rem] lg:hover:scale-105 transition-transform ease-in flex flex-col listing-card-preview box-border border-2 border-black shadow-[4px_4px_0px_0px_#1a202c] rounded-lg">
          <div className="flex flex-row w-full gap-2">
            <img
              onClick={() => navigate(`/listing/${listingId}`)}
              className="w-40 aspect-[4/5] object-cover object-center border-black border-t-2 border-r-2 rounded-br-lg border-b-2 flex-shrink-0 cursor-pointer"
              src={listingImage}
              alt=""
            />
            <div className="flex flex-col p-4 cursor-pointer">
              <h3 className="font-bold">Buyer</h3>
              <p className="font-medium text-xs text-black/80">lorem5 </p>
              <h3 className="font-bold">Address</h3>
              <p className="font-medium text-xs text-black/80">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores, atque!
              </p>

              <div className="dropdown">
                <button className=" bg-[#6C22A6]/60 text-white outline-none border-none opacity-80 hover:opacity-100 transition ease-in py-1 px-2 mt-2 rounded-full">
                  status
                </button>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-b-lg flex flex-row items-center h-full">
            <p className="font-bold flex-1 text-sm ml-1 align-middle ">
              {listingTitle}
            </p>
            <div className="bg-black h-full ">
              <p className="text-white font-bold flex-initial align-middle mx-1">
                ${listingPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
