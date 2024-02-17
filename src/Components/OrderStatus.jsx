import { useEffect, useState } from "react";
import Navbar from "./UiComponents/Navbar";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import OrderPreviewCard from "./UiComponents/OrderPreviewCard";

function OrderStatus() {
  const [currentView, setCurrentView] = useState("sales");
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const viewSales = () => {
    setCurrentView("sales");
  };
  const viewPurchases = () => {
    setCurrentView("purchases");
  };

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    console.log(currentView);
    if (currentUser.id) {
      populatePurchases();
      populateSales();
    }
    console.log(currentUser);
  }, [currentView, currentUser]);

  const populatePurchases = async () => {
    const getPurchases = await axios.get(
      `${BACKEND_URL}/orders/purchases/${currentUser.id}`
    );
    setPurchases(getPurchases.data);
    setLoading(false);
  };
  const populateSales = async () => {
    const getSales = await axios.get(
      `${BACKEND_URL}/orders/sales/${currentUser.id}`
    );
    setSales(getSales.data);
    setLoading(false);
  };

  useEffect(() => {
    console.log(purchases);
  }, [currentView, currentUser, purchases]);

  useEffect(() => {
    console.log(sales);
  }, [sales]);

  return (
    <>
      <div className="h-screen mx-4 mt-4 lg:w-[80rem] lg:mx-auto">
        {/* tabs */}
        <h2 className="font-bold">My Orders</h2>

        <div role="tablist" className="tabs w-full tabs-boxed mt-4">
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
        {/* Divs to show things user have bought or sold  */}
        {/* sales div */}
        <div
          className={` flex flex-col lg:flex-row lg:flex-wrap gap-4 mt-4  ${
            currentView == "sales" ? `` : `hidden`
          }`}
        >
          {currentView == "sales"
            ? sales.map((each) => (
                <OrderPreviewCard
                  key={each.id}
                  saleCard={true}
                  listingTitle={each.listing.title}
                  listingId={each.listing.id}
                  listingImage={each.listing.listing_images[0].url}
                  listingPrice={each.listing.price}
                  buyerUsername={each.user.username}
                  orderId={each.id}
                  sellerSent={each.sellerSent}
                />
              ))
            : null}
          <div className=" h-20"></div>
        </div>

        {/* purchases div */}
        <div
          className={` flex flex-col lg:flex-row lg:flex-wrap gap-4 mt-4 ${
            currentView == "purchases" ? `` : `hidden`
          }`}
        >
          {/* map items sold here */}
          {currentView == "purchases"
            ? purchases.map((each) => (
                <OrderPreviewCard
                  key={each.id}
                  saleCard={false}
                  listingTitle={each.listing.title}
                  listingId={each.listing.id}
                  sellerUsername={each.listing.seller.username}
                  sellerPfp={each.listing.seller.profilePicture}
                  listingImage={each.listing.listing_images[0].url}
                  listingPrice={each.listing.price}
                  orderId={each.id}
                  sellerSent={each.sellerSent}
                />
              ))
            : null}
          <div className=" h-20"></div>
        </div>
        <Navbar />
      </div>
    </>
  );
}

export default OrderStatus;
