import React from "react";


const SearchResults = ({ songResults, handleSongAdd}) => {

  if (songResults.length < 1) {
    return <div></div>;
  } else {
    return (
      <>
        <div>
          <h1>Results</h1>
          <div>
            {songResults}
            <button onClick={handleSongAdd}>+</button>
          </div>
        </div>
      </>
    );
  }
};

export default SearchResults;
