import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getMovie = () => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=418bfbe8f91c13d9fc809c3c99f5dc3c")
      .then(res => res.json())
      .then(json => setMovieList(json.results))
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

    setMovieList(filteredMovies);
  }

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <div style={{ backgroundColor: 'black' , color: 'white', fontFamily:'sans-serif', fontSize:'20px', textAlign:'center', textDecoration: 'bold'}}>
      <div>
        <input
          type="text" style={{ backgroundColor: 'lightgrey', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text" style={{ backgroundColor: 'lightgrey', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', marginLeft:'20px'}}
          placeholder="Filter by year"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        />
        <button onClick={handleSearch} style={{ backgroundColor: 'lightgrey', color: 'grey', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', marginLeft:'20px'}}>Search</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movieList.map((movie) => (
          <div key={movie.id} style={{ margin: '10px', flexBasis: 'calc(25% - 20px)' }}>
            <img
              style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              onClick={() => openModal(movie)}
            />
            <p>{movie.title}</p>
          </div>
        ))}
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
            width: '30%',
            height: '40%',
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
            {/* Add more details as needed */}
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
