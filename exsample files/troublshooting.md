UI: `<button
            className="btn btn-accent rounded-md w-1/3"
            onClick={() => deleteSelectedBooking(selectedBookingID)}
          >
            Delete
          </button>{" "}`
` function deleteSelectedBooking(bookingID) {
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
  }`

API: `export async function deleteBooking(bookingID) {
    const response = await fetch(
        API_URL + "/booking/" + bookingID,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )
    const deleteBookingResponse = await response.json()
    return deleteBookingResponse
}`
controller `classesController.delete("/booking/:bookingId/", (req, res) => {
const bookingId = req.params.bookingId;
const { loggedInUserId } = req.body;

    deleteBooking(bookingId, loggedInUserId)
        .then((updatedBooking) => {
            if (!updatedBooking) {
                res.status(404).json({
                    status: 404,
                    message: "Class session not found",
                });
                return;
            }
            res.status(200).json({
                status: 200,
                message: "Booking deleted",
                booking: updatedBooking,
            });
        })
        .catch((error) => {
            console.error("Error deleting booking:", error);
            res.status(500).json({
                status: 500,
                message: "Failed to delete booking",
            });
        });

});`

model ``
