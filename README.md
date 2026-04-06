# PhysioCare Backend

Backend API for the PhysioCare application. This service handles:

- patient registration and login
- doctor registration and profile management
- appointment booking and cancellation
- admin booking visibility
- Stripe checkout session creation

The project is built with Node.js, Express, MongoDB, Mongoose, JWT, Multer, and Stripe.

## Tech Stack

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Multer for doctor profile image uploads
- Stripe for payment checkout
- CORS and dotenv

## Project Structure

```text
physiocare-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── bookingController.js
│   ├── doctotController.js
│   └── userController.js
├── middlewares/
│   ├── adminJwtMiddleware.js
│   ├── doctorJwtMiddleware.js
│   ├── jwtMiddlewares.js
│   └── multerMiddleware.js
├── models/
│   ├── bookingModal.js
│   ├── doctorModel.js
│   └── userModel.js
├── router/
│   └── route.js
├── index.js
└── package.json
```

## Features

- User auth with email/password
- Google-style login endpoint for frontend social auth flow
- Doctor onboarding with multipart image upload
- Role-aware JWT middleware for users, doctors, and admins
- Patient booking creation and history lookup
- Doctor booking dashboard endpoint
- Admin endpoint for all bookings
- Stripe checkout session generation

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
connectionString=mongodb://127.0.0.1:27017/physiocare
jwtKey=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

### Variable Notes

- `PORT`: Express server port. Defaults to `3000`.
- `connectionString`: MongoDB connection string used in `config/db.js`.
- `jwtKey`: Secret used to sign and verify JWT tokens.
- `STRIPE_SECRET_KEY`: Required for Stripe checkout session creation.
- `FRONTEND_URL`: Used for Stripe `success_url` and `cancel_url`.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create the upload directory expected by Multer:

```bash
mkdir uploads
```

3. Add your `.env` file.

4. Start the server:

```bash
node index.js
```

The API will start on `http://localhost:3000` unless `PORT` is overridden.

## API Base URL

All endpoints are mounted directly on the server root. Example:

```text
http://localhost:3000/api/...
```

## Authentication

This project uses Bearer tokens in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Roles

- `physiocareUser`: default patient role
- `physiocareDoctor`: doctor role
- `physiocareAdmin`: admin role

## API Endpoints

### User

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users` | Get all patient users | No |
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Login for user or doctor | No |
| POST | `/api/google-login` | Login/register via social-auth style flow | No |
| PUT | `/api/user/updateUser` | Update user profile | User JWT |
| PUT | `/api/admin/updateAdmin` | Update admin account details | Admin JWT |

### Doctor

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/doctor-register` | Register doctor with profile image upload | No |
| GET | `/api/doctors` | List all doctors | No |
| GET | `/api/doctor/profile` | Get doctor profile for the authenticated token flow currently wired to this route | JWT required |
| GET | `/api/doctor/:id` | Get doctor by MongoDB ID or email | No |

### Booking

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/doctor-booking` | Create a booking | User JWT |
| GET | `/api/doctorbooking` | Get logged-in user bookings | User JWT |
| GET | `/api/doctor-bookings` | Get logged-in doctor bookings | Doctor JWT |
| GET | `/api/admin/all-bookings` | Get all bookings for admin | Admin JWT |
| DELETE | `/api/cancel-booking/:bookingId` | Cancel a booking | No middleware currently applied |

### Payments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/stripe/create-checkout-session` | Create Stripe checkout session | No |

## Sample Requests

### Register User

```http
POST /api/register
Content-Type: application/json

{
  "username": "Rahul",
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Register Doctor

Use `multipart/form-data` with:

- `profileImage`: image file
- `username`
- `email`
- `password`
- `number`
- `specialization`
- `experience`
- `location`
- `education`
- `availability`
- `session`
- `fees`
- `date`
- `bio`

### Create Booking

```http
POST /api/doctor-booking
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "doctorId": "doctor_mongo_id",
  "username": "Rahul",
  "email": "rahul@example.com",
  "number": "9999999999",
  "session": "Online",
  "date": "2026-04-10",
  "time": "10:30 AM",
  "description": "Back pain consultation"
}
```

### Create Stripe Checkout Session

```http
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "doctorId": "doctor_mongo_id",
  "fees": 800,
  "bookingData": {
    "username": "Rahul",
    "email": "rahul@example.com",
    "time": "10:30 AM"
  }
}
```

## Uploads

- Doctor images are stored in the local `uploads/` directory.
- Uploaded files are served from `/uploads`.
- Example public path:

```text
http://localhost:3000/uploads/<filename>
```

## Data Models

### User

- `username`
- `email`
- `password`
- `profile`
- `role`

### Doctor

- `username`
- `email`
- `password`
- `number`
- `specialization`
- `experience`
- `location`
- `education`
- `availability`
- `session`
- `fees`
- `profileImage`
- `bio`
- `date`
- `role`

### Booking

- `doctorId`
- `userId`
- `username`
- `email`
- `number`
- `session`
- `date`
- `time`
- `description`
- `status`
- `role`

## Current Limitations

- No password hashing is implemented yet.
- No refresh token flow is present.
- No validation library is used for request payloads.
- `npm test` is not configured.
- `DELETE /api/cancel-booking/:bookingId` is currently not protected by auth middleware.
- There is no `npm start` or `npm run dev` script in `package.json` yet.
- `/api/doctor/profile` currently uses the generic JWT middleware instead of the doctor-specific middleware.

## Suggested Next Improvements

- Add bcrypt password hashing
- Add request validation with Joi or Zod
- Add centralized error handling
- Add a proper start/dev script with nodemon
- Add tests for auth, bookings, and payments
- Protect sensitive routes consistently

## License

ISC
