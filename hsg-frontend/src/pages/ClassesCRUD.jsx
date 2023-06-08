import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createClasses,
  deleteClasses,
  getAllClasses,
  getClassesByID,
  updateClasses,
  getAllBookings,
  getBookingByID,
  getBookingsByClassID,
  deleteBooking,
  createBooking,
  updateBooking,
  updateSession,
  createSession,
  getSessionByID,
} from "../api/classes";
import { XMLUpload } from "../components/XMLUpload";

export default function ClassesCRUD() {
  const [classes, setClasses] = useState([]);
  const [selectedClassesID, setSelectedClassesID] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [selectedSessionID, setSelectedSessionID] = useState(null);
  const [selectedSession, setSelectedSession] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");

  useEffect(() => {
    getAllClasses().then((classes) => {
      setClasses(classes);
    });
  }, [selectedClassesID]);

  // useEffect(() => {
  //   getAllBookings()
  //     .then((data) => setBookings(data))
  //     .catch((error) => console.error("Error:", error));
  // }, []);

  useEffect(() => {
    if (selectedClassesID) {
      getBookingsByClassID(selectedClassesID).then((bookings) => {
        setBookings(bookings);
      });
    }
  }, [selectedClassesID]);

  // useEffect(() => {
  //   //- You want to update this bit too, I think. (Maybe duplicate it and update that one)
  //   if (selectedBookingID) {
  //     console.log(
  //       "🚀 ~ file: ClassesCRUD.jsx:48 ~ useEffect ~ selectedBookingID:",
  //       selectedBookingID
  //     );
  //     getBookingByID(selectedBookingID).then((booking) => {
  //       console.log(
  //         "🚀 ~ file: ClassesCRUD.jsx:53 ~ getBookingByID ~ selectedBookingID:",
  //         selectedBookingID
  //       );
  //       setSelectedBooking(booking);
  //     });
  //   }
  // }, [selectedBookingID]);

  useEffect(() => {
    if (selectedSessionID) {
      getSessionByID(selectedSessionID).then((session) => {
        setSelectedSession(session);
      });
    }
  }, [selectedSessionID]);

  useEffect(() => {
    if (selectedClassesID) {
      getClassesByID(selectedClassesID).then((classesObj) => {
        setSelectedClasses(classesObj);
      });
    } else {
      setSelectedClasses({
        _id: "",
        Name: "",
        Description: "",
        Duration: "",
        Dates: "",
        Location: "",
        Trainer: "",
        Booking: "",
      });
    }
  }, [selectedClassesID]);

  function createOrUpdateSelectedClasses() {
    if (selectedClassesID) {
      // Update
      updateClasses(selectedClasses).then((updatedClasses) => {
        setSelectedClassesID(null);
        setSelectedClasses({
          id: "",
          Name: "",
          Description: "",
          Duration: "",
          Timeslot: "",
          Location: "",
        });
      });
    } else {
      // Create
      createClasses({
        id: "",
        Name: selectedClasses.Name,
        Description: selectedClasses.Description,
        Duration: selectedClasses.Duration,
        Timeslot: selectedClasses.Timeslot,
        Location: selectedClasses.Location,
      })
        .then((classesDetails) => {
          getAllClasses().then((classes) => {
            setClasses(classes);
          });
          setSelectedClassesID(classesDetails.id);
        })
        .catch((error) => {
          console.error("Error in createClasses:", error);
        });
    }
  }

  function createOrUpdateSelectedSession() {
    if (selectedSessionID) {
      // Update
      updateSession(selectedSession).then((updatedSession) => {
        console.log(
          "🚀 ~ file: ClassesCRUD.jsx:125 ~ updateSession ~ selectedSession:",
          selectedSession
        );
        setSelectedSessionID(null);
        setSelectedSession({
          id: "",
          sessionDate: "",
          Trainer: "",
        });
        getAllBookings().then((bookings) => setBookings(bookings));
      });
    } else {
      // Create
      console.log(selectedSession);

      createSession({
        // id: "",
        classSessionId: selectedClassesID,
        sessionDate: selectedSession.sessionDate,
        participants: selectedSession.participants,
        Trainer: selectedSession.Trainer,
      })
        .then((SessionDetails) => {
          getAllBookings().then((bookings) => {
            setBookings(bookings);
          });
          setSelectedSessionID(SessionDetails._id);
        })
        .catch((error) => {
          console.error("Error in create Session:", error);
        });
    }
  }

  function deleteSelectedClasses(classID) {
    deleteClasses(classID).then((result) => {
      setSelectedClassesID(null);
      setSelectedClasses({
        _id: "",
        Name: "",
        Description: "",
        Duration: "",
        Dates: "",
        Location: "",
        Trainer: "",
        Booking: "",
      });
    });
  }

  function deleteSelectedBooking(bookingID) {
    deleteBooking(bookingID).then((result) => {
      setSelectedBookingID(null);
      setSelectedBooking({
        _id: "",
        classSessionId: "",
        sessionDate: "",
        participants: [],
        Trainer: "",
      });
      getAllBookings().then((bookings) => setBookings(bookings));
    });
  }

  const handleSelectClass = (classObj) => {
    // your existing code for handling class selection
    // ...

    // update the selected class name
    setSelectedClassName(classObj.Name);
  };
  return (
    // <div className="container mx-auto grid md:grid-cols-2 grid-cols-1 gap-4">
    <div className="md:grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 md:mt-0">
      {/* Classes list */}
      <div className="overflow-x-auto max-h-96 overflow-scroll p-2 ">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th className="hidden sticky top-0 bg-primary">ID</th>
              <th className="sticky top-0 left-0 bg-primary rounded-l ">
                Edit
              </th>
              <th className="sticky top-0 bg-primary">Name</th>
              {/* <th className="sticky top-0 bg-primary">Description</th> */}
              <th className="sticky top-0 bg-primary">Duration</th>
              <th className="sticky top-0 bg-primary">Timeslot</th>
              <th className="sticky top-0 bg-primary rounded-r">Location</th>
            </tr>
          </thead>
          <tbody>
            {classes ? (
              classes.map((classObj) => {
                return (
                  <tr key={classObj._id}>
                    <td>
                      <button
                        className="btn btn-xs btn-warning rounded"
                        onClick={() => {
                          console.log("Clicked!");
                          console.log(classObj._id);
                          setSelectedClassesID(classObj._id);
                          setSelectedClassName(classObj.Name);
                        }}
                      >
                        Select
                      </button>
                    </td>
                    {/* Existing td's */}
                    <td>{classObj.Name}</td>
                    {/* <td className="bg-secondary max-w-xs truncate">
                      {classObj.Description}
                    </td> */}
                    <td>{classObj.Duration + " Min."}</td>
                    <td>{classObj.Timeslot}</td>
                    <td>{classObj.Location}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9">Loading...</td>{" "}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-2 ">
        <div className="form-control ">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Class Name"
            className="input input-bordered"
            value={selectedClasses.Name}
            onChange={(e) =>
              setSelectedClasses({ ...selectedClasses, Name: e.target.value })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            placeholder="Class Description"
            className="input input-bordered"
            value={selectedClasses.Description}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Description: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration</span>
          </label>
          <input
            type="number"
            placeholder="Class Duration"
            className="input input-bordered"
            value={selectedClasses.Duration}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Duration: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Timeslot</span>
          </label>
          <input
            type="text"
            placeholder="Class Timeslot"
            className="input input-bordered"
            value={selectedClasses.Timeslot}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Timeslot: e.target.value,
              })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Class Building"
            className="input input-bordered"
            value={selectedClasses.Location}
            onChange={(e) =>
              setSelectedClasses({
                ...selectedClasses,
                Location: e.target.value,
              })
            }
          />
        </div>
        <div className="flex justify-around gap-2 pt-5">
          <button
            className="btn btn-secondary rounded-md w-1/3"
            onClick={() => createOrUpdateSelectedClasses()}
          >
            Save
          </button>{" "}
          <button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedClasses(selectedClassesID)}
          >
            Delete
          </button>{" "}
        </div>
      </div>
      <div className="rounded border-2 border-primary  min-h-16 p-2 justify-center col-span-2 ">
        <h2 className="text-center">Upload Classes or Sessions</h2>
        <XMLUpload
          onUploadSuccess={() => {
            getAllClasses().then((classes) => setClasses(classes));
          }}
        />
      </div>

      <div>
        <h2 className=" font-bold	text-3xl	text-center	p-3 bg-info rounded mb-2">
          Available Session for {selectedClassName}
        </h2>

        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th className="hidden sticky top-0 bg-primary">ID</th>
              <th className="sticky top-0 left-0 bg-primary rounded-l">Edit</th>
              <th className="sticky top-0 bg-primary">Date</th>
              <th className="sticky top-0 bg-primary">Trainer</th>
              <th className="sticky top-0 bg-primary rounded-r">
                Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings ? (
              bookings.map((bookingObj) => {
                return (
                  <tr key={bookingObj._id}>
                    <td>
                      <button
                        className="btn btn-xs btn-warning rounded"
                        onClick={() => {
                          setSelectedSessionID(bookingObj._id);
                          setSelectedClassName(classObj.Name);
                        }}
                      >
                        Select
                      </button>
                    </td>
                    <td>{dayjs(bookingObj.sessionDate).format("DD/MM/YY")}</td>
                    <td>{bookingObj.Trainer}</td>
                    <td>
                      <select>
                        <option>Bookings</option>
                        {bookingObj.participants.map((participant, index) => (
                          <option key={index} value={participant.name}>
                            {participant.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="font-bold	text-3xl	text-center	pt-10" colSpan="9">
                  No sessions available
                </td>{" "}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 ">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            placeholder="DD/MM/YYYY"
            // value={dayjs(selectedBooking.sessionDate).format("YYYY-MM-DD")}
            value={
              selectedSession.sessionDate
                ? dayjs(selectedSession.sessionDate).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) =>
              setSelectedSession({
                ...selectedSession,
                sessionDate: dayjs(e.target.value, "YYYY-MM-DD").toDate(),
              })
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Trainer</span>
          </label>
          <input
            type="text"
            placeholder="Session Trainer"
            className="input input-bordered"
            value={selectedSession.Trainer}
            onChange={(e) =>
              setSelectedSession({
                ...selectedSession,
                Trainer: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-around gap-2 pt-5">
          <button
            className="btn btn-secondary rounded-md w-1/3"
            onClick={() => createOrUpdateSelectedSession()}
            // disabled={!selectedClasses._id}
          >
            Save
          </button>{" "}
          <button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedBooking(selectedBookingID)}
          >
            Delete
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
