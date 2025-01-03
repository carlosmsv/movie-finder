import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

type Movie = {
  Title: string
  Year: string
  imdbId: string
  Type: string
  Poster: string
}

function App() {
  const [moviesList, setMoviesList] = useState<Movie[]>([])
  const [query, setQuery] = useState<string>('')
  const [pages, setPages] = useState<number>(0)

  const fetchMovies = async (query: string, page: number) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}?s=${query}&apikey=${API_KEY}&page=${page}`
      )

      const data = await response.json()

      if (data.Response === 'False') {
        alert(`Error: ${data.Error}`)
        setPages(0)
        setMoviesList([])
        return
      }

      setMoviesList(data.Search)
      const numberOfPages = Math.ceil(Number(data.totalResults) / 10)
      setPages(numberOfPages)
    } catch (error) {
      alert(`Error fetching movies list: ${error}`)
      setMoviesList([])
      setPages(0)
    }
  }

  const handleSearch = (query: string, page = 1) => {
    if (!query.trim()) {
      alert('Please type an search term.')
      return
    }
    fetchMovies(query, page)
  }

  return (
    <>
      <h1 className='title'>Movie Finder</h1>
      <div>
        <input
          type='string'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => handleSearch(query)}>SEARCH</button>
      </div>
      <div>
        {moviesList.map((movie) => (
          <div>
            <img src={movie.Poster} />
            <span>{movie.Title}</span>
            <span>{movie.Year}</span>
          </div>
        ))}
      </div>
      <div>
        {Array.from({ length: pages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button onClick={() => handleSearch(query, pageNumber)}>
              {pageNumber}
            </button>
          )
        )}
      </div>
    </>
  )
}

export default App
