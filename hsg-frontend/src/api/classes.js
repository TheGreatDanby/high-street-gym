import { API_URL } from "./api.js";

export async function getAllClasses() {
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "GET"
        }
    );
    const getClassesResponse = await response.json()
    return getClassesResponse.classesObj;
}



export async function getClassesByID(classesID) {
    const response = await fetch(
        API_URL + "/classes/" + classesID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
    const getClassesByIdResponse = await response.json()
    return getClassesByIdResponse.classes
}

export async function createClasses(classes) {
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(classes)
        }
    )
    const postCreateClassesResponse = await response.json()
    return postCreateClassesResponse.classes
}

// export async function uploadClassesXML(file) {
//     // Create a FormData instance
//     const formData = new FormData();
//     // Append the file to the form data under the key "xml-file"
//     formData.append("xml-file", file);

//     const response = await fetch(
//         API_URL + "/classes/upload/xml",
//         {
//             method: "POST",
//             body: formData
//         }
//     )

//     const uploadResponse = await response.json();

//     // If the response contains a 'message', that means it's likely an error.
//     // If the HTTP response status is not 200, it's also likely an error.
//     if (uploadResponse.message || response.status !== 200) {
//         throw new Error(uploadResponse.message);
//     }

//     return uploadResponse;
// }


// export async function updateClasses(classId, classData) {
//     console.log("🚀 ~ file: classes.js:71 ~ updateClasses ~ classData:", classData)
//     console.log("🚀 ~ file: classes.js:71 ~ updateClasses ~ classId:", classId)
//     const response = await fetch(
//         API_URL + "/classes/" + classId,
//         {
//             method: "PATCH",
//             headers: {
//                 'Content-Type': "application/json"
//             },
//             body: JSON.stringify(classData)
//         }
//     )
//     const patchClassesResponse = await response.json()
//     return patchClassesResponse.classes
// }

export async function updateClasses(classes) {
    console.log("🚀 ~ file: classes.js:88 ~ updateClasses ~ classes:", classes)
    const response = await fetch(
        API_URL + "/classes",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(classes)
        }
    )

    const patchClassesResult = await response.json()

    return patchClassesResult
}

// export async function updateBooking(bookingId, bookingData) {
//     const response = await fetch(
//         API_URL + "/booking/" + bookingId,
//         {
//             method: "PATCH",
//             headers: {
//                 'Content-Type': "application/json"
//             },
//             body: JSON.stringify(bookingData)
//         }
//     )
//     const patchBookingResponse = await response.json()
//     return patchBookingResponse.booking
// }

export async function updateBooking(booking) {
    console.log("🚀 ~ file: classes.js:120 ~ updateBooking ~ sessionDate:", booking.sessionDate)
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const patchBookingResult = await response.json()

    return patchBookingResult
}

export async function updateSession(session) {
    console.log("🚀 ~ file: classes.js:139 ~ updateSession ~ session:", session)
    const response = await fetch(
        API_URL + "/session",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(session)
        }
    )
    console.log("🚀 ~ file: classes.js:148 ~ updateSession ~ session:", session)

    const patchSessionResult = await response.json()

    return patchSessionResult
}


export async function deleteClasses(classID) {
    const response = await fetch(
        API_URL + "/classes/" + classID,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )
    const deleteClassesResponse = await response.json()
    return deleteClassesResponse
}

export async function getBookingByID(bookingID) {
    const response = await fetch(
        API_URL + "/bookings/" + bookingID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
    const getBookingByIdResponse = await response.json()
    return getBookingByIdResponse.booking
}

export async function getSessionByID(sessionID) {
    console.log("🚀 ~ file: classes.js:186 ~ getSessionByID ~ sessionID:", sessionID)
    const response = await fetch(
        API_URL + "/session/" + sessionID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        })
    const getSessionByIdResponse = await response.json()
    return getSessionByIdResponse.session
}

export async function getBookingsByClassID(classSessionId) {
    const response = await fetch(
        API_URL + "/bookings/class/" + classSessionId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    );
    const getBookingByClassIDResponse = await response.json()
    return getBookingByClassIDResponse.bookings;  // Assuming the response contains an array of bookings.
}


// export async function createBooking(classSessionId, sessionDate, participant) {


//     const response = await fetch(
//         API_URL + "/classes/" + classSessionId + "/session",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 sessionDate: sessionDate,
//                 participant: {
//                     userId: participant.userId,
//                     name: participant.name,
//                 },
//             }),
//         }
//     );

//     if (!response.ok) {
//         throw new Error(`Error adding booking: ${response.statusText}`);
//     }
//     const createBookingResponse = await response.json();
//     console.log(`create booking response:`, createBookingResponse)
//     return createBookingResponse.booking;
// }

export async function createBooking(booking) {
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )
    const postCreateBookingResponse = await response.json()
    return postCreateBookingResponse.booking
}

export async function createSession(session) {
    console.log("🚀 ~ file: classes.js:242 ~ createSession ~ session:", session)
    const response = await fetch(
        API_URL + "/session",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(session)
        }
    )
    const postCreateSessionResponse = await response.json()
    return postCreateSessionResponse.session
}

export async function deleteBooking(booking) {
    const response = await fetch(
        API_URL + "/booking",
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )
    const deleteBookingResponse = await response.json()
    return deleteBookingResponse.booking
}


// export async function deleteBooking(classSessionId, currentSessionDate, loggedInUserId) {

//     const response = await fetch(
//         API_URL + "/classes/" + classSessionId + "/session",
//         {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 sessionDate: currentSessionDate,
//                 loggedInUserId: loggedInUserId,
//             }),
//         }
//     );

//     if (!response.ok) {
//         throw new Error(`Error deleting booking: ${response.statusText}`);
//     }

//     console.log(`Booking deleted successfully for participant with ID: ${loggedInUserId}`)
// }

// export async function deleteBooking(bookingID) {
//     const response = await fetch(
//         API_URL + "/booking/" + bookingID,
//         {
//             method: "DELETE",
//             headers: {
//                 'Content-Type': "application/json"
//             },
//         }
//     )
//     const deleteBookingResponse = await response.json()
//     return deleteBookingResponse
// }

export async function getAllBookings() {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "GET"
        }
    );
    const getBookingsResponse = await response.json();
    return getBookingsResponse.bookingsObj;
}





