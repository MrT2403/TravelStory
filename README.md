# Travel Story Application

Travel Story is a straightforward program that makes it easy and intuitive for users to save and manage their travelogues. Users may easily evaluate particular excursions by searching and filtering by date, as well as adding, editing, and deleting travel tales. trip Story is a handy way to store and share trip experiences because to its user-friendly interface and intuitive design.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Version Requirements](#version-requirements)
- [Environment Variables](#environment-variables)
- [Installation and Running the Application](#installation-and-running-the-application)
- [Run Client](#run-client)
- [Run Server](#run-server)
- [Database Setup](#database-setup)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Deploying the Application](#deploying-the-application)
- [Connecting Frontend and Backend](#connecting-frontend-and-backend)
- [Contact Information](#contact-information)

## Tech Stack

- **Frontend**: ReactJS, React Router, React Context API, TailwindCSS for styling
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Features

- **Create Travel Stories**: Allows users to create new travel stories with details like title, description, date, location, and images.
- **View and Edit Stories**: Users can view detailed stories and edit them as needed.
- **Delete Stories**: Allows users to delete stories they no longer wish to keep.
- **Favorite Stories**: Users can mark stories as favorites for easy access.
- **Search and Filter by Date Range**: Provides a search function and date filtering for finding specific stories.
- **User Authentication**: Secures access to user data with authentication.
- **Responsive Design**: The app is responsive for both desktop and mobile devices.

## Version Requirements

- **Node.js**: v16.14.0 or later
- **MongoDB**: v4.4.2 or later
- **Git**: Version 2.41.0 or later

## Environment Variables

Create a `.env` file in the root of your server directory with the following variables:

MONGODB_URL=<your-mongodb-url>
PORT=<your-server-port>
JWT_SECRET=<your-jwt-secret>

## Installation and Running the Application

Clone the repository and follow the instructions below to set up the project:

cd frontend
npm install
npm start

cd backend
npm install
npm start

## Database Setup

Use MongoDB Atlas to manage your database. You can import your initial data or create collections manually. To import data from an existing database dump, use the following command:

mongorestore --db <database_name> dump/travelstorydata
Replace <database_name> with your desired database name.

## MongoDB Atlas Setup

Create an Account: Sign up on MongoDB Atlas and create a new project.
Create a Cluster: Configure your cluster and obtain the connection string.
Set Up Collections: Import your database or create collections manually.

## Deploying the Application

Push Code to GitHub: Ensure your client and server code is hosted on GitHub.
Deploy Backend: Use platforms like Render or Heroku to deploy your backend.
Deploy Frontend: Use platforms like Vercel or Netlify to deploy the frontend.

## Connecting Frontend and Backend

Update your environment variables to point the frontend to the deployed backend API. Ensure both frontend and backend URLs are correctly set in the deployment settings.

## Contact Information

Name: Nguyễn Minh Trí
Email: minhtri240301@gmail.com
