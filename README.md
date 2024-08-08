# Simple REST API Backend with Express.js

This project is a simple backend application built with Node.js and Express.js. It demonstrates the basics of creating a RESTful API, including handling CRUD (Create, Read, Update, Delete) operations. The primary goal of this project is to help learners understand the fundamentals of REST API development.

## Features

- REST API for managing user data
- JSON Data Handling using a static JSON file (`MOCK_DATA.json`)
- Environment Configuration using `dotenv`

## Requirements

To get started with this project:

```
npm init
npm install express dotenv
```

## REST API Endpoints

### Home Page
- GET /users
- Returns a list of all users in HTML format.

### Create a New User
- POST /api/users
- Creates a new user.
### Read a User by ID
- GET /api/users/:id
- Returns the user details for the given id.

### Update a User by ID
- PATCH /api/users/:id
- Updates the user details for the given id.

### Delete a User by ID
- DELETE /api/users/:id
- Deletes the user with the given id.
