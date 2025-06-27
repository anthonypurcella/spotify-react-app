// components/SpotifyWebPlayer.jsx
import { useEffect, useRef, useState } from "react";

const SpotifyWebPlayer = ({ accessToken, currentURI, spotifyAccountType }) => {
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

  if (spotifyAccountType === "free") {
    return;
  } if (spotifyAccountType === "premium") {
    // Load SDK
    useEffect(() => {
      const scriptTagId = "spotify-sdk";

      if (!document.getElementById(scriptTagId)) {
        const script = document.createElement("script");
        script.id = scriptTagId;
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: "Jammming Web Player",
          getOAuthToken: (cb) => cb(accessToken),
          volume: 0.8,
        });

        playerRef.current = player;

        player.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          setPlayerReady(true);
          console.log("Player ready with device ID", device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Initialization Error:", message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("Authentication Error:", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("Account Error:", message);
        });

        player.connect();
      };
    }, [accessToken]);

    // Trigger playback when URI changes
    useEffect(() => {
      if (playerReady && deviceId && currentURI) {
        playTrack(currentURI);
      }

      async function playTrack(uri) {
        try {
          await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris: [uri] }),
            }
          );
        } catch (err) {
          console.error("Error starting playback:", err);
        }
      }
    }, [playerReady, deviceId, currentURI, accessToken]);

    return (
      <div>
        {playerReady ? (
          <div>✅ Web Player is ready.</div>
        ) : (
          <div>Loading Spotify Web Player...</div>
        )}
      </div>
    );
  }
};

export default SpotifyWebPlayer;
