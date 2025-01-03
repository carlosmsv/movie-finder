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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchMovies = async (query: string, page: number) => {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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
      <h1>Movie Finder</h1>
      <div className='search-section'>
        <input
          className='search-input'
          type='string'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className='search-button'
          type='button'
          onClick={() => handleSearch(query)}
        >
          SEARCH
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          <div className='movies-container' key='movies-container'>
            {moviesList.map((movie) => (
              <div key={movie.imdbId} className='movie-card'>
                {movie.Poster === 'N/A' ? (
                  <span className='no-poster-found'>No Poster found</span>
                ) : (
                  <img
                    className='movie-img'
                    src={movie.Poster}
                    alt={movie.Title}
                  />
                )}
                <span className='movie-title'>{movie.Title}</span>
                <span className='movie-year'>{movie.Year}</span>
              </div>
            ))}
          </div>

          <div className='pages-selector' key='pages-selector'>
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className='page-button'
                  onClick={() => handleSearch(query, pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </>
      )}
    </>
  )
}

export default App
