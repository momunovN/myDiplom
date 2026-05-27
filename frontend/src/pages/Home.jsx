import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [highRated, setHighRated] = useState([]);
  const [loading, setLoading] = useState(true);

  const popularRef = useRef(null);
  const newRef = useRef(null);
  const highRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popRes, newRes, highRes] = await Promise.all([
          axios.get('https://api.themoviedb.org/3/movie/popular', { 
            params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'ru-RU', page: 1 } 
          }),
          axios.get('https://api.themoviedb.org/3/movie/now_playing', { 
            params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'ru-RU', page: 1 } 
          }),
          axios.get('https://api.themoviedb.org/3/movie/top_rated', { 
            params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'ru-RU', page: 1 } 
          })
        ]);

        setPopular(popRes.data.results.slice(0, 20));
        setNewMovies(newRes.data.results.slice(0, 20));
        setHighRated(highRes.data.results.filter(m => m.vote_average >= 7.0).slice(0, 20));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Бесконечная автопрокрутка (не останавливается)
  useEffect(() => {
    const autoScroll = (ref, speed = 30, direction = 1) => {
      if (!ref.current) return;

      const scroll = () => {
        if (ref.current) {
          ref.current.scrollLeft += direction;
          
          // Бесконечная прокрутка (дублируем контент)
          if (ref.current.scrollLeft >= ref.current.scrollWidth / 2) {
            ref.current.scrollLeft = 0;
          }
        }
      };

      const interval = setInterval(scroll, speed);
      return interval;
    };

    const int1 = autoScroll(newRef, 25, 1);     // Новинки — вправо (быстро)
    const int2 = autoScroll(popularRef, 35, -1); // Популярные — влево
    const int3 = autoScroll(highRef, 30, 1);     // Высокий рейтинг — вправо

    return () => {
      clearInterval(int1);
      clearInterval(int2);
      clearInterval(int3);
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10"></div>
        <img src="https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMUBjM.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tighter">KinoBook</h1>
          <p className="text-2xl text-zinc-300">Билеты в кино за секунды</p>
        </div>
      </div>

      {/* Карусель Новинок */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">🆕 Новинки 2026</h2>
        <div ref={newRef} className="flex gap-6 overflow-x-hidden pb-8">
          {[...newMovies, ...newMovies].map((movie, index) => (   // Дублируем для бесконечности
            <div key={index} className="min-w-70 shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      {/* Карусель Популярные */}
      <div className="max-w-7xl mx-auto px-6 py-12 bg-zinc-950">
        <h2 className="text-3xl font-bold mb-6">🔥 Популярное сейчас</h2>
        <div ref={popularRef} className="flex gap-6 overflow-x-hidden pb-8">
          {[...popular, ...popular].map((movie, index) => (
            <div key={index} className="min-w-70 shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      {/* Карусель Высокий рейтинг */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">⭐ Рейтинг 7.0+</h2>
        <div ref={highRef} className="flex gap-6 overflow-x-hidden pb-8">
          {[...highRated, ...highRated].map((movie, index) => (
            <div key={index} className="min-w-70 shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}