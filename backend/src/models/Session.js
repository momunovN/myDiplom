import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  date: { type: String },
  time: { type: String, required: true },
  hall: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, default: 120 },
  bookedSeats: { type: Number, default: 0 },
  bookedSeatsList: [{ type: String, default: [] }],   // ← список конкретных занятых мест
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Session', sessionSchema);