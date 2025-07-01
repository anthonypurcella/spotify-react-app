# Jammming - Spotify API Playlist Creation (Codecademy Project)

Jammming is a simple Spotify API Web App, built using React/Vite, to have a user create a playlist and add it to their own Spotify account.
User will login to their Spotify and then be able to search through Spotfiy's Track API and add songs to a playlist that can be added to their account.

*For this project to work, you will need to create an app with Spotify for Developers*

## Installation
1. Clone the repository: 
```bash
   git clone git@github.com:anthonypurcella/spotify-react-app.git
```
2. Install dependencies:
```bash
npm install
```
```bash
npm install react-spinners
```

3. Create App through Spotify for Developers
Once app is built there are three (3) things you will need
    - Client ID
    - Client Secret
    - Redirect URIs (Since this is a locally ran project, add the URL provided after running the *hosted network project run (provided below) with "/callback" appended at end*)

4. Create .env.local File
   - Add '.env.local' file to your the main project folder
   - Inside of '.env.local' add
     - VITE_SPOTIFY_CLIENT_ID = *your_spotify_client_id*
     - VITE_SPOTIFY_CLIENT_SECRET = *your_spotify_client_secret*
     - VITE_REDIRECT_URI = *your_redirect_uri*/callback    

## Usage
To run the project, use the following command:
```bash
npm run dev
```
To run on a hosted network:
```bash
npm run dev -- --host
```
In you browser, go to to the provided URL Address to view the project.

## Features
- Spotify Login/Sign Out (Uses Spotify's Code Verification API to Login to User's Account and genereate an ACCESS TOKEN - *Access Token will be used for all Spotify API Functionality*)
- Song Search Using Spotify Track API
- Display Results (20) With Ability To Add to Playlist
- Playlist Naming, Song Removal & Save to Spotify
- Play Song From Spotify (Premium Account Required)

## License
This project is licensed under the [MIT License](LICENSE).

### Documentation
Spotify for Developers (Getting Started - *Create an app*) - https://developer.spotify.com/documentation/web-api/tutorials/getting-started
User Profile API - https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
Search API - https://developer.spotify.com/documentation/web-api/reference/search
Track API - https://developer.spotify.com/documentation/web-api/reference/get-track
Add Playlist API - https://developer.spotify.com/documentation/web-api/reference/create-playlist
