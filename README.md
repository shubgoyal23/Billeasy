# BillEasy

A Node.js/Express.js application for managing books and reviews with user authentication.

## Features

- User authentication with JWT tokens
- Book management (CRUD operations)
- Review system for books
- RESTful API architecture
- TypeScript support
- MongoDB database with Mongoose ODM

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Development**: tsx, nodemon for hot reloading

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd billeasy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DBNAME=billeasy
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## How to Run Locally

### Development Mode (with hot reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Documentation

The easiest way to test and explore the API is using the provided Postman collection. All endpoints are pre-configured with example requests and proper data formats.

### Using the Postman Collection

1. **Import the Collection**
   - Open Postman
   - Click "Import" button
   - Select the `postman_collection.json` file from the project root
   - The collection will be imported with all endpoints organized in folders

2. **Set Up Environment Variables**
   Create a new environment in Postman with the following variable:
   - `baseUrl`: `http://localhost:3000` (or your server URL)

3. **Authentication Flow**
   - Use the "signup" request to create a new user account
   - Use the "login" request to authenticate and receive tokens
   - Tokens are typically stored in cookies for subsequent requests

### API Endpoints Overview

#### User Management (`/api/v1/users/`)
- **POST** `/signup` - Register a new user
- **POST** `/login` - User authentication
- **GET** `/current` - Get current user details
- **GET** `/renew` - Refresh authentication tokens
- **GET** `/logout` - User logout

#### Book Management (`/api/v1/books/`)
- **POST** `/` - Create a new book (authenticated)
- **GET** `/` - Get list of all books
- **GET** `/:id` - Get specific book by ID
- **PATCH** `/` - Update book details (authenticated)
- **DELETE** `/` - Delete a book (authenticated)
- **GET** `/search?q=query` - Search books by title/author

#### Review Management (`/api/v1/reviews/`)
- **GET** `/?id=bookId&page=1&limit=10` - Get reviews for a book (paginated)
- **POST** `/review/` - Create a new review (authenticated)
- **PATCH** `/:id` - Update a review (authenticated)
- **DELETE** `/:id` - Delete a review (authenticated)

### Sample Data Examples

The Postman collection includes realistic sample data:

**User Registration:**
```json
{
  "firstName": "shubham",
  "lastName": "goyal",
  "email": "test@test.com",
  "password": "test@test.com"
}
```

**Book Creation:**
```json
{
  "title": "Whispers of the Forgotten Realm",
  "genre": "Fantasy",
  "publishedDate": "2019-07-15",
  "description": "A gripping tale of a young scribe who discovers a hidden world through ancient manuscripts, unraveling secrets that could change the fate of both realms forever."
}
```

**Review Creation:**
```json
{
  "bookId": "6837f121f7ec72f3b8053aae",
  "rating": 4.5,
  "comment": "A compelling read with well-developed characters and a great plot!"
}
```

### Testing Tips

- **Authentication**: Start with signup → login → test authenticated endpoints
- **Book Search**: Use the search endpoint to find books by title or author name
- **Pagination**: Review endpoints support pagination with `page` and `limit` parameters
- **Error Handling**: Each request will show appropriate error messages for debugging

### Quick Start with Postman

1. Import `postman.json`
2. Set `baseUrl` environment variable to `http://localhost:3000`
3. Run signup request to create account
4. Run login request to authenticate
5. Test book and review operations

## Database Schema

### User Schema
```typescript
{
  firstName: String
  lastName: String
  email: String (required, unique, indexed)
  password: String (hashed)
  isActive: Boolean (default: true)
  picture: String
  refreshToken: String
  timestamps: true
}
```

### Book Schema
```typescript
{
  title: String
  authorId: ObjectId (ref: User)
  authorName: String
  genre: String
  active: Boolean (default: true)
  publishedDate: Date
  description: String
  timestamps: true
}
```

### Review Schema
```typescript
{
  authorId: ObjectId (ref: User)
  authorName: String
  book: ObjectId (ref: Book)
  rating: Number
  comment: String
  timestamps: true
}
```

## Design Decisions & Assumptions

### Authentication
- **JWT Strategy**: Used access tokens (1 day) and refresh tokens (10 days) for secure authentication
- **Password Security**: Implemented bcrypt hashing with salt rounds of 10
- **Token Storage**: Refresh tokens stored in database for session management

### Database Design
- **Denormalization**: Author names stored in both Book and Review schemas for performance optimization
- **Soft Delete**: Books use `active` flag instead of hard deletion to maintain data integrity
- **Indexing**: Email field indexed for faster user lookups

### API Design
- **RESTful Routes**: Following REST conventions for consistent API structure
- **Error Handling**: Centralized error handling middleware (assumed to be implemented)
- **Validation**: Input validation using Mongoose schema validators

### Security Considerations
- Email validation using regex pattern
- Password hashing before storage
- JWT secret keys stored in environment variables
- CORS and cookie parsing middleware included

## Project Structure
```
billeasy/
├── src/
│   ├── models/          # Mongoose schemas and models
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication and validation middleware
│   ├── controllers/     # Business logic controllers
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript files
├── postman_collection.json         # Postman API collection
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.