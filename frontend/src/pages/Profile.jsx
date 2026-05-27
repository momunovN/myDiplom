import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/bookings/user/current?userId=${user.id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Отменить бронирование?")) return;
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      alert("Бронирование отменено");
      fetchBookings(); // обновляем список
    } catch (err) {
      alert("Ошибка отмены");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Мой профиль</h1>

      <div className="bg-zinc-900 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-8">История бронирований ({bookings.length})</h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : bookings.length === 0 ? (
          <p className="text-zinc-400 text-center py-16">У вас пока нет бронирований</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h3 className="font-semibold text-xl">{booking.movieTitle}</h3>
                  <p className="text-zinc-400">
                    {booking.sessionTime} • {booking.hall}
                  </p>
                  <p className="text-emerald-400 mt-1">
                    Места: <span className="font-medium">{booking.seats?.join(', ')}</span>
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="text-2xl font-bold">{booking.totalPrice} ₽</p>
                  <p className="text-sm text-zinc-500">{new Date(booking.createdAt).toLocaleDateString('ru-RU')}</p>
                  <button 
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-4 px-5 py-2 text-red-500 hover:text-red-600 hover:bg-red-950/30 rounded-xl text-sm"
                  >
                    Отменить бронь
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}