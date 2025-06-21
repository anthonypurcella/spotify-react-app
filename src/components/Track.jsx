import React from 'react';

 function Track({song, artist, image, onAction, buttonLabel = '+'}) {
    return (
      <div>
        <div className="divTrackStyle">
          <img src={image} className="trackDivStyle" />
          <div className="trackDivStyle">
            <div className="trackTitleStyle divTrackTextStyle">{song}</div>
            <div className="divTrackTextStyle artistStyle">{artist}</div>
          </div>
          <button className="buttonStyle" onClick={onAction}>
            {buttonLabel}
          </button>
        </div>
      </div>
    );
 }

 export default Track;