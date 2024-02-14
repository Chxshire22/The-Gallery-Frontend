import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const CurrentUserContext = createContext();

export function CheckCurrentUser({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const { user, isAuthenticated } = useAuth0();

  const findUser = () => {
    if ((isAuthenticated, user)) {
      axios.get(`${BACKEND_URL}/users/email/${user.email}`).then((res) => {
        const userData = res.data;
        setCurrentUser(userData);
      });
    }
  };

  useEffect(() => {
    findUser();
  }, [isAuthenticated, user]);
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
export const useCurrentUserContext = () => {
  return useContext(CurrentUserContext);
};
