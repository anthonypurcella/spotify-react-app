import React from 'react';

 function Track({song, onAdd}) {
    return (
      <div>
        {song}
        <button onClick={onAdd}>+</button>
      </div>
    );
 }

 export default Track;