To run this app in local environment

For client (React App)

navigate to /frontend/src/Containers/Login.js
then at <FacebookLogin /> component replace appId props with you facebook appId
you can create one from visiting https://developer.facebook.com

go to the frontend directory and open terminal then add these commands to run
npm install
npm start

For server (Node App)

navigate to /backend/app.js
at mongoose.connect() function pass your own mongodb connection string

go to the backend directory and open terminal then add these commands to run
npm install
node app.js
For nodemon package use nodemon start


