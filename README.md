# Authentication and Authorization Microservice

This microservice is designed for user authentication and authorization using Node.js, JWT (JSON Web Tokens), and MongoDB. It supports access and refresh tokens, as well as token rotation to enhance security.

## Features

- **User Registration**: Allows users to register with their credentials.
- **User Login**: Enables users to log in and receive access and refresh tokens.
- **Access Tokens**: Short-lived tokens for authorizing requests to protected resources.
- **Refresh Tokens**: Longer-lived tokens used to obtain new access tokens without re-authentication.
- **Token Rotation**: Automatically invalidates old refresh tokens when a new one is issued, enhancing security.
- **Centralized Token Validation**: An endpoint that allows other services to validate access tokens issued by this microservice.
