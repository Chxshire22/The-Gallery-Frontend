import { useState, useEffect } from "react";
import { BACKEND_URL } from "./lib/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCurrentUserContext } from "./lib/context/currentUserContext";

export default function AddReview({ userId, listingId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  // const { currentUser } = useCurrentUserContext();
  // const { listingId } = useParams();

  // useEffect(() => {
  //   console.log(currentUser.id);
  //   setUserId(currentUser.id);
  // }, [currentUser]);

  const handleSubmit = async () => {
    let response = await axios.post(`${BACKEND_URL}/reviews/`, {
      listingId: listingId,
      userId: userId,
      comment: review,
      rating: rating,
    });

    setRating();
    setReview("");

    window.location.reload();
  };

  return (
    <>
      <div>
        <h3 className="font-bold text-xl my-4">Share your experience</h3>
        <div className="rating">
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
            onClick={(e) => {
              setRating(3);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={(e) => {
              setRating(4);
            }}
          />
          <input
            type="radio"
            name="rating-2"
            className="mask mask-star-2 bg-[#6962AD]"
            onClick={(e) => {
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
          type="submit"
          onClick={handleSubmit}
          className="btn w-full bg-[#83C0C1] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 "
        >
          Submit
        </button>
      </div>
    </>
  );
}
