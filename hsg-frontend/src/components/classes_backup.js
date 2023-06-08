import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Sessions from "./Sessions.jsx";
import { getAllClasses } from "../api/classes";

export default function Classes() {
    const [classes, setClasses] = useState([]);

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

    useEffect(() => {
        console.log("Classes state updated:", classes);
    }, [classes]);

    function handleBookingUpdate(classId, sessionId, updatedClass) {
        setClasses((prevClasses) =>
            prevClasses.map((classObj) => {
                if (classObj._id === classId) {
                    return {
                        ...classObj,
                        bookings: {
                            ...classObj.bookings,
                            bookings: classObj.bookings.bookings.map((session) => {
                                if (session.id === updatedClass._id) {
                                    return updatedClass;
                                }
                                return session;
                            }),
                        },
                    };
                }
                return classObj;
            })
        );
    }

    return (
        <div>
            {classes.map((classObj) => (
                <div key={classObj.Name} id={classObj.Name} className="classes">
                    <div
                        className="card lg:card-side bg-info shadow-xl m-5"
                        key={classObj.ID}
                    >
                        <figure>
                            <img
                                src={`/${classObj.Name.toLowerCase()}.jpg`}
                                alt={classObj.Name}
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-white">{classObj.Name}</h2>

                            <p className="text-white" style={{ width: "400px" }}>
                                {classObj.Description}
                            </p>
                            <div className="bg-primary rounded-md text-white text-center">
                                <Sessions
                                    classObj={classObj}
                                    onBookingUpdate={(sessionId, newParticipantsCount) =>
                                        handleBookingUpdate(
                                            classObj._id,
                                            sessionId,
                                            newParticipantsCount
                                        )
                                    }
                                />

                                <p className="mt-5">At: {classObj.Timeslot}</p>
                            </div>
                            <div className="bg-secondary rounded-md text-white text-center	">
                                <h3>Location:</h3>
                                <p>Building: {classObj.Location.Building}</p>
                                <p>Room: {classObj.Location.Room}</p>
                            </div>
                            <div className="bg-accent rounded-md text-white text-center	">
                                <h3>Trainer(s):</h3>
                                <p>{classObj.Trainer.Trainer1}</p>
                                <p>{classObj.Trainer.Trainer2}</p>
                            </div>

                            <div className="card-actions justify-end"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
