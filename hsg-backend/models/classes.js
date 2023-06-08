// export function Classes(
//     _id = null,
//     Name,
//     Description,
//     Duration,
//     Timeslot,
//     Location,
// ) {
//     return {
//         ID: _id,
//         Name,
//         Description,
//         Duration,
//         Timeslot,
//         Location
//     }
// }

export function Classes(
    id,
    Name,
    Description,
    Duration,
    Timeslot,
    Location,
) {
    return {
        id,
        Name,
        Description,
        Duration,
        Timeslot,
        Location
    }
}

export function Session(
    id,
    classSessionId,
    sessionDate,
    participants,
    Trainer,
) {
    return {
        id,
        classSessionId,
        sessionDate,
        participants,
        Trainer,
    }
}

// export function Booking(bookingData) {
//     return {
//         id: bookingData.id,
//         classSessionId: bookingData.classSessionId,
//         sessionDate: bookingData.sessionDate,
//         participants: bookingData.participants,
//         Trainer: bookingData.Trainer
//     }
// }




