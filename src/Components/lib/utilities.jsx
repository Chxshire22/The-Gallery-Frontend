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
export const imageOptimization = async () =>{

}