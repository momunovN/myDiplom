import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750/27272a/ffffff?text=Нет+постера';

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="movie-card group block bg-zinc-900 rounded-3xl overflow-hidden"
    >
      <div className="relative">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full aspect-2/3 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {movie.vote_average && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-2xl flex items-center gap-1">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <p className="text-zinc-400 text-sm mt-2">
          {movie.release_date ? movie.release_date.substring(0, 4) : '—'}
        </p>
      </div>
    </Link>
  );
}