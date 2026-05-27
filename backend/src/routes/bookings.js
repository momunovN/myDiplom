import express from 'express';
import Booking from '../models/Booking.js';
import Session from '../models/Session.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, movieId, movieTitle, sessionId, sessionTime, hall, seats, totalPrice } = req.body;

    const booking = new Booking({
      userId,
      movieId,
      movieTitle,
      sessionId,
      sessionTime,
      hall,
      seats,
      totalPrice,
      status: "confirmed"
    });

    await booking.save();

    await Session.findByIdAndUpdate(sessionId, {
      $inc: { bookedSeats: seats.length },
      $push: { bookedSeatsList: { $each: seats } }
    });

    res.status(201).json({ message: "Бронирование сохранено" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/current', async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отмена бронирования + возврат мест
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Бронирование не найдено" });

    // Возвращаем места в сессию
    await Session.findByIdAndUpdate(booking.sessionId, {
      $inc: { bookedSeats: -booking.seats.length },
      $pull: { bookedSeatsList: { $in: booking.seats } }
    });

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Бронирование отменено, места возвращены" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;