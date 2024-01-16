import React, {useEffect, useState} from 'react'

function Movie() {

const [movieList, setMovieList] = useState([])

const getMovie = ()=>{
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=418bfbe8f91c13d9fc809c3c99f5dc3c")
    .then(res => res.json())
    .then(json => setMovieList(json.results))
}

useEffect(()=>{
    getMovie()
},[])

console.log(movieList)

  return (
    <div>
        {movieList.map((movie)=>(
            <img style={{width:"350px",height:"300px",marginLeft:"15px",marginTop:"30px"}} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
        ))}
    </div>
  )
}

export default Movie