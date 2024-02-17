import { useNavigate } from "react-router-dom";
import MediumListingPreviewCard from "./UiComponents/MediumListingPreviewCard";
import { useEffect } from "react";

function Checkout(props) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
            Checkout
          </h2>
        </header>
        <h2 className="underline font-bold">Delivery Address</h2>
        <p className="font-medium text-sm">
          1234 Elm Street, #14-12, Singapore 470123
        </p>
        <div className="my-4">
          <MediumListingPreviewCard />
        </div>
        <div className="flex flex-row items-center justify-center mt-4 mb-4">
          <button
            onClick={() => navigate("/order")}
            className="btn w-full bg-[#6C22A6] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 "
          >
            Place Order
          </button>
        </div>
      </div>{" "}
    </>
  );
}

export default Checkout;
