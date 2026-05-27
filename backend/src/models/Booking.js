import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  sessionId: { type: String, required: true },
  sessionTime: String,
  hall: String,
  seats: [{ type: String }], // массив выбранных мест
  totalPrice: Number,
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
