import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from "react-router-dom";

import {
  HiHome,
  HiUser,
  HiAcademicCap,
  HiOutlineAcademicCap,
  HiCalendar,
  HiClock,
  HiPencilAlt,
  HiLogin,
  HiLogout,
  HiUsers,
} from "react-icons/hi";

import { useAuthentication } from "../hooks/authentication";

function Navbar() {
  const [user] = useAuthentication();

  const getRoleColorClass = (role) => {
    switch (role) {
      case "Admin":
        return "text-red-600";
      case "Trainer":
        return "text-green-600";
      case "Member":
        return "text-blue-600";
      default:
        return "text-black";
    }
  };

  return (
    <div className="relative">
      <nav className="bg-gray-100 min-h-screen hidden md:block sticky top-0 z-50">
        <ul className="space-y-4 p-4">
          <NavItem to="/" exact text="Home" icon={HiHome} />
          <NavItem to="/users" text="Users" icon={HiUsers} />
          <NavItem to="/timetable" text="Timetable" icon={HiCalendar} />
          <NavItem to="/classes" text="Classes" icon={HiAcademicCap} />
          <NavItem to="/blog" text="Blog" icon={HiPencilAlt} />
          {!user && <NavItem to="/login" text="Login" icon={HiLogin} />}
          {user && <NavItem to="/logout" text="Logout" icon={HiLogout} />}
          {user && (
            <div
              className={`p-2 flex items-center ${getRoleColorClass(
                user.role
              )}`}
            >
              <HiUser />
              <p className="ml-2">{user.firstName}</p>
            </div>
          )}{" "}
        </ul>
      </nav>
      <nav className="bg-gray-100 fixed  top-0 left-0 right-0 w-full md:hidden z-50">
        <ul className="flex justify-around p-2">
          <NavItem to="/" exact text="Home" icon={HiHome} mobile />
          <NavItem to="/users" text="Users" icon={HiUser} mobile />
          <NavItem to="/timetable" text="Timetable" icon={HiCalendar} mobile />
          <NavItem to="/classes" text="Classes" icon={HiAcademicCap} mobile />
          <NavItem to="/blog" text="Blog" icon={HiPencilAlt} mobile />
          {!user && <NavItem to="/login" text="Login" icon={HiLogin} mobile />}
          {user && (
            <NavItem to="/logout" text="Logout" icon={HiLogout} mobile />
          )}
          {user && (
            <p className="text-gray-600 mr-4 text-right	">{user.firstName}</p>
          )}{" "}
        </ul>
      </nav>
    </div>
  );
}

const NavItem = ({ to, exact = false, text, icon: Icon, mobile }) => {
  return (
    <li>
      <NavLink
        to={to}
        {...(exact ? { exact: "true" } : {})}
        className="flex items-center space-x-2 p-2 rounded text-primary hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
      >
        <Icon className="w-5 h-5" />
        {!mobile && <span>{text}</span>}
      </NavLink>
    </li>
  );
};

export default Navbar;
