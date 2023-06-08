import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
  Outlet,
} from "react-router-dom";

import {
  HiHome,
  HiUser,
  HiAcademicCap,
  HiCalendar,
  HiClock,
  HiPencilAlt,
  HiLogin,
} from "react-icons/hi";

import Classes from "./components/Classes";
import Users from "./pages/Users";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Timetable from "./pages/Timetable";
import Navbar from "./components/Navbar";
import ClassesCRUD from "./pages/ClassesCRUD";
import Logout from "./components/Logout";
import { AuthenticationProvider } from "./hooks/authentication";

const Home = () => <div>Home Content</div>;
const Schedule = () => <div>Schedule Content</div>;

const App = () => {
  return (
    <Router>
      <AuthenticationProvider>
        <div className="flex">
          <Navbar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              {/* <Route path="/classes2" element={<Classes />} /> */}
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/classes" element={<ClassesCRUD />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </main>
        </div>
      </AuthenticationProvider>
    </Router>
  );
};

export default App;
