import { useEffect, useState } from "react";
import Navbar from "./UiComponents/Navbar";

function OrderStatus() {
  const [currentView, setCurrentView] = useState("sales");

  const viewSales = () => {
    setCurrentView("sales");
  };
  const viewPurchases = () => {
    setCurrentView("purchases");
  };

  useEffect(() => {
    console.log(currentView);
  }, [currentView]);

  return (
    <>
      <div className="h-screen lg:px-20 relative mx-4 mt-4">
        <div className="lg:mt-14">
          {/* tabs */}
          <h2 className="font-bold">My Orders</h2>
          <div role="tablist" className="tabs tabs-boxed mt-4">
            <a
              role="tab"
              className={`tab font-medium transition-colors ease-in cursor-pointer ${
                currentView == "sales" ? `bg-[#83C0C1] text-white` : ``
              }`}
              onClick={() => viewSales()}
            >
              Sales
            </a>
            <a
              role="tab"
              className={`tab font-medium transition-colors ease-in cursor-pointer ${
                currentView == "purchases" ? `bg-[#83C0C1] text-white` : ``
              }`}
              onClick={() => viewPurchases()}
            >
              Purchases
            </a>
          </div>
          <Navbar />
        </div>
        {/* Divs to show things user have bought or sold  */}
        {/* sales div */}
        <div
          className={`h-full w-full  bg-red-400 ${
            currentView == "sales" ? `` : `hidden`
          }`}
        >
          {/* map items sold here */}
        </div>

        {/* purchases div */}
        <div
          className={`h-full w-full bg-blue-400 ${
            currentView == "purchases" ? `` : `hidden`
          }`}
        >
          {/* map items sold here */}
        </div>
      </div>
    </>
  );
}

export default OrderStatus;
