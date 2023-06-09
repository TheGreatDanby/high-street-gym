import { Classes } from "./classes.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js"

export async function createClass(classes) {

    // delete classes.id

    return db.collection("Classes").insertOne({ ...classes })
        .then(result => {
            delete classes._id

            return { ...classes, id: result.insertedId.toString() }
        })
}

export async function createSession(session) {

    // delete classes.id

    const sessionToInsert = {
        ...session,
        classSessionId: new ObjectId(session.classSessionId),
        sessionDate: new Date(session.sessionDate)
    };

    return db.collection("Bookings").insertOne(sessionToInsert)
        .then(result => {
            delete session._id

            return { ...sessionToInsert, id: result.insertedId.toString() }
        })
}

export async function createClassXML(classes) {
    // delete classes.id

    let result = await db.collection("Classes").insertOne({ ...classes })

    // Rebuild the trail object with the inserted ID
    return Promise.resolve({ ...result, id: result.insertedId.toString() })
}

export async function createBooking(booking) {

    // delete classes.id

    return db.collection("Bookings").insertOne({ ...booking })
        .then(result => {
            delete booking._id

            return { ...booking, id: result.insertedId.toString() }
        })
}

export async function getAll() {
    let allClassesResults = await db.collection("Classes").find().toArray()
    for (const classIndex in allClassesResults) {
        const classes = allClassesResults[classIndex]
        const classBookings = await getClassSessionsById(classes._id)
        allClassesResults[classIndex] = {
            ...classes,
            bookings: classBookings
        }
    }
    return allClassesResults

}

export async function getAllBookings() {
    const bookings = await db.collection('bookings').find({}).toArray();
    return bookings;
}

export async function getAllSessions() {
    const sessions = await db.collection('Bookings').find({}).toArray();
    return sessions;
}


export async function getClassSessionsById(classSessionId) {
    const classSession = await db.collection("Classes").findOne({ _id: new ObjectId(classSessionId) });
    if (!classSession) {
        return null;
    }

    const bookings = await db.collection("Bookings").find({ classSessionId: new ObjectId(classSessionId) }).limit(3).sort({ sessionDate: 1 }).toArray();

    return {
        id: classSession._id.toString(),
        name: classSession.Name,
        bookings: bookings.map((booking) => ({
            id: booking._id.toString(),
            classSessionId: classSessionId,
            sessionDate: booking.sessionDate,
            timeslot: classSession.Timeslot,
            location: classSession.Location,
            trainer: booking.Trainer,
            participants: booking.participants,

        })),
    };

}

export async function addBooking(classSessionId, sessionDate, userId, userName) {
    const classSessionObjectId = ObjectId.createFromHexString(classSessionId);

    console.log("🚀 ~ file: classes-mdb.js:82 ~ addBooking ~ classSessionId:", classSessionId)
    console.log('classSessionObjectId:', classSessionObjectId);

    const session = await db.collection("Bookings").findOne({
        classSessionId: new ObjectId(classSessionId),
        sessionDate: new Date(sessionDate),
    });
    console.log("🚀 ~ file: classes-mdb.js:88 ~ session ~ session:", session)
    console.log('Session:', session);


    if (!session) {
        return null;
    }

    const updatedParticipants = [
        ...session.participants,
        {
            userId,
            name: userName,
        },
    ];

    await db.collection("Bookings").updateOne(
        {
            _id: session._id,
        },
        {
            $set: {
                participants: updatedParticipants,
            },
        }
    );

    const booking = await db.collection("Bookings").findOne({
        _id: session._id
    })

    return booking;
}

// export async function deleteBooking(classSessionId, userId) {
//     const classSessionObjectId = ObjectId.createFromHexString(classSessionId);

//     const session = await db.collection("Bookings").findOne({
//         classSessionId: classSessionObjectId,
//     });

//     if (!session) {
//         return null;
//     }

//     // Filter out the participant to be removed
//     const updatedParticipants = session.participants.filter(
//         (participant) => participant.userId !== userId
//     );

//     await db.collection("Bookings").updateOne(
//         {
//             _id: session._id,
//         },
//         {
//             $set: {
//                 participants: updatedParticipants,
//             },
//         }
//     );

//     const booking = await db.collection("Bookings").findOne({
//         _id: session._id
//     })

//     return booking;
// }





export async function getByID(classesID) {
    let classesResult = await db.collection("Classes").findOne({ _id: new ObjectId(classesID) })

    if (classesResult !== null) {
        return Promise.resolve(
            Classes(
                classesResult._id.toString(),
                classesResult.Name,
                classesResult.Description,
                classesResult.Duration,
                classesResult.Timeslot,
                classesResult.Location
            ),
        )
    } else {
        return Promise.reject("no matching result found")
    }
}

export async function getBookingsByClassID(classId) {
    let bookingResults = await db.collection("Bookings").find({ classSessionId: new ObjectId(classId) }).toArray();

    if (bookingResults !== null && bookingResults.length > 0) {
        return bookingResults.map(bookingResult => {
            return {
                _id: bookingResult._id.toString(),
                sessionDate: bookingResult.sessionDate,
                participants: bookingResult.participants,
                Trainer: bookingResult.Trainer
            };
        });
    } else {
        throw new Error("no matching result found");
    }
}

export async function getSessionsByClassID(classId) {
    let sessionResults = await db.collection("Bookings").find({ classSessionId: new ObjectId(classId) }).toArray();

    if (sessionResults !== null && sessionResults.length > 0) {
        return sessionResults.map(sessionResult => {
            return {
                _id: sessionResult._id.toString(),
                sessionDate: sessionResult.sessionDate,
                participants: sessionResult.participants,
                Trainer: sessionResult.Trainer
            };
        });
    } else {
        throw new Error("no matching result found");
    }
}


export async function getBookingByID(bookingID) {
    let bookingResult = await db.collection("Bookings").findOne({ _id: new ObjectId(bookingID) })

    if (bookingResult !== null) {
        return Promise.resolve({
            _id: bookingResult._id.toString(),
            sessionDate: bookingResult.sessionDate,
            participants: bookingResult.participants,
            Trainer: bookingResult.Trainer
        });
    } else {
        return Promise.reject("no matching result found");
    }
}

export async function getSessionByID(sessionID) {
    console.log("🚀 ~ file: classes-mdb.js:217 ~ getSessionByID ~ sessionID:", sessionID)
    let sessionResult = await db.collection("Bookings").findOne({ _id: new ObjectId(sessionID) })

    if (sessionResult !== null) {
        return Promise.resolve({
            _id: sessionResult._id.toString(),
            sessionDate: sessionResult.sessionDate,
            participants: sessionResult.participants,
            Trainer: sessionResult.Trainer
        });
    } else {
        return Promise.reject("no matching result found");
    }
}


// export async function updateClass(classId, classData) {
//     console.log("Model classData:", classData);
//     const classesID = new ObjectId(classId);
//     if ('id' in classData) {
//         delete classData.id;
//     }

//     const classesUpdateDocument = {
//         "$set": classData
//     }

//     try {
//         const result = await db.collection("Classes").updateOne({ _id: classesID }, classesUpdateDocument);
//         return result;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

export async function updateClass(classes) {
    const classesID = new ObjectId(classes.id)
    delete classes.id
    const classesUpdateDocument = {
        "$set": classes
    }
    return db.collection("Classes").updateOne({ _id: classesID }, classesUpdateDocument)
}
export async function updateClassXML(classes) {
    const className = classes.Name;
    const classesUpdateDocument = {
        "$set": classes
    }
    return db.collection("Classes").updateOne({ Name: className }, classesUpdateDocument)
}

export async function updateSession(session) {
    const sessionID = new ObjectId(session.id)
    delete session.id
    const sessionUpdateDocument = {
        "$set": {
            sessionDate: session.sessionDate,
            Trainer: session.Trainer
        }
    }
    return db.collection("Bookings").updateOne({ _id: sessionID }, sessionUpdateDocument)
}


// export async function updateBooking(bookingId, bookingData) {
//     const bookingID = new ObjectId(bookingId)
//     if ('id' in bookingData) {
//         delete bookingData.id;
//     }

//     const bookingUpdateDocument = {
//         "$set": bookingData
//     }

//     return db.collection("Bookings").updateOne({ _id: bookingID }, bookingUpdateDocument)
// }
export async function updateBooking(bookingData) {
    return db
        .collection("Bookings")
        .findOneAndUpdate(
            { classSessionId: new ObjectId(bookingData.classSessionId), sessionDate: new Date(bookingData.sessionDate) },
            { $push: { participants: bookingData.participant } },
            { returnOriginal: false }
        )
        .then((result) => {
            if (result.value) {
                return result.value;
            } else {
                throw new Error("No matching booking found.");
            }
        })
        .catch((error) => {
            throw error;
        });
}

// export async function updateSession(sessionData) {
//     return db
//         .collection("Bookings")
//         .findOneAndUpdate(
//             { classSessionId: new ObjectId(bookingData.classSessionId), sessionDate: new Date(bookingData.sessionDate) },
//             { $push: { participants: bookingData.participant } },
//             { returnOriginal: false }
//         )
//         .then((result) => {
//             if (result.value) {
//                 return result.value;
//             } else {
//                 throw new Error("No matching session found.");
//             }
//         })
//         .catch((error) => {
//             throw error;
//         });
// }

export async function deleteBooking(bookingData) {
    return db
        .collection("Bookings")
        .findOneAndUpdate(
            { classSessionId: new ObjectId(bookingData.classSessionId), sessionDate: new Date(bookingData.sessionDate) },
            { $pull: { participants: bookingData.participant } },
            { returnOriginal: false }
        )
        .then((result) => {
            if (result.value) {
                return result.value;
            } else {
                throw new Error("No matching booking found.");
            }
        })
        .catch((error) => {
            throw error;
        });
}


export async function deleteClassByID(classesID) {
    return db.collection("Classes").deleteOne({ _id: new ObjectId(classesID) })
}

export async function deleteSessionByID(classesID) {
    return db.collection("Bookings").deleteOne({ _id: new ObjectId(classesID) })
}

export async function deleteBookingByID(bookingID) {
    return db.collection("Bookings").deleteOne({ _id: new ObjectId(bookingID) })
}