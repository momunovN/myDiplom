import express from 'express';
const router = express.Router();

// Получить все бронирования (админ)
router.get('/bookings', (req, res) => {
  res.json({ message: "Все бронирования (админ)" });
});

// Добавить сеанс
router.post('/sessions', (req, res) => {
  res.status(201).json({ message: "Сеанс добавлен", data: req.body });
});

export default router;