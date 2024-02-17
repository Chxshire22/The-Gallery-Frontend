import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants";

export default function OrderPreviewCard(props) {
  const navigate = useNavigate();

  const {
    saleCard,
    listingTitle,
    listingId,
    sellerUsername,
    sellerPfp,
    listingImage,
    listingPrice,
    buyerReceived,
    sellerSent,
    trackingUrl,
    buyerId,
    buyerUsername,
    buyerPfp,
    buyerAddress,
    orderId,
  } = props;

  const orderSent = async () => {
    const sent = await axios.put(
      `${BACKEND_URL}/orders/seller-sent/${true}/${orderId}`
    );
    console.log(sent.data);
  };
  const orderReceived = async () => {
    const received = await axios.put(
      `${BACKEND_URL}/orders/buyer-received/${true}/${orderId}`
    );
    console.log(received.data);
  };

  useEffect(() => {
    console.log(sellerSent);
  }, []);

  return (
    <>
      <div className="w-full max-w-[35rem] lg:hover:scale-105 transition-transform ease-in flex flex-col listing-card-preview box-border border-2 border-black shadow-[4px_4px_0px_0px_#1a202c] rounded-lg">
        <div className="flex flex-row w-full gap-2">
          <img
            onClick={() => navigate(`/listing/${listingId}`)}
            className="w-40 aspect-[4/5] object-cover object-center border-black border-t-2 border-r-2 rounded-br-lg border-b-2 flex-shrink-0 cursor-pointer"
            src={listingImage}
            alt=""
          />
          <div className="flex flex-col p-4 cursor-pointer">
            <h3 className="font-bold">{saleCard ? "Buyer" : "Seller"}</h3>
            <p className="font-medium text-xs text-black/80">
              @{saleCard ? buyerUsername : sellerUsername}{" "}
            </p>
            <h3 className="font-bold">
              {saleCard ? "Address" : trackingUrl ? "Tracking URL" : null}
            </h3>
            <p className="font-medium text-xs text-black/80">
              {saleCard
                ? buyerAddress
                  ? buyerAddress
                  : "No address"
                : trackingUrl}
            </p>

              <div className="dropdown dropdown-top">
                {saleCard ? (
                  <button className=" bg-[#6C22A6]/60 text-white outline-none border-none opacity-80 hover:opacity-100 transition ease-in py-1 px-2 mt-2 rounded-full">
                    Sent Status
                  </button>
                ) : sellerSent ? (
                  <button className=" bg-[#6C22A6]/60 text-white outline-none border-none opacity-80 hover:opacity-100 transition ease-in py-1 px-2 mt-2 rounded-full">
                    Received?
                  </button>
                ) : (
                  <p className="font-medium text-sm">
                    Waiting for seller to post
                  </p>
                )}

                <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box">
                  {saleCard ? (
                    sellerSent ? null : (
                      <li
                        onClick={() => {
                          console.log("pressed");
                          orderSent();
                        }}
                      >
                        <a>Sent</a>
                      </li>
                    )
                  ) : sellerSent ? (
                    <li>
                      <a
                        onClick={() => {
                          orderReceived();
                          console.log("pressed");
                        }}
                      >
                        Received
                      </a>
                    </li>
                  ) : null}
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
    </>
  );
}
