import React from 'react';

 function Track({song, artist, image, album, spotifyAccountType, playSong, onAction, buttonLabel = '+'}) {
    return (
      <div>
        <div className="divTrackStyle">
          <img src={image} className="trackDivStyle" />
          <div className="trackDivStyle">
            <div className="songStyle">{song}</div>
            <div className="artistStyle">
              {artist} - {album}
            </div>
          </div>
          <div className='buttonContainer'>
            <button className="buttonStyle" onClick={playSong}>
              {(spotifyAccountType === "premium") ? <img src="public/start-png-44878.png" className="playIcon" /> : <></>}
            </button>
            <button className="buttonStyle" onClick={onAction}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
 }

 export default Track;