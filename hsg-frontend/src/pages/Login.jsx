import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

function Login() {
  const navigate = useNavigate();

  const [user, login, logout] = useAuthentication();

  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function onLoginSubmit(e) {
    console.log("loggin in");
    e.preventDefault();
    setStatusMessage("Logging in...");

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(formData.email)) {
      setStatusMessage("Invalid email address");
      return;
    }

    login(formData.email, formData.password)
      .then((result) => {
        setStatusMessage("Login successful!");
        navigate("/timetable");
      })
      .catch((error) => {
        setStatusMessage("Login failed: " + error);
      });
  }
  return (
    <section className="flex justify-center mt-20">
      <form className="" onSubmit={onLoginSubmit}>
        <div className="">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email@server.tld"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, email: e.target.value };
              })
            }
          />
        </div>
        <div className="">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, password: e.target.value };
              })
            }
          />
        </div>

        <button type="submit" className="btn btn-primary btn-wide mt-10">
          login
        </button>
        <p className="label-text-alt">{statusMessage}</p>
      </form>
    </section>
  );
}
export default Login;
