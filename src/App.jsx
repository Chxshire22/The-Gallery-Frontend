import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Explore from "./Components/Explore";
import EditProfile from "./Components/EditProfile";
import Chats from "./Components/Chats";
import Chatroom from "./Components/Chatroom";
import AddListing from "./Components/AddListing";
import Listing from "./Components/Listing";
import Likes from "./Components/Likes";
import AddListingPreview from "./Components/AddListingPreview";
import Checkout from "./Components/Checkout";
import Order from "./Components/Order";
import CategoryFilter from "./Components/CategoryFilter";
import OrderStatus from "./Components/OrderStatus";
import { CheckCurrentUser } from "./Components/lib/context/currentUserContext";
import { useState } from "react";
import "./App.css";
import AddReview from "./Components/AddReview";

export default function App() {
  //raised state for listing creation
  const [dataForBackend, setDataForBackend] = useState({
    listingTitleValue: "",
    priceValue: "",
    descriptionValue: "",
    dropdownSelectValue: null,
    selectedImage: [],
    preview: [],
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: `/profile/`,
      //will need the unique ID of profile
      children: [
        {
          path: ":paramUsername",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/chats",
      element: <Chats />,
    },
    {
      path: "/chat/",
      children: [
        {
          path: ":chatroomId",
          element: <Chatroom />,
        },
      ],
    },
    {
      path: "/likes",
      element: <Likes />,
    },
    //listing here will need a path that directs it to individual listing via listingId
    {
      path: "/listing/",
      children: [
        {
          path: ":listingId",
          element: <Listing />,
        },
      ],
    },
    {
      path: "/category/",
      children: [
        {
          path: ":categoryName",
          element: <CategoryFilter />,
        },
      ],
    },
    {
      path: "/add-listing",
      element: (
        <AddListing
          setDataForBackend={setDataForBackend}
          dataForBackend={dataForBackend}
        />
      ),
    },
    {
      path: "/preview-listing",
      element: <AddListingPreview dataForBackend={dataForBackend} />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/explore",
      element: <Explore />,
    },
    {
      path: "/checkout",
      children: [
        {
          path: ":listingId",
          element: <Checkout />,
        },
      ],
    },
    {
      path: "/review",
      children: [
        {
          path: ":orderId",
          element: <AddReview />,
        },
      ],
    },
    {
      path: "/order",
      element: <Order />,
    },
    {
      path: "/orders",
      element: <OrderStatus />,
    },

  ]);
  return (
    <CheckCurrentUser>
      <RouterProvider router={router} />
    </CheckCurrentUser>
  );
}
