import React from "react";
import Track from "./Track";


const Playlist = ({ setPlaylistName ,trackPlaylistArr, removeTrack, savePlaylistToSpotify }) => {

  return (
    <>
      <div className="playlistDiv">
        <div className="inputDiv">
          <input
            className="playlistInput"
            id="playlistname"
            type="text"
            placeholder="Playlist Name"
            onChange={(e) => {
              setPlaylistName(e.target.value)
            }}
          />
        </div>
        <div>
          <ul>
            {trackPlaylistArr.map((item, index) => (
              <li key={item.uri + index}>
                <Track
                  song={item.name}
                  artist={item.artists[0].name}
                  album={item.album.name}
                  uri={item.uri}
                  image={item.album.images[0].url}
                  onAction={() => removeTrack(item.uri + index)}
                  buttonLabel="x"
                />
              </li>
            ))}
          </ul>
        </div>
        <button className="spotifySaveButton" onClick={savePlaylistToSpotify}>Save To Spotify</button>
      </div>
    </>
  );
};

export default Playlist;
