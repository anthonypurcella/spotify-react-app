import { use, useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import User from "./components/User";
import { ClipLoader } from "react-spinners";

//Base URL of API
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/search";

function App() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectURI = import.meta.env.VITE_REDIRECT_URI;

  //State API Token
  const [accessToken, setAccessToken] = useState("");
  // Spotiy User API States
  const [userName, setUserName] = useState("");
  const [userImageURL, setuserImageURL] = useState("");
  const [userID, setUserID] = useState("");
  const [login, setLogin] = useState(false);
  const [spotifyAccountType, setSpotifyAccountType] = useState("free");

  async function signIn() {
    await spotifyLogin();
    setLogin(true);
  }

  function signOut() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("verifier");

    if (player) {
      player.disconnect();
    }

    setPlayer(undefined);
    setDeviceId(null);
    setAccessToken("");
    setUserName("");
    setuserImageURL("");
    setUserID("");
    setLogin(false);
    setSpotifyAccountType("free");
  }

  // Spotify API Login
  async function spotifyLogin(code) {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      setAccessToken(storedToken);
      initializeSpotifySDK(storedToken);
      const profile = await fetchProfile(storedToken);
      populateUI(profile);
      setLogin(true);
      setSpotifyAccountType(profile.product);
      return;
    }

    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await getAccessToken(clientId, code);
      const profile = await fetchProfile(accessToken);
      setLogin(true);
      initializeSpotifySDK(accessToken);
      populateUI(profile);
      setSpotifyAccountType(profile.product);
      console.log(profile);
    }

    async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      sessionStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", redirectURI);
      params.append(
        "scope",
        "user-read-private user-read-email playlist-modify-public playlist-modify-private streaming user-modify-playback-state user-read-playback-state"
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
      params.append("redirect_uri", redirectURI);
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const { access_token, expires_in } = await result.json();
      const expiryTime = new Date().getTime() + expires_in * 1000;
      localStorage.setItem("access_token", access_token);
      sessionStorage.setItem("access_token_expiry", expiryTime);
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
  // Loading State
  const [resultsLoading, setResultsLoading] = useState(false);
  //Submits what is in SearchBar to SearchResults
  async function handleSubmit(e) {
    e.preventDefault();
    if (!login) {
      alert("Please sign in to your Spotify Acoount");
    } else {
      setResultsLoading(true);
      console.log("Search for " + songSearch);
      // Search API request
      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}?q=${songSearch}&type=track&limit=20&access_token=${accessToken}`
      );
      if (response.ok) {
        const data = await response.json();
        setResultsLoading(false);
        setSongResults(data);
        console.log(data);
      } else if (!response.ok) {
        alert("Uh oh! Something went wrong ):\nTry signing in again.");
      }
    }
  }

  //Current Song State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentURI, setCurrentURI] = useState("");

  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(null);
  async function playToggle(songURI, song, artist, album, image, accessToken) {
    if (!deviceId) {
      alert("Spotify Player not initialized yet.");
      return;
    }

    // Toggle pause/resume if the same track
    if (songURI === currentURI) {
      if (isPaused) {
        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_id: deviceId }),
        });
      } else {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      setIsPaused((prev) => !prev);
      return;
    }

    // Play new track
    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [songURI],
        }),
      }
    );

    // Update state
    setIsActive(true);
    setIsPaused(false);
    setCurrentURI(songURI);
  }
  function initializeSpotifySDK(token) {
    if (player || !token) return;

    console.log("Adding SDK script...");
    const existing = document.getElementById("spotify-sdk");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "spotify-sdk";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new Spotify.Player({
        name: "Jammming Web Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      newPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setPlayer(newPlayer);
        setDeviceId(device_id);
      });

      newPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      newPlayer.connect();
    };
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

  // Loading State
  const [playlistLoading, setPlaylistLoading] = useState(false);
  // Save Playlist to Spotify
  async function savePlaylistToSpotify(e) {
    e.preventDefault();

    if (!playlistName) {
      alert("Please enter a playlist name");
    } else if (trackPlaylistArr.length === 0) {
      alert("Add songs to your playlist");
    } else if (!login) {
      alert("Please sign in to your Spotify Acoount");
    } else {
      setPlaylistLoading(true);
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
        setPlaylistLoading(false);
        //Remove Songs from Playlist Array
        if (response.ok) {
          setTrackPlaylistArr([]);
          alert(`'${playlistName}' has been added to your Spotify Account!`);
        }
        if (!response.ok) {
          alert("Something went wrong - please try again!");
        }
      }
    }
  }

  //Run spotifyLogin at Page Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    spotifyLogin(code);
  }, []);
  // Check Token Expire
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiryTime = localStorage.getItem("access_token_expiry");
      if (expiryTime && new Date().getTime() > expiryTime) {
        console.log("Access token expired. Logging in again...");
        spotifyLogin();
      }
    };

    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); // check every 5 mins
    return () => clearInterval(interval);
  }, []);
  // Load Spotify Device Play Once Access Token
  useEffect(() => {
    if (!accessToken || player) return;
    initializeSpotifySDK(accessToken);
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
      <div className="bodyContainer">
        <div className="searchContainer">
          <SearchBar
            songSearch={songSearch}
            setSongSearch={setSongSearch}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="mainDivContainer">
          <div className="resultsWithLoader">
            {resultsLoading ? (
              <ClipLoader
                className="loader"
                size={100}
                color="rgba(30, 215, 96, 100)"
              />
            ) : (
              <></>
            )}
            <SearchResults
              songResults={songResults}
              isPaused={isPaused}
              currentURI={currentURI}
              playToggle={playToggle}
              handleSongAdd={handleSongAdd}
              spotifyAccountType={spotifyAccountType}
              accessToken={accessToken}
            />
          </div>
          <div className="playlistWithLoader">
            {playlistLoading ? (
              <ClipLoader
                className="loader"
                size={100}
                color="rgba(30, 215, 96, 100)"
              />
            ) : (
              <></>
            )}
            <Playlist
              setPlaylistName={setPlaylistName}
              trackPlaylistArr={trackPlaylistArr}
              removeTrack={removeTrack}
              savePlaylistToSpotify={savePlaylistToSpotify}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
