# SecondChance - Full-Stack Application

## Overview

SecondChance is a full-stack web application designed to connect users looking to give away unused items with those who need them. The application includes features for user authentication, item search, item management, and sentiment analysis.

---

## Project Structure

The repository is structured as follows:

- **Frontend**: A React application for the user interface.
- **Backend**: An Express.js server managing APIs for user authentication, item management, and search functionalities.
- **Sentiment Analysis**: A microservice for analyzing sentiment using natural language processing.

---

## Features

### Frontend

- Developed using React.js.
- Integrated with React Router for seamless navigation.
- Uses Context API for state management.
- Bootstrap for responsive and modern UI design.

### Backend

- Built with Express.js and Node.js.
- MongoDB for database storage.
- Implements routes for:
    - User authentication.
    - Managing items available for exchange.
    - Search functionality.

### Sentiment Analysis Microservice

- Uses `natural` library for NLP sentiment analysis.
- Processes and categorizes sentiments as positive, negative, or neutral.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- MongoDB
- npm (Node Package Manager)
- A `.env` file configured with the necessary environment variables:
    
    ```
    PORT=<backend_port>
    MONGO_URI=<mongo_connection_string>
    ```
    

### Installation

1. Clone the repository:
    
    ```
    git clone https://github.com/<your-repo>/backend-nodejs-capstone.git
    cd backend-nodejs-capstone
    ```
    
2. Navigate to the respective folders and install dependencies:
    - For the backend:
        
        ```
        cd secondChance-backend
        npm install
        ```
        
    - For the frontend:
        
        ```
        cd ../secondChance-frontend
        npm install
        ```
        
    - For the sentiment analysis service:
        
        ```
        cd ../sentiment
        npm install
        ```
        
3. Start the servers:
    - Backend:
        
        ```
        npm start
        ```
        
    - Frontend:
        
        ```
        npm start
        ```
        
    - Sentiment Analysis:
        
        ```
        npm start
        ```
        

### Usage

1. Open the frontend in a browser at http://localhost:3000.
2. Interact with the application by creating an account, browsing items, or adding new items.
3. Access the sentiment analysis service at `/sentiment` endpoint via a POST request with a `sentence` query parameter.

---

## Key Files

### Frontend

- **`src/App.js`**:
Configures routes and integrates global state using Context API.

### Backend

- **`app.js`**:
Main server file, sets up routes and database connection.

### Sentiment Analysis

- **`index.js`**:
Standalone service for sentiment analysis using the `natural` library.

---

## API Endpoints

### Backend

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth` | POST | Handles user authentication |
| `/api/secondchance/items` | GET/POST/PUT/DELETE | Manages item listings |
| `/api/secondchance/search` | GET | Searches for items based on criteria |

### Sentiment Analysis

| Endpoint | Method | Description |
| --- | --- | --- |
| `/sentiment` | POST | Analyzes sentiment of a given text |

---

## Technologies Used

### Frontend

- React.js
- Bootstrap
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Pino for logging

### Sentiment Analysis

- `natural` library for NLP
- `axios` for HTTP requests

---

## Contributors

- **Your Name**: Full-stack developer and project maintainer.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

Special thanks to all contributors and the open-source libraries used in this project.
