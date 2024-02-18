import { ref as storageRef, listAll, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import axios from "axios";
import { BACKEND_URL } from "./constants";

export const deleteFirebaseFiles = async (pathString) => {
  const listRef = storageRef(storage, pathString);

  try {
    const listResult = await listAll(listRef);
    await Promise.all(listResult.items.map((itemRef) => deleteObject(itemRef)));
    console.log("All files in the folder have been deleted.");
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

export const deleteListing = async (id) => {
  try {
    deleteFirebaseFiles(`listing-img/${id}`);
    const response = await axios.delete(`${BACKEND_URL}/listings/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

// TODO: CLIENT SIDE IMAGE OPTIMIZATION
export const imageOptimization = (image) => {
  console.log("I'm connected");
  const file = image;
  if (!file) return;
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function (event) {
    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;
    // document.querySelector("#input").src = event.target.result;

    imgElement.onload = function (e) {
      const canvas = document.createElement("canvas");

      const MAX_WIDTH = 100;
      const scaleSize = MAX_WIDTH / e.target.width;
      canvas.width = MAX_WIDTH;
      canvas.height = e.target.height * scaleSize;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

      const srcEncoded = ctx.canvas.toDataURL(e.target, 0.8);

      
    };
  };
};
