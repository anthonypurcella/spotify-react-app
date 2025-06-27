import React, { useState } from "react";

function Track({
  song,
  isActive,
  isPaused,
  artist,
  image,
  album,
  spotifyAccountType,
  playToggle,
  onAction,
  buttonLabel = "+",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (isActive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderPlayButtonIcon = () => {
    // NOT ACTIVE TRACK — show default play icon
    if (!isActive) {
      return <img src="/start.png" className="playIcon" alt="play icon" />;
    }

    // ACTIVE AND PLAYING
    if (isActive && !isPaused) {
      return isHovered ? (
        <img src="/pause.png" className="playIcon" alt="pause icon" />
      ) : (
        <img src="/playing.gif" className="playIcon" alt="playing animation" />
      );
    }

    // ACTIVE AND PAUSED
    if (isActive && isPaused) {
      return isHovered ? (
        <img src="/start.png" className="playIcon" alt="play icon" />
      ) : (
        <img src="/pause.png" className="playIcon" alt="pause icon" />
      );
    }

    return null;
  };

  return (
    <div>
      <div className="divTrackStyle">
        <img src={image} className="trackDivStyle smallImage" />
        <div className="trackDivStyle">
          <div className="songStyle">{song}</div>
          <div className="artistStyle">
            {artist} - {album}
          </div>
        </div>
        <div className="buttonContainer">
          <button
            className="buttonStyle"
            onClick={playToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {spotifyAccountType === "premium" ? renderPlayButtonIcon() : null}
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
