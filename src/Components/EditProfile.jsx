import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL, DEFAULT_PFP } from "./lib/constants";
import { useCurrentUserContext } from "./lib/context/currentUserContext";
import { storage, DB_STORAGE_PFP_KEY } from "./lib/firebase";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { useAuth0 } from "@auth0/auth0-react";
import { imageOptimization } from "./lib/utilities";

export default function EditProfile() {
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  //PROFILE DETAILS STATES
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [stylesValue, setStylesValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [usernameNotAvailable, setUsernameNotAvailable] = useState(false);

  const { user } = useAuth0();
  const { currentUser } = useCurrentUserContext();

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // PFP PREVIEW
  useEffect(() => {
    if (selectedImage) {
      const localUrl = URL.createObjectURL(selectedImage);
      // setPreview(optimizedImage);
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage(e.target.files[0]);
    const optimizedImage = imageOptimization(e.target.files[0]);
    console.log(optimizedImage);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;
      // document.querySelector("#input").src = event.target.result;

      imgElement.onload = function (e) {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 200;
        const scaleSize = MAX_WIDTH / e.target.width;
        canvas.width = MAX_WIDTH;
        canvas.height = e.target.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

        const srcEncoded = ctx.canvas.toDataURL(e.target, 0.8);
        setPreview(srcEncoded);
      };
    };
  };

  // POPULATE THE FIELDS WITH EXISTING DATA
  useEffect(() => {
    setAddressValue(currentUser?.address);
    setUsernameValue(currentUser?.username);
    setBioValue(currentUser?.bio);
    setFirstNameValue(currentUser?.firstName);
    setLastNameValue(currentUser?.lastName);
    setStylesValue(currentUser?.style);
    setPreview(currentUser?.profilePicture);
  }, [currentUser]);

  /*
  the handleSubmit acts differently if user is a currentUser. it first checks if 
  username is used by any other user, then checks if user has selected an image for upload. 
  if user has not selected an image for upload, it will check if user has existing pfp. 
  if user does have it, it will just resend that url to the backend. 
  if user doesn't have existing pfp, it will assign a default pfp for the user and send that to the backend 
  the reason for the reload method is for the useCurrentUserContext state to refresh and grab the latest data from the backend 
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const checkUsernameAvailabity = currentUser
        ? await axios.get(
            `${BACKEND_URL}/users/username/${currentUser.id}/${usernameValue}`
          )
        : await axios.get(`${BACKEND_URL}/users/username/new/${usernameValue}`);
      if (checkUsernameAvailabity.data) {
        setUsernameNotAvailable(checkUsernameAvailabity.data);
      } else {
        setUsernameNotAvailable(checkUsernameAvailabity.data);
        try {
          const storageRefInstance = storageRef(
            storage,
            DB_STORAGE_PFP_KEY + usernameValue
          );

          if (selectedImage)
            await uploadBytes(storageRefInstance, selectedImage);
          const imageSrc = selectedImage
            ? await getDownloadURL(storageRefInstance)
            : null;
          let dataForBackend = {
            email: user.email,
            firstName: firstNameValue,
            lastName: lastNameValue,
            username: usernameValue,
            bio: bioValue,
            style: stylesValue,
            address: addressValue,
            profilePicture: imageSrc
              ? imageSrc
              : currentUser?.profilePicture
              ? currentUser.profilePicture
              : DEFAULT_PFP,
          };
          const dbUpdateUserData = currentUser
            ? await axios.put(
                `${BACKEND_URL}/users/${currentUser.id}`,
                dataForBackend
              )
            : await axios.post(`${BACKEND_URL}/users`, dataForBackend);
          if (dbUpdateUserData) {
            navigate("/");
            window.location.reload();
          }
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // USERNAME UNAVAILABLE WARNING
  const UsernameWarning = () => {
    return (
      <span className="font-bold text-xs text-red-400/80 w-full">
        this username is in use, try another one
      </span>
    );
  };

  return (
    <>
      <div className="h-screen mx-4 mt-4  lg:w-[40rem] lg:mx-auto">
        {" "}
        <h2 className="text-xl text-center font-bold text-black/50 mb-4">
          Edit Profile
        </h2>
        <div className="w-full flex flex-col items-center gap-2 justify-center">
          {/* PROFILE PICTURE PREVIEW */}
          <img
            src={preview ? preview : DEFAULT_PFP}
            alt=""
            className="h-32 w-32 rounded-full object-cover object-center flex-shrink-0"
          />

          {/* PFP SET */}
          <button className="btn bg-[#83C0C1]/80 text-white">
            <label htmlFor="file-upload">Upload Profile Picture</label>{" "}
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center">
          {" "}
          <input
            type="text"
            placeholder="First Name"
            className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            onChange={(e) => {
              setFirstNameValue(e.target.value);
            }}
            value={firstNameValue}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            onChange={(e) => {
              setLastNameValue(e.target.value);
            }}
            value={lastNameValue}
          />
          <input
            type="text"
            placeholder="Username (required)"
            className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            onChange={(e) => {
              setUsernameValue(e.target.value);
            }}
            value={usernameValue}
          />
          {!usernameNotAvailable ? null : <UsernameWarning />}{" "}
          <textarea
            placeholder="Bio"
            name=""
            id=""
            cols="30"
            rows="10"
            className="w-full mt-4 p-3 outline-[#83C0C1] rounded active:outline-[#83C0C1] bg-slate-300/30"
            onChange={(e) => {
              setBioValue(e.target.value);
            }}
            value={bioValue}
            maxLength={140}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="w-full mt-4 p-3 bg-slate-300/30 rounded outline-[#83C0C1] active:outline-[#83C0C1]"
            onChange={(e) => {
              setAddressValue(e.target.value);
            }}
            value={addressValue}
          />
          <textarea
            placeholder="Styles"
            name=""
            id=""
            cols="30"
            rows="10"
            className="w-full mt-4 p-3 outline-[#83C0C1] rounded active:outline-[#83C0C1] bg-slate-300/30"
            onChange={(e) => {
              setStylesValue(e.target.value);
            }}
            value={stylesValue}
          ></textarea>
        </div>
        <div className="flex flex-row items-center justify-center mt-4 mb-4">
          <button
            type="submit"
            disabled={usernameValue ? false : true}
            onClick={handleSubmit}
            className="btn w-full bg-[#83C0C1] text-white text-lg relative bottom-0 hover:opacity-100 transition ease-in mb-4 "
          >
            Save and Exit
          </button>
        </div>
      </div>
    </>
  );
}
