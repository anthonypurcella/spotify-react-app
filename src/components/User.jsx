import React from "react";

function User({ userName, userImageURL }) {
  return (
    <>
      <div className="spotifyUser">
        <img src={userImageURL} className="profileImage" />
      </div>
    </>
  );
}

export default User;
