import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [moviesUpdate, setMoviesUpdate] = useState([]);
  const [isLoading, setIsLoading] = useState(`false`);
  const [showError, setShowError] = useState(null);

  const moviesDataHandler = useCallback(async () => {
    setIsLoading(true);
    setShowError(null);
    try {
      const response = await fetch(
        "https://sahil-e5321-default-rtdb.firebaseio.com/movies.json"
      );

      //fetch("https://swapi.dev/api/films/");
      // .then((response) => {
      //   return response.json();
      // })
      if (!response.ok) {
        throw new Error("Something went wrong!!!");
      }
      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMoviesUpdate(loadedMovies);
      // .then((data) => {
      //   setMoviesUpdate(data.results);
      // });
    } catch (error) {
      setShowError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    moviesDataHandler();
  }, [moviesDataHandler]);

  let content = <p> Found No Movies.</p>;

  if (!isLoading && moviesUpdate.length > 0) {
    content = <MoviesList movies={moviesUpdate} />;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (!isLoading && showError) {
    content = <p>{showError}</p>;
  }

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://sahil-e5321-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        <button onClick={moviesDataHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
