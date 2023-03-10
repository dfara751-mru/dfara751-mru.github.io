import logo from "./logo.svg";
import "./App.css";
import * as cloneDeep from "lodash/cloneDeep";
import Home from "./components/Home.js";
import BrowseMovies from "./components/BrowseMovies";
import Detail from "./components/Detail";
import React, { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";

function App() {
  const [moviesData, setMoviesData] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [spinner, setSpinner] = React.useState(false);
  let ratings = []; // array for storing user ratings on movies (saves an object as {id: movie id, amount: no of stars given})

  const saveFavorites = function (movie) {
    if (
      favorites.findIndex(
        (currentFavMovie) => currentFavMovie.id === movie.id
      ) < 0
    ) {
      let newFavorites = favorites;
      const favMovie = cloneDeep(movie);
      setFavorites([...favorites, movie]); // adds movie to favorites list.
    } else {
      console.log("The movie is already in Favorites!");
    }
  };

  const removeFavorite = function (movie) {
    if (
      favorites.findIndex(
        (currentFavMovie) => currentFavMovie.id === movie.id
      ) >= 0
    ) {
      let index = favorites.findIndex(
        (currentFavMovie) => currentFavMovie.id === movie.id
      );
      let tempFavs = cloneDeep(favorites);
      tempFavs.splice(index, 1);
      setFavorites(tempFavs); // adds movie to favorites list.
      console.log(favorites);
    } else {
      console.log("The movie was not in favorites");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // check if movies is already full.
        if (moviesData.length <= 0) {
          if (localStorage.getItem("movies") === null) {
            console.log("fetch from URL");
            const url =
              "https://www.randyconnolly.com/funwebdev/3rd/api/movie/movies-brief.php?limit=200";
            setSpinner(true);
            const response = await fetch(url);
            const data = await response.json();
            initiateTitleSort(data);
            localStorage.setItem("movies", JSON.stringify(data));
            setSpinner(false);
          } else {
            // get data from storage.
            const rawData = localStorage.getItem("movies");
            if (rawData) {
              const data = JSON.parse(rawData);
              // console.log(data)
              initiateTitleSort(data);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };


    const initiateTitleSort = (movies) => {
      let newMovies = movies.sort(function (a, b) {
        if (a.title < b.title) return -1;
        else if (a.title > b.title) return 1;
        else return 0;
      });
      setMoviesData(newMovies);
    };

    // invoke the async function

    getData();
  }, []);

  
  // style={{backgroundImage: 'url(https://unsplash.com/photos/nLl5sJnElxY)'}}
  return (
    <Routes>
      <Route path="/build/" exact element= {<Home spinner={spinner} />} />
      <Route path="/build/home" exact element= {<Home spinner={spinner} />} />
      <Route
        path="/build/detail"
        exact
        element={
          <Detail
            favorites={favorites}
            saveFavorites={saveFavorites}
            ratings={ratings}
            removeFavorite={removeFavorite}
          />
        }
      />
      <Route
        path="/build/browse"
        exact
        element={
          <BrowseMovies
            moviesData={moviesData}
            favorites={favorites}
            saveFavorites={saveFavorites}
            setFavorites={setFavorites}
            removeFavorite={removeFavorite}
          />
        }
      />
    </Routes>
  );
}

export default App;
