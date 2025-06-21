import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

//Base URL of API
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/search";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

function App() {
  // Take user input in SearchBar and adds to SearchResults
  //Song search State
  const [songSearch, setSongSearch] = useState("");
  //Song results State
  const [songResults, setSongResults] = useState([]);

  //Submits what is in SearchBar to SearchResults
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Search for " + songSearch);

    // Search API request
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}?q=${songSearch}&type=track&limit=20&access_token=${accessToken}`
    );
    const data = await response.json();

    setSongResults(data);
      
    console.log(data);
  }

  //Track Playlist State
  const [trackPlaylistArr, setTrackPlaylistArr] = useState([]);
  //When button is clicked, adds Song Track to Playlist Array
  function handleSongAdd(song) {
    setTrackPlaylistArr([...trackPlaylistArr, song]);
  }

  //Remove Track from Playlist
  const removeTrack = (keyToRemove) => {
    setTrackPlaylistArr((prev) => prev.filter((track, index) => (track.uri + index) !== keyToRemove));
  };

  //State API Token
  const [accessToken, setAccessToken] = useState("");

  //Get API Token
  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  return (
    <>
      <header>
        <h1>Ja<em>mmm</em>ing</h1>
      </header>
      <div></div>
      <div>
        <SearchBar
          songSearch={songSearch}
          setSongSearch={setSongSearch}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className="mainDiv">
        <div>
          <SearchResults
            songResults={songResults}
            handleSongAdd={handleSongAdd}
          />
        </div>
        <div>
          <Playlist
            trackPlaylistArr={trackPlaylistArr}
            removeTrack={removeTrack}
          />
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default App;
