import React from 'react';

 function Track({song, artist, image, album, onAction, buttonLabel = '+'}) {
    return (
      <div>
        <div className="divTrackStyle">
          <img src={image} className="trackDivStyle" />
          <div className="trackDivStyle">
            <div className="songStyle">{song}</div>
            <div className="artistStyle">{artist} - {album}</div>
          </div>
          <button className="buttonStyle" onClick={onAction}>
            {buttonLabel}
          </button>
        </div>
      </div>
    );
 }

 export default Track;