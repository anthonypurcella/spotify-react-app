import React from "react";
import Track from "./Track";

const playlistNameStyle = {
  border: "none",
  background: "transparent",
  outline: 0,
  fontSize: 48,
};

const Playlist = ({ trackPlaylistArr, removeTrack }) => {

  return (
    <>
      <div className="playlistDiv">
        <div className="playlistInput">
          <input
            style={playlistNameStyle}
            id="playlistname"
            type="text"
            placeholder="Playlist Name"
          />
        </div>
        <div>
          <ul>
            {trackPlaylistArr.map((item) => (
              <li key={item.uri}>
                <Track
                  song={item.name}
                  artist={item.artists[0].name}
                  uri={item.uri}
                  image={item.album.images[0].url}
                  onAction={() => removeTrack(item.uri)}
                  buttonLabel="x"
                />
              </li>
            ))}
          </ul>
        </div>
        <button className="spotifySaveButton">SAVE TO SPOTIFY</button>
      </div>
    </>
  );
};

export default Playlist;
