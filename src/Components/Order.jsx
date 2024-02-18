import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Order = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);



  return (
    <>
      <div className="h-screen mx-4 mt-4 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-2">Order Placed</p>
        <img src="/tick.jpg" alt="Tick" className="w-16 h-16 mb-2" />
        <p className="text-xl mb-4">Thank you for your purchase!</p>
        <button
          onClick={() => navigate("/")}
          className="btn w-28 bg-[#6C22A6] text-white opacity-80 hover:opacity-100 transition ease-in"
        >
          {" "}
          Continue Shopping
        </button>
      </div>
    </>
  );
};

export default Order;
