import { useEffect, useState } from "react";
import { useAuthentication } from "../hooks/authentication";

import {
  getAllUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUser,
} from "../api/users.js";

import { XMLUploadUsers } from "../components/XMLUploadUsers";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [authenticatedUser] = useAuthentication();

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    if (authenticatedUser) {
      console.log(
        "🚀 ~ file: Users.jsx:24 ~ useEffect ~ authenticatedUser:",
        authenticatedUser
      );
      if (authenticatedUser.role === "Admin") {
        getAllUsers().then((users) => {
          setUsers(users);
        });
      } else if (authenticatedUser.role === "Trainer") {
        getAllUsers().then((users) => {
          setUsers(users.filter((user) => user.role === "Member"));
        });
      } else if (authenticatedUser.role === "Member") {
        getUserByID(authenticatedUser.id).then((user) => {
          setUsers([user]);
        });
      }
    }
  }, [authenticatedUser]);

  const [selectedUsersID, setSelectedUsersID] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const sortedUsers = [...users].sort((a, b) => a.role.localeCompare(b.role));

  const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
      (result[currentItem[key]] = result[currentItem[key]] || []).push(
        currentItem
      );
      return result;
    }, {});
  };
  const usersByRoles = groupBy(users, "role");

  // Define roles order
  const rolesOrder = ["Admin", "Trainer", "Member"];

  const getRoleColorClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";
      case "Trainer":
        return "bg-green-600";
      case "Member":
        return "bg-blue-600";
      default:
        return "text-black";
    }
  };

  useEffect(() => {
    if (selectedUsersID) {
      getUserByID(selectedUsersID).then((user) => {
        setSelectedUsers(user);
      });
    } else {
      setSelectedUsers({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
      });
    }
  }, [selectedUsersID]);

  function createOrUpdateSelectedUsers() {
    if (selectedUsersID) {
      // Update
      updateUser(selectedUsers).then((updatedUsers) => {
        getAllUsers().then((users) => {
          setUsers(users);
        });
        setSelectedUsersID(null);
        setSelectedUsers({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
        });
      });
    } else {
      // Create
      createUser(selectedUsers).then((userDetails) => {
        getAllUsers().then((users) => {
          setUsers(users);
        });
        setSelectedUsersID(userDetails.id);
      });
    }
  }
  function deleteSelectedUser(userId) {
    if (window.confirm("Are you sure you want to delete this User?")) {
      deleteUser(userId).then((result) => {
        getAllUsers().then((users) => {
          setUsers(users);
        });
        setSelectedUsersID(null);
        setSelectedUsers({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
        });
      });
    }
  }

  return (
    <div className="container mx-auto grid md:grid-cols-2 grid-cols-1 gap-2 mt-10 md:mt-0">
      <div className="overflow-x-auto overflow-scroll row-start-2 md:row-auto ">
        <table className="table table-compact w-full ">
          <thead>
            <tr>
              <th className="hidden sticky top-0">ID</th>
              <th className="sticky top-0">First Name</th>
              <th className="sticky top-0 hidden md:table-cell">Last Name</th>
              <th className="sticky top-0">Email</th>
              <th className="sticky top-0 ">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rolesOrder.map(
              (role) =>
                usersByRoles[role] &&
                usersByRoles[role].length > 0 && (
                  <>
                    <tr className="bg-gray-200 ">
                      <td
                        colSpan="5"
                        className={`text-center text-black font-bold ${getRoleColorClass(
                          role
                        )}`}
                      >
                        {role}
                      </td>
                    </tr>
                    {usersByRoles[role] &&
                      usersByRoles[role].map((user) => (
                        <tr key={user.id}>
                          <td className="hidden">{user.id}</td>
                          <td>{user.firstName}</td>
                          <td className="hidden md:table-cell">
                            {user.lastName}
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <button
                              className="btn btn-xs btn-warning"
                              onClick={() => setSelectedUsersID(user.id)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                  </>
                )
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 ">
        <div className="form-control ">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            placeholder="Arnold"
            className="input input-bordered"
            value={selectedUsers.firstName}
            onChange={(e) =>
              setSelectedUsers({ ...selectedUsers, firstName: e.target.value })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name:</span>
          </label>
          <input
            type="text"
            placeholder="Schwarzenegger"
            className="input input-bordered"
            value={selectedUsers.lastName}
            onChange={(e) =>
              setSelectedUsers({ ...selectedUsers, lastName: e.target.value })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email:</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="example@company.com"
            value={selectedUsers.email}
            onChange={(e) =>
              setSelectedUsers({ ...selectedUsers, email: e.target.value })
            }
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            for="department"
            className="text-sm font-medium text-white-900 block mb-2"
          >
            Role
          </label>
          <select
            className="select shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 text-black	 "
            value={selectedUsers.role}
            onChange={(e) =>
              setSelectedUsers({ ...selectedUsers, role: e.target.value })
            }
          >
            {" "}
            <option>Select the Users Role</option>
            <option>Member</option>
            <option>Trainer</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            for="new-password"
            className="text-sm font-medium text-white-900 block mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-white-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 mb-5"
            placeholder="••••••••"
            required
            value={selectedUsers.password}
            onChange={(e) =>
              setSelectedUsers({ ...selectedUsers, password: e.target.value })
            }
          />
        </div>
        <div className="flex justify-around gap-2">
          {/* <button
            className="btn btn-primary rounded-md w-1/3"
            onClick={() => {
              setSelectedUsersID(null);
              setSelectedUsers({
                id: "",
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                password: "",
              });
            }}
          >
            New
          </button>{" "} */}
          <button
            className="btn btn-secondary rounded-md w-1/3"
            onClick={() => createOrUpdateSelectedUsers()}
          >
            Save
          </button>{" "}
          <button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedUser(selectedUsers.id)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="rounded border-2 border-primary  min-h-16 p-2 justify-center col-span-2 ">
        <h2 className="text-center">Upload Classes or Sessions</h2>
        <XMLUploadUsers
          onUploadSuccess={() => {
            // getAllClasses().then((classes) => setClasses(classes));
            getAllUsers().then((users) => setUsers(users));
          }}
        />
      </div>
    </div>
  );
}
