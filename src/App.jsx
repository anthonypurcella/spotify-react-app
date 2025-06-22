import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import User from "./components/User";

//Base URL of API
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/search";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

function App() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Replace with your client ID
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  async function spotifyLogin() {
    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await getAccessToken(clientId, code);
      const profile = await fetchProfile(accessToken);

      populateUI(profile);
      console.log(profile);
    }

    async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      localStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "https://10.0.0.16:5173/callback");
      params.append("scope", "user-read-private user-read-email");
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);

      document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    function generateCodeVerifier(length) {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    async function generateCodeChallenge(codeVerifier) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    async function getAccessToken(clientId, code) {
      const verifier = localStorage.getItem("verifier");

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "https://10.0.0.16:5173/callback");
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const { access_token } = await result.json();
      return access_token;
    }

    async function fetchProfile(token) {
      const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      return await result.json();
    }
    async function populateUI(profile) {
      setUserName(profile.display_name);
      setUserEmail(profile.email);
      setuserImageURL(profile.images[0].url);
    }
  }

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImageURL, setuserImageURL] = useState("");

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
    setTrackPlaylistArr((prev) =>
      prev.filter((track, index) => track.uri + index !== keyToRemove)
    );
  };

  // Save Playlist to Spotify
  async function savePlaylistToSpotify(e) {
    e.preventDefault();
    alert("Button Works");

    //Send USER ID API Request
    const response = await fetch(``);

    const data = await response.json();

    console.log(data);
  }
  //State API Token
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    spotifyLogin();
  }, []);

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
        <h1>
          Ja<em>mmm</em>ing
        </h1>
      </header>
        <User userName={userName} userImageURL={userImageURL} />
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
            savePlaylistToSpotify={savePlaylistToSpotify}
          />
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default App;
