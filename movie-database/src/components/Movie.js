import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const getMovie = () => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=418bfbe8f91c13d9fc809c3c99f5dc3c&sort_by=popularity.desc&language=en-US&page=1&vote_count.gte=1000")
      .then(res => res.json())
      .then(json => setMovieList(json.results.slice(0, 50)))
      .catch(error => console.error('Error fetching movies:', error));
  }

  useEffect(() => {
    getMovie();
  }, []);

  const handleSearch = () => {
    let filteredMovies = movieList;

    if (searchQuery) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchYear) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.release_date.includes(searchYear)
      );
    }

    if (searchGenre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre_ids.includes(parseInt(searchGenre, 10))
      );
    }

    if (searchRating) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.vote_average >= parseFloat(searchRating)
      );
    }

    if (filteredMovies.length === 0) {
      setNotFoundMessage('No movies found.');
    } else {
      setNotFoundMessage('');
    }

    setMovieList(filteredMovies);
  }

  const openModal = async (movie) => {
    setSelectedMovie(movie);

    // Fetch similar movies
    const similarMoviesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=418bfbe8f91c13d9fc809c3c99f5dc3c&language=en-US&page=1`);
    const similarMoviesJson = await similarMoviesResponse.json();
    setSimilarMovies(similarMoviesJson.results);

    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setSimilarMovies([]);
  }

  return (
    <div style={{ backgroundColor: 'black', color: 'white', fontFamily: 'sans-serif', fontSize: '20px', textAlign: 'center', textDecoration: 'bold', minHeight: '475vh', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          style={{ backgroundColor: 'lightgrey', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          style={{ backgroundColor: 'lightgrey', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
          placeholder="Filter by year"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        />
        <select
          style={{ backgroundColor: 'lightgrey', color: 'grey', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <input
          type="text"
          style={{ backgroundColor: 'lightgrey', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
          placeholder="Filter by rating"
          value={searchRating}
          onChange={(e) => setSearchRating(e.target.value)}
        />
        <button
          onClick={handleSearch}
          style={{ backgroundColor: 'lightblue', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '10px' }}
        >
          Search
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        {notFoundMessage ? (
          <p style={{ fontSize: '30px', marginTop: '50px' }}>{notFoundMessage}</p>
        ) : (
          movieList.map((movie) => (
            <div key={movie.id} style={{ margin: '10px', flexBasis: 'calc(25% - 20px)' }}>
              <img
                style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                onClick={() => openModal(movie)}
              />
              <p>{movie.title}</p>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Movie Details"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '90%',
            maxWidth: '600px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'lightgrey',
            color: 'blue',
            textAlign: 'center',
          },
          button: {
            backgroundColor: 'blue',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          },
        }}
      >
        {selectedMovie && (
          <div>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>
            <p>Release Year: {selectedMovie.release_date}</p>
            <p>Genre: {selectedMovie.genre_ids.join(', ')}</p>
            <p>Rating: {selectedMovie.vote_average}</p>
            <h3>Similar Movies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {similarMovies.map((similarMovie) => (
                <div key={similarMovie.id} style={{ margin: '10px', flexBasis: 'calc(50% - 20px)' }}>
                  <img
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                    alt={similarMovie.title}
                    onClick={() => openModal(similarMovie)}
                  />
                  <p>{similarMovie.title}</p>
                </div>
              ))}
            </div>
            <button onClick={closeModal} style={{ backgroundColor: 'blue', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Movie;
