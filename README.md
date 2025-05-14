# Advanced Media Library Management System

![AML Logo](public/open-book-library.png)

## Overview

Advanced Media Library (AML) is a modern library management system designed to manage library resources, subscriptions, and user interactions across all branches in England. This full-stack application provides a seamless experience for library patrons to browse, borrow, and return books, while also managing their subscriptions.

## System Architecture

The AML system follows a modern web application architecture with the following components:

### Frontend Architecture
- **Next.js App Router**: Provides file-based routing and server components
- **React Components**: UI components organized by functionality
- **Server Components**: For data fetching and rendering
- **Client Components**: For interactive elements
- **Tailwind CSS**: For styling and responsive design

### Backend Architecture
- **API Routes**: Next.js API routes for backend functionality
- **Authentication System**: JWT-based authentication with refresh tokens
- **Database Layer**: MySQL database with connection pooling
- **Business Logic Layer**: Separated into domain-specific modules

### Data Flow
1. User interacts with the UI
2. Client components send requests to API routes
3. API routes validate requests and authenticate users
4. Business logic processes the request
5. Database operations are performed
6. Response is sent back to the client

### Security Architecture
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **HTTP-Only Cookies**: For secure token storage
- **Input Validation**: To prevent injection attacks
- **Environment Variables**: For secure configuration

### Subscription System
- **Subscription Plans**: Different tiers with varying benefits
- **Payment Processing**: Simulated payment system
- **Subscription Management**: Users can upgrade, downgrade, or cancel

## Features

### User Features
- **User Authentication**: Secure signup and login functionality
- **Book Catalog**: Browse and search through the entire book collection
- **Book Details**: View comprehensive information about each book
- **Borrowing System**: Borrow and return books with a few clicks
- **Subscription Management**: Choose and manage subscription plans
- **Dashboard**: Personal dashboard showing borrowed books and subscription status
- **Borrowing History**: Track all past and current borrowings

### Administrative Features
- **Book Management**: Add, edit, and remove books from the catalog
- **User Management**: Manage user accounts and permissions
- **Branch Management**: Manage multiple library branches
- **Subscription Plans**: Configure and manage subscription plans
- **Reports**: Generate reports on borrowings, returns, and subscriptions

## Technologies Used

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend
- Next.js API Routes
- MySQL Database
- Server Actions

### Authentication
- JWT-based authentication with jose library
- Password hashing with bcrypt
- Refresh token mechanism

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- MySQL 8.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/sandyjnr07/library-management-system.git
   cd library-management-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_mysql_username
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=library_management
   JWT_SECRET=your_jwt_secret_should_be_at_least_32_characters_long
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   npm run init-db
   # or
   yarn init-db
   \`\`\`
   Alternatively, you can visit `/init-db` route after starting the development server.

5. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The system uses the following main tables:

- **users**: Stores user information and authentication details
- **subscriptions**: Manages user subscription plans and statuses
- **books**: Contains book metadata and details
- **book_copies**: Tracks individual copies of books and their availability
- **borrowings**: Records book borrowing transactions
- **branches**: Stores information about library branches
- **reservations**: Manages book reservations

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `POST /api/auth/logout`: Log out a user
- `GET /api/auth/me`: Get current user information
- `POST /api/auth/refresh`: Refresh access token

### Books
- `GET /api/books`: Get all books with optional filtering
- `GET /api/books/:id`: Get a specific book by ID
- `GET /api/books/:id/status`: Check if a book is available or borrowed by the current user
- `POST /api/books/borrow`: Borrow a book
- `POST /api/books/return`: Return a borrowed book

### User
- `GET /api/user/borrowings`: Get user's borrowing history
- `GET /api/user/subscription`: Get user's subscription details
- `PUT /api/user/subscription`: Update user's subscription
- `DELETE /api/user/subscription`: Cancel user's subscription
- `POST /api/user/subscription/schedule`: Schedule a subscription change

### Checkout
- `POST /api/checkout/process`: Process a subscription payment

## Project Structure

\`\`\`
library-management-system/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── catalog/            # Book catalog pages
│   ├── checkout/           # Checkout flow
│   ├── dashboard/          # User dashboard
│   ├── init-db/            # Database initialization
│   └── ...
├── components/             # React components
│   ├── ui/                 # UI components (shadcn)
│   └── ...
├── lib/                    # Utility functions and business logic
│   ├── auth.ts             # Authentication utilities
│   ├── books.ts            # Book-related functions
│   ├── db.ts               # Database connection and queries
│   ├── subscription.ts     # Subscription management
│   └── ...
├── public/                 # Static assets
├── scripts/                # Database scripts
└── ...
\`\`\`

## Authentication System

The system uses a JWT-based authentication system with the following features:

1. **Access Tokens**: Short-lived tokens (1 hour) for API access
2. **Refresh Tokens**: Long-lived tokens (7 days) for obtaining new access tokens
3. **Password Hashing**: bcrypt with 10 salt rounds for secure password storage
4. **HTTP-Only Cookies**: Secure storage of tokens to prevent XSS attacks
5. **Token Verification**: Server-side verification of tokens for protected routes

## Subscription System

The subscription system allows users to:

1. **Choose Plans**: Select from basic or premium plans, monthly or yearly
2. **Manage Subscriptions**: Upgrade, downgrade, or cancel subscriptions
3. **Process Payments**: Simulated payment processing
4. **Schedule Changes**: Schedule subscription changes for future dates

## Development

### Running Tests
\`\`\`bash
npm run test
# or
yarn test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Deployment

The application can be deployed to Vercel with minimal configuration:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

For other hosting providers, build the application and serve the output from the `.next` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MySQL](https://www.mysql.com/)
- [Lucide Icons](https://lucide.dev/)
- [jose](https://github.com/panva/jose)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
# library-management-system
