import React from "react";

const SearchBar = ({ songSearch, setSongSearch, handleSubmit }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Search for any song!"
            value={songSearch}
            onChange={(e) => setSongSearch(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default SearchBar;
