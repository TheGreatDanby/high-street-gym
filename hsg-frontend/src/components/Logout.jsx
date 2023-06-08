import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

function Logout() {
  const navigate = useNavigate();
  const [user, login, logout] = useAuthentication();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null;
}

export default Logout;
