import React from "react";
import Track from "./Track";


const SearchResults = ({ songResults, handleSongAdd}) => {

  if (songResults.length < 1) {
    return (
      <div className="resultsDiv">
        <h1>Results</h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="resultsDiv">
          <h1>Results</h1>
          <div>
            <ul>
              {songResults.tracks.items.map((item) => (
                <li key={item.uri}>
                  <Track
                    song={item.name}
                    artist={item.artists[0].name}
                    album={item.album.name}
                    uri={item.uri}
                    image={item.album.images[0].url}
                    onAction={() => handleSongAdd(item)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
};

export default SearchResults;



