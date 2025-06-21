import React from "react";
import Track from "./Track";


const SearchResults = ({ songResults, handleSongAdd}) => {

  if (songResults.length < 1) {
    return (
      <div>
        <h1>Results</h1>
      </div>
    );
  } else {
    return (
      <>
        <div>
          <h1>Results</h1>
          <div>
            <ul>
              {songResults.map((song) => (
                <Track key={song.id} song={song} onAdd={() => handleSongAdd(song)}/>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
};

export default SearchResults;
