import { useNavigate } from "react-router-dom";
import Carousel from "./UiComponents/Carousel";
import { useEffect } from "react";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import axios from "axios";
import { BACKEND_URL } from "./lib/constants";
import { storage, DB_STORAGE_LISTING_IMAGE_KEY } from "./lib/firebase";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";

function AddListingPreview(props) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const { currentUser } = useCurrentUserContext();
  let { dataForBackend } = props;
  let {
    listingTitleValue,
    priceValue,
    descriptionValue,
    dropdownSelectValue,
    selectedImage,
    preview,
  } = dataForBackend;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (listingTitleValue.length == 0) navigate(-1);
  }, []);

  useEffect(() => {
    console.log(currentUser);
    console.log(selectedImage[0].name);
    getCategory();
  }, []);

  const getCategory = async () => {
    const categoryName = await axios.get(
      `${BACKEND_URL}/categories/${dropdownSelectValue.value}`
    );
    setCategory(categoryName.data);
  };

  /*
   * Submitting data will happen in 4 steps
   * 1) POST listing to listing data table.
   * 2) Upload the selectedImages and get the download URL from Firebase
   * 3) GET listingId
   * 4) POST to listingImages data table with listingId and download URL
   * */
  const handleSubmit = async (e) => {
    setLoading(true);
    let imgUrls = [];
    e.preventDefault();
    try {
      const createListing = await axios.post(`${BACKEND_URL}/listings`, {
        title: listingTitleValue,
        description: descriptionValue,
        price: Number(priceValue),
        sellerId: currentUser.id,
        categoryId: dropdownSelectValue.value,
      });
      console.log(createListing.data);
      for (let image of selectedImage) {
        const storageRefInstance = storageRef(
          storage,
          DB_STORAGE_LISTING_IMAGE_KEY +
            `${createListing.data.id}/` +
            image.name
        );
        await uploadBytes(storageRefInstance, image);
        const imageUrl = await getDownloadURL(storageRefInstance);
        imgUrls.push(imageUrl);
      }
      console.log(imgUrls);
      //sequelize backend is using bulk create here, so what I'm doing is sending an object that has an array of objects as its only attribute and each element of that array must contain listingId and the url
      const imagesForBackend = imgUrls.map((imgUrl) => ({
        listingId: createListing.data.id,
        url: imgUrl,
      }));
      console.log(imagesForBackend);
      const sendImagesForBackend = await axios.post(
        `${BACKEND_URL}/listing-images`,
        { listingImages: imagesForBackend }
      );
      console.log(sendImagesForBackend.data);
      if (sendImagesForBackend.data)
        navigate(`/profile/${currentUser.username}`);
    } catch (err) {
      console.log(err);
    }
  };

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
        <div className=" lg:w-[40rem] lg:mx-auto">
          <h2 className="text-xl text-center font-bold text-black/50 mb-4 ">
            Preview
          </h2>
          <hr />
          <h2 className="font-bold leading-10 mt-4 text-2xl">
            {listingTitleValue}
          </h2>
          <h3 className="font-bold leading-10 mt-2 mb-4 text-xl">
            ${priceValue}
          </h3>
          <Carousel imgArr={preview} />
          <div className="flex flex-row items-center gap-5 py-4">
            <img
              src={currentUser.profilePicture}
              alt=""
              className="h-14 w-14 rounded-full object-cover object-center"
            />
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <h2 className="font-semibold text-sm">@{currentUser.username}</h2>
            </div>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#83C0C1"
              className="w-10 h-10"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-bold text-xl pb-2">Description</h2>
          <p className="text-sm pb-8">{descriptionValue}</p>
          <button className=" bg-[#6C22A6]/60 text-white outline-none border-none  opacity-80 hover:opacity-100 transition ease-in py-1 px-2 rounded-full mb-4">
            {category}
          </button>
        </div>
        <hr />
        <div className="flex flex-row items-center justify-center mt-4 mb-4">
          <button
            onClick={handleSubmit}
            className="btn w-full bg-[#83C0C1] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 lg:w-[40rem]"
            disabled={loading ? true : false}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default AddListingPreview;
