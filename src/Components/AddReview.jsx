import { useState, useEffect } from "react";
import { BACKEND_URL } from "./lib/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AddReview() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [orderData, setOrderData] = useState({});

  const { orderId } = useParams();

  const navigate = useNavigate();

  const getOrderData = async () => {
    const orderData = await axios.get(`${BACKEND_URL}/orders/${orderId}`);
    console.log(orderData.data);
    setOrderData(orderData.data);
  };
  useEffect(() => {
    getOrderData();
  }, []);

  const handleSubmit = async () => {
    let response = await axios.post(`${BACKEND_URL}/reviews/`, {
      listingId: orderData.listingId,
      userId: orderData.buyerId,
      comment: review,
      rating: rating,
    });

    console.log(response.data);
    navigate(-1);
  };

  return (
    <>
      <div className="h-screen mx-4 mt-4 lg:w-[80rem] lg:mx-auto">
        <h3 className="font-bold text-xl my-4">Share your experience</h3>
        <div className="rating mt-4">
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={() => {
              setRating(1);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={() => {
              setRating(2);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={() => {
              setRating(3);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={() => {
              setRating(4);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={() => {
              setRating(5);
            }}
          />
        </div>
        <textarea
          placeholder="Add your review"
          name="Review"
          id=""
          cols="10"
          rows="5"
          className="w-full mt-4 p-3 outline-[#83C0C1] rounded active:outline-[#83C0C1] bg-slate-300/30"
          onChange={(e) => {
            setReview(e.target.value);
          }}
          value={review}
          maxLength={140}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="btn w-full bg-[#83C0C1] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 mt-4 "
        >
          Submit
        </button>
      </div>
    </>
  );
}
