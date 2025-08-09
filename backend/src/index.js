const app = require('./app');

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// Start the server and listen on the specified port
// This file is the entry point for the backend server
// It imports the app from app.js and starts the server
// The server listens on the port defined in the environment variable or defaults to 5050
// This allows for easy testing and modularity in the code structure
// The app is exported for use in testing or other modules
// The server logs a message indicating it is running and the URL to access it
// This setup allows for a clean separation of concerns in the codebase
// and makes it easier to manage routes and middleware in the app.js file.  