import React from "react";

const playlistNameStyle = {
  border: "none",
  background: "transparent",
  outline: 0,
  fontSize: 48,
};

const Playlist = ({ trackPlaylistArr, removeTrack }) => {

  return (
    <>
      <div>
        <input
          style={playlistNameStyle}
          id="playlistname"
          type="text"
          placeholder="Playlist Name"
        />
      </div>
      <div>
        <ul>
          {trackPlaylistArr.map((track, index) => (
            <div>
              <li key={index}>
                {track}
                <button onClick={() => removeTrack(index)}>x</button>
              </li>
            </div>
          ))}
        </ul>
      </div>
      <button>SAVE TO SPOTIFY</button>
    </>
  );
};

export default Playlist;
