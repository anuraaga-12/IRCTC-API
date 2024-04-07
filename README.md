# Train System Application

This is a Node.js application for managing a train system. It provides functionalities for user authentication, signing up, logging in, adding trains, checking seat availability, booking seats, and fetching booking details.

## Prerequisites

- Node.js installed on your machine
- MySQL server running locally

## Installation

1. Clone the repository to your local machine:



2. Navigate to the project directory:



3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up your MySQL database:
   
   - Run the MySQL server.
   - Execute the provided SQL commands in your MySQL database to create the necessary tables. You can find the SQL commands in the comments at the end of `app.js` file.

5. Configure the MySQL connection:
   
   - Open `app.js` file.
   - Update the MySQL connection parameters (host, user, password, database) according to your MySQL setup.

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. The server will start running on port 3000 by default.

3. You can access the endpoints using a tool like Postman or by sending HTTP requests programmatically.

## Endpoints

- **GET /:** Welcome message indicating the successful running of the server.
- **POST /signup:** Endpoint for user signup. Requires `username`, `password`, and `isAdmin` (boolean) fields in the request body.
- **POST /login:** Endpoint for user login. Requires `username` and `password` fields in the request body.
- **POST /trains:** Endpoint for adding a new train. Requires `source`, `destination`, and `userId` fields in the request body.
- **GET /trains:** Endpoint for retrieving available trains based on `source` and `destination` query parameters.
- **POST /book:** Endpoint for booking a seat on a train. Requires `userId` and `trainId` fields in the request body.
- **GET /bookings/:userId:** Endpoint for fetching booking details for a specific user identified by `userId` parameter.

## Middleware

- **authenticateUser:** Middleware function to ensure user authentication for protected routes. It checks if a valid `userId` is present in the request body.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.

## Tests

Tests are not included in this version of the application. However, you can write your own tests using testing frameworks like Mocha and Chai. Feel free to contribute tests if you find it necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
