# Note Taking App

A simple note-taking application built with Next.js and Supabase.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Express.js (dev), 
- **Database**: Supabase
- **Authentication**: JWT
- **State Management**: React Hooks
- **Notifications**: Sonner
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/OsaidZaher/Note-taking-app-task-intern
cd note-taking-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. All environment variables and Supabase connections are already configured in the project. No additional setup is required for database connectivity.

## Running the Application

### Development Mode

Start the Express backend server and front end in one command:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`
The server will be available at `http://localhost:5000`


Start the production server:

```bash
npm start
# or
yarn start
```

## Test Credentials

Username: `intern`
Password: `letmein`


### Running Unit Tests

```bash
npm test
# or
yarn test
```

### Running Cypress Tests

First, make sure the development server is running:

```bash
npm run dev
# or
yarn dev
```

Then, in another terminal, run Cypress:

```bash
npm run cypress
# or
yarn cypress
```

## Development vs Production and TradeOffs


- In development, API requests are proxied to the Express server running on port 5000
- In production on Vercel, it will not work without a connection to a server hosting service like Heroku- which is not implemented due to the scope of the project.
- In reality I wouldn't use ExpressJs for the backend with typescript, nextJs route is perfect.
- THe nature of this project is weird since NextJs has their own route and it was my first time coding ExpressJs in Typescript, In the future maybe I would use a React app instead of NextJs app, but also in the future I would only use NextJs.

