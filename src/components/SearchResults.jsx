import React from "react";
import Track from "./Track";


const SearchResults = ({ songResults, isActive, isPaused, currentURI, handleSongAdd, playToggle, spotifyAccountType}) => {

  

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
          <div className="resultsH1Container"><h1>Results</h1></div>
          <div className="tracksContainer">
            <ul>
              {songResults.tracks.items.map((item) => (
                <li key={item.uri}>
                  <Track
                    song={item.name}
                    isActive={item.uri === currentURI}
                    isPaused={isPaused}
                    artist={item.artists[0].name}
                    album={item.album.name}
                    uri={item.uri}
                    image={item.album.images[0].url}
                    spotifyAccountType={spotifyAccountType}
                    playToggle={() => playToggle(item.uri, item.name, item.artists[0].name, item.album.name, item.album.images[0].url)}
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



