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

export default function App() {
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
					path: ":uid",
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
					path: ":uid",
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
					path: ":uid",
					element: <Listing />,
				},
			],
		},
		{
			path: "/add-listing",
			element: <AddListing />,
		},
		{
			path: "/edit-profile",
			element: <EditProfile />,
		},
		{
			path: "/explore",
			element: <Explore />,
		},
	]);
	return <RouterProvider router={router} />;
}
