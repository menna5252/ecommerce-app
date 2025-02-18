import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserStore = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isAuthRoute = currentPath === "/signin" || currentPath === "/signup";

  const signUp = async (values) => {
    const response = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/auth/signup",
      values
    );

    if (response.data.message !== "success") {
      // Handle throw error
      return;
    }

    const { token, user } = response.data.data;

    localStorage.setItem("ecommerce_token", token);
    setUser(user);
  };

  const signIn = async (values) => {
    const response = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/auth/signin",
      values
    );

    const { token, user } = response.data;

    localStorage.setItem("ecommerce_token", token);
    setUser(user);

    navigate("/");
  };

  const signOut = () => {
    localStorage.removeItem("ecommerce_token");
    setUser(null);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("ecommerce_token");

    if (!token) {
      return false;
    }

    try {
      const response = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyToken",
        {
          headers: {
            token: token,
          },
        }
      );
      setUser(response.data.decoded);

      return response.data.message === "verified";
    } catch (error) {
      console.error("Token verification failed:", error);

      return false;
    }
  };

  const handleAuthRoute = async () => {
    if (!user) {
      const isVerified = await verifyToken();

      if (isVerified && isAuthRoute) {
        navigate("/");
      }
    } else if (isAuthRoute) {
      navigate("/");
    }
  };

  useEffect(() => {
    handleAuthRoute();
  }, [user, location.pathname, navigate, isAuthRoute]);

  return (
    <UserContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);

UserStore.propTypes = {
  children: PropTypes.node,
};
