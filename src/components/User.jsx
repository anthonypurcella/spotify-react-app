import React from "react";

function User({ userImageURL, signIn, signOut, login }) {
  if (login === false) {
    return (
      <>
        <div className="signInUser">
          <button onClick={signIn}>Sign In</button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="spotifyUser">
          <img src={userImageURL} className="profileImage"/>
          <button onClick={signOut}>Sign Out</button>
        </div>
        <div></div>
      </>
    );
  }
}

export default User;
