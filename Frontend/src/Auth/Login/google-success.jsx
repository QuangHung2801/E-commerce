import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token && userId) {
      localStorage.setItem("Authorization", token);
      localStorage.setItem("userId", userId);
      toast.success("Login with Google successfully");
      navigate("/");
    } else {
      toast.error("Google login failed");
      navigate("/login");
    }
  }, [location, navigate]);

  return null;
};

export default GoogleSuccess;
