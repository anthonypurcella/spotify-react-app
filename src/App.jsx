import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

function App() {

  // SearchBar useState and handleSubmit functionality
  const [songSearch, setSongSearch] = useState('');
  const [songResults, setSongResults] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSongResults([songSearch]);
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
        <SearchResults songResults={songResults}/>
      </div>
    </>
  );
}

export default App
