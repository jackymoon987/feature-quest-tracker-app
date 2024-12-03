# Feature Request Tracking System

A modern web application for tracking and managing feature requests with user roles and status management.

## Features

- 🔐 User Authentication
  - Secure login and registration
  - Role-based access (Admin/Regular users)
  - Session management

- 📝 Feature Request Management
  - Create new feature requests
  - Track request status (Open, In Review, Approved, Rejected, In Progress, Completed)
  - Priority levels (Low, Medium, High)
  - Search and filter capabilities

- 👥 User Roles
  - Admin users can manage all requests and change their status
  - Regular users can submit and view their own requests

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - TanStack Query for data fetching
  - Shadcn UI components
  - Tailwind CSS for styling
  - Wouter for routing

- **Backend**:
  - Node.js with Express
  - Passport.js for authentication
  - PostgreSQL with Drizzle ORM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/db` - Database schema and configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
