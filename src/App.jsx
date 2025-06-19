import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

function App() {

  // Take user input in SearchBar and adds to SearchResults
  //Song search State 
  const [songSearch, setSongSearch] = useState('');
  //Song results State
  const [songResults, setSongResults] = useState([]);
//Submits what is in SearchBar to SearchResults
  const handleSubmit = (e) => {
    e.preventDefault();
    setSongResults([songSearch]);
  }

  //Track Playlist State
  const [trackPlaylistArr, setTrackPlaylistArr] = useState([]);
  //When button is clicked, adds Song Track to Playlist Array
 function handleSongAdd() {
  setTrackPlaylistArr([...trackPlaylistArr, songResults]);
 }
 
 //Remove Track from Playlist
 const removeTrack = (index) =>{
  const items = trackPlaylistArr;
  const updatedTracklist = items.filter((item, i) => i !== index);
  setTrackPlaylistArr(updatedTracklist);
 }

  return (
    <>
      <header>JAMMING</header>
      <div>
        <SearchBar
          songSearch={songSearch}
          setSongSearch={setSongSearch}
          handleSubmit={handleSubmit}
        />
      </div>
      <div>
        <SearchResults songResults={songResults} handleSongAdd={handleSongAdd}/>
      </div>
      <div>
        <Playlist trackPlaylistArr={trackPlaylistArr} removeTrack={removeTrack}/>
      </div>
      
    </>
  );
}

export default App
