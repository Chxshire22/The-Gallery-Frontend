import { ref as storageRef, listAll, deleteObject } from "firebase/storage";
import { storage } from "./lib/firebase";
import { useEffect } from "react";
import { BACKEND_URL } from "./lib/constants";

export default function Prototyping() {
  let id = 1;

  const deleteListing = async () => {
    try {
      const deleteRequest = await axios.delete(`${BACKEND_URL}/listings/${id}`);
      return deleteRequest.data;
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   deleteFiles();
  // }, []);

  return <></>;
}
