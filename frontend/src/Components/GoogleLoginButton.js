import jwt from "jsonwebtoken";
import React, { useEffect } from "react";

const GoogleLoginComponent = (props) => {
  // This function will be triggered once the user is signed in
  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log("ID Token: ", idToken);

    // Decode the ID Token to extract user info
    const decodedToken = jwt.decode(idToken);
    console.log("Decoded Token:", decodedToken);

    // You can now access the user's details
    const userInfo = {
      name: decodedToken.name,
      userId: decodedToken.email,
      profilePicURL: decodedToken.picture,
      accessToken: idToken,
    };
    props.auth(userInfo);
    // You can send this token to your server for verification
  };

  useEffect(() => {
    // Initialize the Google Identity Services (GIS)
    window &&
      window.google &&
      window.google.accounts &&
      window.google.accounts.id.initialize({
        client_id: "clientID", // Replace with your actual Google Client ID
        callback: handleCredentialResponse,
      });

    // Render the Google sign-in button
    window &&
      window.google &&
      window.google.accounts &&
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" } // Button theme and size options
      );
  }, []);

  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleLoginComponent;
