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

  //State API Token
  const [accessToken, setAccessToken] = useState("");
  // Spotiy User API States
  const [userName, setUserName] = useState("");
  const [userImageURL, setuserImageURL] = useState("");
  const [userID, setUserID] = useState("");
  const [login, setLogin] = useState(false);

  async function signIn() {
    await spotifyLogin();
    setLogin(true);
  }

  function signOut() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("verifier");

    setAccessToken(null);
    setUserName(null);
    setuserImageURL(null);
    setUserID(null);
    setLogin(false);
  }

  // Spotify API Login
  async function spotifyLogin(code) {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      setAccessToken(storedToken);
      const profile = await fetchProfile(storedToken);
      populateUI(profile);
      setLogin(true);
      return;
    }

    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await getAccessToken(clientId, code);
      const profile = await fetchProfile(accessToken);
      setLogin(true);
      populateUI(profile);
      console.log(profile);
    }

    async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      sessionStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "https://10.0.0.16:5173/callback");
      params.append(
        "scope",
        "user-read-private user-read-email playlist-modify-public playlist-modify-private"
      );
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
      const verifier = sessionStorage.getItem("verifier");

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
      localStorage.setItem("access_token", access_token);
      setAccessToken(access_token);
      console.log(access_token);
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
      setuserImageURL(profile.images[0].url);
      setUserID(profile.id);
    }
  }

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

  //Playlist Name State
  const [playlistName, setPlaylistName] = useState("");
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

    if (!playlistName) {
      alert("Please enter a playlist name");
    }
    if (trackPlaylistArr.length === 0) {
      alert("Add songs to your playlist");
    } else {
      //Remove 'spotify:user:' from User ID
      console.log("User ID:", userID);
      console.log("Playlist Name:", playlistName);
      console.log("Access Token:", accessToken);

      // User Playlist Creation API
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            description: "New Playlist from Jammming",
            public: false,
          }),
        }
      );
      const playlistData = await response.json();
      console.log(playlistData);
      console.log(playlistData.id);
      saveTracksToPlaylist();

      //Add Tracks to Playlist
      async function saveTracksToPlaylist() {
        const trackURIS = trackPlaylistArr.map((track) => track.uri);
        console.log(trackURIS);

        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: trackURIS,
              position: 0,
            }),
          }
        );
        const trackData = await response.json();
        console.log(trackData);

        //Remove Songs from Playlist Array
        if (response.ok) {
          setTrackPlaylistArr([]);
          alert(`'${playlistName}' has been added to your Spotify Account!`);
        }
      }
    }
  }

  //Run spotifyLogin at Page Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      spotifyLogin(code);
    }
  }, []);

  return (
    <>
      <header>
        <h1>
          Ja<em>mmm</em>ing
        </h1>
      </header>
      <User
        userName={userName}
        userImageURL={userImageURL}
        signIn={signIn}
        signOut={signOut}
        login={login}
      />
      <div>
        <div>
          <SearchBar
            songSearch={songSearch}
            setSongSearch={setSongSearch}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="mainDivContainer">
          <div className="mainDiv">
            <SearchResults
              songResults={songResults}
              handleSongAdd={handleSongAdd}
            />
            <Playlist
              setPlaylistName={setPlaylistName}
              trackPlaylistArr={trackPlaylistArr}
              removeTrack={removeTrack}
              savePlaylistToSpotify={savePlaylistToSpotify}
            />
          </div>
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default App;
