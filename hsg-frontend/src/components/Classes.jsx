import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllClasses, createBooking, deleteBooking } from "../api/classes";
import { useAuthentication } from "../hooks/authentication";
import Select from "react-select";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [currentSession, setCurrentSession] = useState(null);
  const [authenticatedUser, login, logout] = useAuthentication();
  const [currentClass, setCurrentClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  // const [currentSessionDate, setCurrentSessionDate] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getAllClasses().then((getClassesResponse) => {
      const sortedClasses = getClassesResponse.sort((a, b) => {
        const dateA =
          a.bookings.bookings.length > 0
            ? dayjs(a.bookings.bookings[0].sessionDate)
            : dayjs();
        const dateB =
          b.bookings.bookings.length > 0
            ? dayjs(b.bookings.bookings[0].sessionDate)
            : dayjs();
        return dateA.isBefore(dateB) ? -1 : 1;
      });
      setClasses(sortedClasses);
    });
  }, []);

  function Modal({ classObj, onClose, onConfirmBooking }) {
    const sessionOptions = classObj.bookings.bookings.map((sessionObj) => ({
      value: sessionObj,
      label: dayjs(sessionObj.sessionDate).format("DD/MM/YY"),
    }));

    function handleSelectChange(option) {
      setSelectedSession(option.value);
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h4>Session Details</h4>
          <Select options={sessionOptions} onChange={handleSelectChange} />
          <button onClick={onClose}>Close</button>
          <button
            onClick={() => {
              onConfirmBooking(selectedSession);
              onClose();
            }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  }

  function sessionBooking(classSessionId, sessionDate, classObj) {
    const participant = {
      userId: authenticatedUser.id,
      name: authenticatedUser.firstName,
    };

    createBooking({
      classSessionId: classSessionId,
      sessionDate: sessionDate,
      participant: participant,
    })
      // .then((booking) => {
      //   handleBookingUpdate(classObj._id, classSessionId, booking);
      // })
      .then((booking) => {
        setClasses((prevClasses) =>
          prevClasses.map((classItem) => {
            if (classItem._id === classObj._id) {
              // Deep copy classItem
              let newClassItem = JSON.parse(JSON.stringify(classItem));

              // Find the updated session and replace it
              let sessionIndex = newClassItem.bookings.bookings.findIndex(
                (session) => session._id === booking._id
              );
              newClassItem.bookings.bookings[sessionIndex] = booking;

              return newClassItem;
            } else {
              return classItem;
            }
          })
        );
      })

      .catch((error) => {
        console.error(error);
      });
  }

  function handleSelectChange(option) {
    setSelectedSession(option.value);
  }

  const cancelBooking = async (classSessionId, currentSessionDate) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const bookingData = {
        classSessionId: classSessionId,
        sessionDate: currentSessionDate,
        participant: {
          userId: authenticatedUser.id,
          name: authenticatedUser.name,
        },
      };

      try {
        await deleteBooking(bookingData);
        console.log(
          "🚀 ~ file: Classes.jsx:112 ~ cancelBooking ~ classSessionId:",
          classSessionId
        );
        const updatedSessions = sessions.filter(
          (session) => session.classSessionId !== classSessionId
        );
        setSessions(updatedSessions);
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  return (
    <div>
      {classes.map((classObj) => (
        <div key={classObj.Name} id={classObj.Name} className="classes">
          <div
            className="card lg:card-side bg-info shadow-xl mt-10 md:mt-0 md:mb-10 "
            key={classObj.ID}
          >
            <figure>
              <img
                src={`/${classObj.Name.toLowerCase()}.jpg`}
                alt={classObj.Name}
                onError={(e) => {
                  if (e.target.src !== "/class.jpg") {
                    e.target.onerror = null;
                    e.target.src = "/class.jpg";
                  }
                }}
              />
            </figure>
            <div className="card-body ">
              <h2 className="card-title text-white">{classObj.Name}</h2>

              <p className="text-white md:w-96">{classObj.Description}</p>
              <div className="bg-primary rounded-md text-white text-center ">
                {classObj.bookings.bookings.map((sessionObj, index) => {
                  console.log("Current session:", sessionObj);
                  const isBooked = sessionObj.participants.some(
                    (participant) => participant.userId === authenticatedUser.id
                  );
                  return (
                    <div
                      key={`${sessionObj.classSessionId}-${index}`}
                      id={sessionObj.classSessionId}
                      className="sessions  mt-2"
                    >
                      <div className="bg-info w-2/3  rounded-md m-2 mx-auto">
                        <p className=" ">
                          {dayjs(sessionObj.sessionDate).format("DD/MM/YY")}
                        </p>
                        <p className="">Class Run By:</p>
                        <p className="">{sessionObj.trainer}</p>
                        <p>{sessionObj.participants.length} have booked</p>
                      </div>
                      {isBooked && (
                        <button
                          className="btn btn-warning mt-5 self-center rounded-md text-xl"
                          onClick={() =>
                            cancelBooking(
                              sessionObj.classSessionId,
                              sessionObj.sessionDate
                            )
                          }
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  );
                })}

                <p className="mt-5">At: {classObj.Timeslot}</p>
              </div>
              <div className="bg-secondary rounded-md text-white text-center">
                <h3>Location:</h3>
                <p>{classObj.Location}</p>
              </div>

              <div className="card-actions justify-end"></div>
              <label
                htmlFor="my-modal"
                className="btn btn-success mt-5 w-2/3 self-center rounded-md text-xl"
                onClick={() => {
                  console.log("Book class button clicked");
                  setCurrentClass(classObj);
                  setIsModalVisible(true);
                }}
              >
                Book A Class
              </label>

              <input type="checkbox" id="my-modal" className="modal-toggle" />
              {isModalVisible && currentClass && (
                <div className="modal">
                  <div className="modal-box">
                    <h2 className="text-lg font-bold">
                      Select the session for the class {currentClass.Name}
                    </h2>
                    <br />
                    <Select
                      className="text-black	"
                      options={currentClass.bookings.bookings.map(
                        (sessionObj) => ({
                          value: sessionObj,
                          label: dayjs(sessionObj.sessionDate).format(
                            "DD/MM/YY"
                          ),
                        })
                      )}
                      onChange={handleSelectChange}
                    />
                    <br />
                    <br />

                    <div className="modal-action">
                      <label
                        htmlFor="my-modal"
                        className="btn btn-info"
                        onClick={() => setIsModalVisible(false)}
                      >
                        Close
                      </label>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          sessionBooking(
                            selectedSession.classSessionId,
                            selectedSession.sessionDate,
                            currentClass
                          );
                          setIsModalVisible(false);
                        }}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
