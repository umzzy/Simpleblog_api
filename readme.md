# Blog Restful API

## Description

A RESTful API for a blog application built with Node.js, Express, and MongoDB. This API provides endpoints for user authentication, category management, post creation, file uploads, and more.

## Features

-   **User Authentication**: Register, login, and JWT-based authorization
-   **Category Management**: Create, read, update, and delete blog categories
-   **Post Management**: Create, read, update, and delete blog posts
-   **File Uploads**: Upload files with support for AWS S3 storage
-   **Email Notifications**: Send emails using Nodemailer
-   **Error Handling**: Comprehensive error handling middleware
-   **Validation**: Input validation using Express Validator

## Installation

1. Clone the repository:

    ```
    git clone <repository-url>
    cd blog-restful-api
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the root directory
    - Add necessary configuration keys (refer to [config/keys.js](config/keys.js) for required keys)

4. Start the server:
    ```
    npm start
    ```

The server will run on the port specified in [config/keys.js](config/keys.js).

## Usage

### API Endpoints

-   **Authentication** (`/api/v1/auth`):

    -   `POST /register` - Register a new user
    -   `POST /login` - Login user

-   **Categories** (`/api/v1/category`):

    -   `GET /` - Get all categories
    -   `POST /` - Create a new category (Admin only)
    -   `PUT /:id` - Update a category (Admin only)
    -   `DELETE /:id` - Delete a category (Admin only)

-   **Posts** (`/api/v1/post`):

    -   `GET /` - Get all posts
    -   `POST /` - Create a new post
    -   `PUT /:id` - Update a post
    -   `DELETE /:id` - Delete a post

-   **Files** (`/api/v1/file`):
    -   `POST /upload` - Upload a file

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "example", "email": "user@example.com", "password": "password"}'
```

## Project Structure

```
blog-restful-api/
├── app.js                 # Main application setup
├── index.js               # Server entry point
├── config/                # Configuration files
├── controller/            # Route controllers
├── models/                # MongoDB models
├── routes/                # API routes
├── middlewares/           # Custom middlewares
├── utils/                 # Utility functions
├── validators/            # Input validation
├── uploads/               # Uploaded files directory
└── api-collection/        # API collection files
```

## Technologies Used

-   **Node.js**: JavaScript runtime
-   **Express.js**: Web framework
-   **MongoDB**: NoSQL database
-   **Mongoose**: MongoDB object modeling
-   **JWT**: JSON Web Tokens for authentication
-   **AWS S3**: File storage
-   **Nodemailer**: Email sending
-   **Multer**: File upload handling
-   **Express Validator**: Input validation
-   **Morgan**: HTTP request logger

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a new Pull Request

## License

This project is licensed under the ISC License.

## Made with ❤️ by umzzy
