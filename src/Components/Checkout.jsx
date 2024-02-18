import { useNavigate, useParams } from "react-router-dom";
import MediumListingPreviewCard from "./UiComponents/MediumListingPreviewCard";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";

function Checkout() {
  const [listingData, setListingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const { listingId } = useParams();
  const { currentUser } = useCurrentUserContext();

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    getListing();
  }, []);

  useEffect(() => {

    setDeliveryAddress(currentUser.address);
  }, [listingData, currentUser]);

  const getListing = async () => {
    const listingData = await axios.get(`${BACKEND_URL}/listings/${listingId}`);
    setListingData(listingData.data);
    setLoading(false);
  };
  /**
   * should check if buyer address input field is the same as the registered buyer address.
   * if not, put request to edit buyer address.
   * then, send to backend order row with info on listing, sellerId,buyerId(many2many?), seller sent confirmation, buyer receipt confirmation.
   *
   */
  const handleSubmit = async () => {
    const updateProfile =
      currentUser.address === deliveryAddress
        ? null
        : await axios.put(`${BACKEND_URL}/users/address/${currentUser.id}`, {
            address: deliveryAddress,
          });
    const submitOrder = await axios.post(`${BACKEND_URL}/orders`, {
      listingId,
      buyerId: currentUser.id,
    });
    navigate("/order");
  };

  return (
    <>
      <div className="h-screen mx-4 mt-4 lg:px-[30rem]">
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
            Checkout
          </h2>
        </header>
        <main className=" lg:w-[40rem] lg:mx-auto">
          <h2 className="underline font-bold ">Delivery Address</h2>
          <p className="font-medium text-sm">
            <input
              type="text"
              placeholder="Address"
              className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
              }}
              value={deliveryAddress}
            />
          </p>
          <div className="my-4 flex justify-center">
            {loading ? (
              <div className="h-full w-full flex justify-center items-center ">
                <span className="loading loading-spinner text-[#6962AD]/60 loading-lg"></span>
              </div>
            ) : (
              <MediumListingPreviewCard
                listingTitle={listingData.title}
                listingId={listingId}
                sellerUsername={listingData.seller.username}
                sellerPfp={listingData.seller.profilePicture}
                listingImage={listingData.listing_images[0].url}
                listingDescription={listingData.description}
                listingPrice={listingData.price}
              />
            )}
          </div>
          <div className="flex flex-row items-center justify-center mt-4 mb-4">
            <button
              onClick={() => handleSubmit()}
              className="btn w-full bg-[#6C22A6] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 "
            >
              Place Order
            </button>
          </div>
        </main>
      </div>{" "}
    </>
  );
}

export default Checkout;
