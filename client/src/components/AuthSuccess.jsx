import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Firebase handles auth state via onAuthStateChanged in AuthContext.
// This route is kept for any legacy redirects but immediately sends users home.
const AuthSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
};

export default AuthSuccess;
