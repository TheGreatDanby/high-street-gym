import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createClasses,
  deleteClasses,
  getAllClasses,
  getClassesByID,
  updateClasses,
  updateSession,
  createSession,
  getSessionByID,
  deleteSession,
  getAllSessions,
  getSessionsByClassID,
} from "../api/classes";
import { XMLUpload } from "../components/XMLUpload";

export default function ClassesCRUD() {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClassesID, setSelectedClassesID] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSessionID, setSelectedSessionID] = useState(null);
  const [selectedSession, setSelectedSession] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");

  useEffect(() => {
    getAllClasses().then((classes) => {
      setClasses(classes);
    });
  }, [selectedClassesID]);

  useEffect(() => {
    getAllSessions().then((sessions) => {
      setSessions(sessions);
    });
  }, [selectedSessionID]);

  useEffect(() => {
    if (selectedClassesID) {
      getSessionsByClassID(selectedClassesID)
        .then((sessions) => {
          setSessions(sessions);
        })
        .catch((error) => {
          console.error("Failed to get sessions by class ID:", error);
        });
    }
  }, [selectedClassesID]);

  useEffect(() => {
    if (selectedSessionID) {
      getSessionByID(selectedSessionID)
        .then((session) => {
          setSelectedSession(session);
        })
        .catch((error) => {
          console.error("Failed to get sessions by class ID:", error);
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

  useEffect(() => {
    if (selectedSessionID) {
      getSessionByID(selectedSessionID).then((bookingObj) => {
        setSelectedSession(bookingObj);
      });
    } else {
      setSelectedSession({
        _id: "",
        Name: "",
        Description: "",
        Duration: "",
        Timeslot: "",
        Location: "",
      });
    }
  }, [selectedSessionID]);

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
          // setSelectedClassesID(classesDetails.id);
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
        getAllSessions().then((sessions) => {
          setSessions(sessions);
        });
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
        // getAllSessions().then((sessions) => setSessions(sessions));
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
          // getAllSessions().then((sessions) => setSessions(sessions));
        })
        .catch((error) => {
          console.error("Error in create Session:", error);
        });
    }
  }

  function deleteSelectedClasses(classID) {
    if (window.confirm("Are you sure you want to delete this Class?")) {
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
  }

  function deleteSelectedSession(sessionID) {
    if (window.confirm("Are you sure you want to delete this Session?")) {
      deleteSession(sessionID).then((result) => {
        getAllSessions().then((sessions) => {
          setSessions(sessions);
        });
        setSelectedSessionID(null);
        setSelectedSession({
          _id: "",
          classSessionId: "",
          sessionDate: "",
          participants: [],
          Trainer: "",
        });
        // getAllSessions().then((sessions) => setSessions(sessions));
      });
    }
  }

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
                {/* Edit */}
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
                        Edit
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
              <th className="sticky top-0 left-0 bg-primary rounded-l">
                {/* Edit */}
              </th>
              <th className="sticky top-0 bg-primary">Date</th>
              <th className="sticky top-0 bg-primary">Trainer</th>
              <th className="sticky top-0 bg-primary rounded-r">
                Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions ? (
              sessions.map((bookingObj) => {
                return (
                  <tr key={bookingObj._id}>
                    <td>
                      <button
                        className="btn btn-xs btn-warning rounded"
                        onClick={() => {
                          setSelectedSessionID(bookingObj._id);
                        }}
                      >
                        Edit
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
            onClick={() => deleteSelectedSession(selectedSessionID)}
          >
            Delete
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
