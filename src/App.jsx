import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'

function App() {

  // SearchBar useState and handleSubmit functionality
  const [songSearch, setSongSearch] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${songSearch} has been added!`);
  }

  return (
    <>
      <header>JAMMING</header>
      <div>
        <SearchBar songSearch={songSearch} setSongSearch={setSongSearch} handleSubmit={handleSubmit}/>
      </div>
    </>
  )
}

export default App
