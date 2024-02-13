import Navbar from "./UiComponents/Navbar";
import Search from "./UiComponents/SearchBar";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { useEffect, useState } from "react";

export default function Explore() {
  const [categories, setCategories] = useState([]);
  const searchType = "Search";

  const getCategories = async () => {
    const categories = await axios.get(`${BACKEND_URL}/categories`);
    setCategories(categories.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div className="h-screen mx-4 mt-4">
        <div className="mb-4">
          <Search searchType={searchType} />
        </div>
        <hr />
        <h2 className="font-semibold text-lg text-black/80 mt-4 text-center">
          Categories
        </h2>

        {/* GET LIST OF CATEGORIES AND MAP THEM HERE */}

        <div className="flex flex-row items-center justify-center flex-wrap w-full gap-2 mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className=" bg-[#6C22A6]/60 text-white outline-none border-none opacity-80 hover:opacity-100 transition ease-in py-1 px-2 rounded-full"
            >
              {category.name}
            </button>
          ))}
        </div>
        <Navbar />
      </div>
    </>
  );
}
