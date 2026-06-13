import express from 'express';
import Booking from '../models/Booking.js';
import Session from '../models/Session.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ======================
// Получить мои бронирования
// ======================
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении бронирований' });
  }
});

// ======================
// Создать бронирование
// ======================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { sessionId, seats, totalPrice } = req.body;

    if (!sessionId || !seats || seats.length === 0) {
      return res.status(400).json({ message: 'Необходимо указать sessionId и seats' });
    }

    // Находим сеанс
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Сеанс не найден' });
    }

    // Проверяем, не заняты ли уже эти места
    const alreadyBooked = seats.filter(seat => 
      session.bookedSeatsList.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: 'Некоторые места уже забронированы',
        seats: alreadyBooked
      });
    }

    // Добавляем места в сеанс
    session.bookedSeatsList.push(...seats);
    session.bookedSeats = session.bookedSeatsList.length;
    await session.save();

    // Создаём запись о бронировании (для истории)
    const booking = await Booking.create({
      userId: req.user.id,
      movieId: session.movieId,
      movieTitle: session.movieTitle,
      sessionId: session._id,
      sessionTime: session.time,
      hall: session.hall,
      seats: seats,
      totalPrice: totalPrice || (seats.length * session.price),
      status: 'confirmed'
    });

    res.status(201).json({
      message: 'Бронирование успешно создано',
      booking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Ошибка при создании бронирования',
      error: error.message 
    });
  }
});

export default router;