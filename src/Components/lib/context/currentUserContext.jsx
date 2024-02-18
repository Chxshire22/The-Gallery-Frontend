import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const CurrentUserContext = createContext();

export function CheckCurrentUser({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserLikes, setCurrentUserLikes] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  const findUser = () => {
    if ((isAuthenticated, user)) {
      axios.get(`${BACKEND_URL}/users/email/${user.email}`).then((res) => {
        const userData = res.data;
        setCurrentUser(userData);
        axios.get(`${BACKEND_URL}/likes/list/${res.data.id}`).then((res) => {
          setCurrentUserLikes(
            res.data
              .map((each) => each.listing.id)
              .reduce((acc, currentValue) => {
                acc[currentValue] = true;
                return acc;
              }, {})
          );
        });
      });
    }
  };

  useEffect(() => {
    findUser();
  }, [isAuthenticated, user]);
  return (
    <CurrentUserContext.Provider value={{ currentUser, currentUserLikes }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
export const useCurrentUserContext = () => {
  return useContext(CurrentUserContext);
};
