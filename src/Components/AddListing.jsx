import { useNavigate } from "react-router-dom";
import Carousel from "./UiComponents/Carousel";
import Select from "react-tailwindcss-select";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";

export default function AddListing(props) {
  // Data for backend
  const [categories, setCategories] = useState([]);
  let { dataForBackend, setDataForBackend } = props;
  let {
    listingTitleValue,
    dropdownSelectValue,
    priceValue,
    descriptionValue,
    selectedImage,
    preview,
  } = dataForBackend;

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const getCategories = async () => {
    const allCategories = await axios.get(`${BACKEND_URL}/categories`);
    setCategories(allCategories.data);
  };
  useEffect(() => {
    getCategories();
  }, []);

  // Dropdown logic
  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const handleChange = (value) => {
    console.log("value:", value);
    setDataForBackend((prevState) => ({
      ...prevState,
      dropdownSelectValue: value,
    }));
  };

  // Image handling
  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setDataForBackend((prevState) => ({
        ...prevState,
        selectedImage: null,
      }));
      return;
    }
    setDataForBackend((prevState) => ({
      ...prevState,
      selectedImage: e.target.files,
    }));
  };

  useEffect(() => {
    if (selectedImage?.length !== 0) {
      const localUrls = [];
      for (let file in selectedImage) {
        if (selectedImage[file] instanceof File) {
          localUrls.push(URL.createObjectURL(selectedImage[file]));
        }
      }
      setDataForBackend((prevState) => ({
        ...prevState,
        preview: localUrls,
      }));
    }
  }, [selectedImage]);

  useEffect(() => {
    console.log(dropdownSelectValue?.value);
    console.log("price", priceValue);
    console.log("listing title", listingTitleValue);
    console.log("description", descriptionValue);
    console.log("selectedImage", selectedImage);
  }, [
    priceValue,
    listingTitleValue,
    descriptionValue,
    dropdownSelectValue,
    selectedImage,
  ]);

  return (
    <>
      <div className="h-screen mx-4 mt-2 lg:px-[30rem]">
        <header className="mx-4 mt-2 mb-4">
          <div className="h-10 w-full flex flex-row items-center">
            <div
              onClick={() => navigate(-1)}
              className="flex flex-row items-center mb-2 px-4 bg-[#83C0C1] h-full rounded-full  cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <h2 className="font-bold ml-4 flex-1 text-white test">Back</h2>
            </div>{" "}
          </div>
          <hr />
        </header>
        {/* IMAGE CAROUSEL */}
        {preview.length !== 0 ? (
          <Carousel imgArr={preview} />
        ) : (
          <div className="bg-[#83C0C1]/50 flex flex-col justify-center items-center rounded w-full aspect-[4/5] mx-auto lg:w-[30rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-20 h-20"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="opacity-60 text-xs font-medium">Image Preview</p>
          </div>
        )}

        {/* IMAGE INPUT */}
        <div className="flex flex-col justify-evenly items-start lg:mx-auto lg:w-[40rem]">
          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input w-full max-w-xs mt-4 lg:w-[40rem] "
            onChange={handleImageChange}
            required
            maxLength={10}
          />

          {/* DROPDOWN */}
          <div className="mt-4 lg:w-[40rem]">
            <Select
              value={dropdownSelectValue}
              onChange={handleChange}
              options={options}
              isSearchable={true}
              required
            />
          </div>
          {/* REST OF FORM FIELDS */}
          <input
            type="text"
            placeholder="Listing Title"
            className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            required
            maxLength={35}
            onChange={(e) =>
              setDataForBackend((prevState) => ({
                ...prevState,
                listingTitleValue: e.target.value,
              }))
            }
            value={listingTitleValue}
          />
          {/* TODO: NEED SOME INPUT VALIDATION */}
          <CurrencyInput
            className="mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            id="input-example"
            name="input-name"
            placeholder="Price"
            prefix="$"
            onValueChange={(value, name, values) => {
              console.log(value, name, values);
              setDataForBackend((prevState) => ({
                ...prevState,
                priceValue: value,
              }));
            }}
            maxLength={5}
            value={priceValue}
          />

          <textarea
            placeholder="Description"
            name=""
            id=""
            cols="30"
            rows="10"
            className="w-full mt-4 p-3 outline-[#83C0C1] rounded active:outline-[#83C0C1] bg-slate-300/30"
            required
            onChange={(e) =>
              setDataForBackend((prevState) => ({
                ...prevState,
                descriptionValue: e.target.value,
              }))
            }
            value={descriptionValue}
          ></textarea>
        </div>
        <hr />
        <div className="flex flex-row items-center justify-center mt-4 mb-4">
          <button
            onClick={() => navigate("/preview-listing")}
            className="btn w-full bg-[#83C0C1] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 lg:w-[40rem]"
            disabled={
              selectedImage.length == 0 ||
              listingTitleValue.length == 0 ||
              priceValue == 0
                ? true
                : false
            }
          >
            Save and Continue
          </button>
        </div>
      </div>
    </>
  );
}
