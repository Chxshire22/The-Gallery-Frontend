import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants";
import { useNavigate } from "react-router-dom";

export default function Search(props) {
  let { searchType } = props;
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resultsList, setResultsList] = useState([]);

  const navigate = useNavigate()

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const controller = new AbortController();
  const getSearchSuggest = async () => {
    const resultsList = await axios.get(
      `${BACKEND_URL}/listings/search?search=%${searchString}%&page=${page}`,
      {
        signal: controller.signal,
      }
    );
    const response = resultsList.data;
    console.log([...response.listings, ...response.users]);
    setResultsList([...response.listings, ...response.users]);
  };

  useEffect(() => {
    if (searchString !== "") getSearchSuggest();
    else setResultsList([])
    return () => {
      controller.abort();
    };
  }, [searchString, page]);

  const handleSearch = (e) => {
    setSearchString(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    console.log(resultsList);
  }, []);

  const debounceHandleSearch = debounce(handleSearch, 300);

  return (
    <>
      <form>
        <div className=" rounded-full h-12 flex flex-row bg-slate-300 mt-2 mx-2 items-center">
          <input
            className=" ml-4 border-0 h-8 flex-1 outline-none p-4 bg-slate-300 caret-white text-center font-semibold"
            type="text"
            placeholder={searchType}
            onChange={debounceHandleSearch}
          />
          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-[#83C0C1] h-9 rounded-full w-9 mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </form>
      <ul className=" w-full flex flex-col absolute rounded-lg max-h-40 overflow-y-scroll search-drop">
        {resultsList.map((result, index) => (
          <li
            key={index}
            className="cursor-pointer transition-colors ease-in-out duration-900 z-10 bg-slate-100 p-2 hover:bg-white pl-4 font-medium flex gap-2 items-center"
            onClick={() => {
              if (result.title) navigate(`/listing/${result.id}`);
              else navigate(`/profile/${result.username}`);
            }}
          >
            {result.profilePicture ? (
              <img
                className="w-8 h-8 rounded-full"
                src={result.profilePicture}
                alt=""
              />
            ) : null}
            <p>{result.title ? result.title : "@" + result.username}</p>
          </li>
        ))}
      </ul>
    </>
  );
}