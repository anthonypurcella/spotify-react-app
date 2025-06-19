import React from 'react';

const playlistNameStyle = {
    border: "none",
    background: "transparent",
    outline: 0,
    fontSize: 48,
}

const Playlist = ({trackPlaylistArr}) => {
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
            {trackPlaylistArr}
        </div>
      </>
    );

}

export default Playlist;