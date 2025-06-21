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

    setSongResults([
      data.tracks.items[0].name,
      data.tracks.items[1].name,
      data.tracks.items[2].name,
      data.tracks.items[3].name,
      data.tracks.items[4].name,
      data.tracks.items[5].name,
      data.tracks.items[6].name,
      data.tracks.items[7].name,
      data.tracks.items[8].name,
      data.tracks.items[9].name,
      data.tracks.items[10].name,
      data.tracks.items[11].name,
      data.tracks.items[12].name,
      data.tracks.items[13].name,
      data.tracks.items[14].name,
      data.tracks.items[15].name,
      data.tracks.items[16].name,
      data.tracks.items[17].name,
      data.tracks.items[18].name,
      data.tracks.items[19].name,
    ]);

    console.log(data.tracks.items);
  }

  //Track Playlist State
  const [trackPlaylistArr, setTrackPlaylistArr] = useState([]);
  //When button is clicked, adds Song Track to Playlist Array
  function handleSongAdd(song) {
    setTrackPlaylistArr([...trackPlaylistArr, song]);
  }

  //Remove Track from Playlist
  const removeTrack = (index) => {
    const items = trackPlaylistArr;
    const updatedTracklist = items.filter((item, i) => i !== index);
    setTrackPlaylistArr(updatedTracklist);
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
      <header>JAMMING</header>
      <div ></div>
      <div>
        <SearchBar
          songSearch={songSearch}
          setSongSearch={setSongSearch}
          handleSubmit={handleSubmit}
        />
      </div>
      <div style={{ display: "flex" }}>
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
    </>
  );
}

export default App;
