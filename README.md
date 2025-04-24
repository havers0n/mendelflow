# MendelFlow

<!-- Badges: build status, coverage -->
![CI](https://img.shields.io/github/actions/workflow/status/username/MendelFlow/main.yml?branch=main)
![Coverage](https://img.shields.io/badge/coverage-0%25-brightgreen)

Internal warehouse management application for Mendelson trading network.

## Badges
+| Build | Coverage |
+|-------|----------|
+| ![CI](https://img.shields.io/github/actions/workflow/status/username/MendelFlow/main.yml?branch=main) | ![Coverage](https://img.shields.io/badge/coverage-0%25-brightgreen) |

## Table of Contents
- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [CI/CD](#cicd)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [License](#license)

## Scripts
Common commands:
| Command                 | Description                         |
|-------------------------|-------------------------------------|
| npm start               | Start the development server        |
| npm run build           | Build for production                |
| npm test                | Run unit & integration tests        |
| npm run test:coverage   | Generate test coverage report       |
| npm run e2e             | Open Cypress for E2E tests         |
| npm run lint            | Run ESLint                          |
| npm run format          | Run Prettier                        |

## Project Overview

MendelFlow is a comprehensive warehouse management system designed to optimize warehouse operations, reduce errors, and improve overall efficiency for Mendelson's warehouse operations.

### Key Features (MVP)

- Interactive 2D warehouse map
- Real-time inventory tracking
- 3D product visualization
- Order assembly assistance
- Unit conversion tools
- Product search and information display

## Technical Stack

- Frontend: React
- Backend: Node.js
- Database: PostgreSQL
- 3D Visualization: Three.js
- 3D Models Source: Polycam

## Project Structure

```
MendelFlow/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── docs/             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up the database:
   ```bash
   # Create database and run migrations
   cd backend
   npm run db:setup
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend development server
   cd frontend
   npm start
   ```

## MVP Modules

1. Warehouse Core
   - Interactive 2D warehouse map
   - Real-time inventory tracking
   - Product location visualization

2. Screen Assistant
   - Product search and information display
   - Unit conversion tools
   - Integration with 3D Viewer

3. Order Assembly
   - Active orders display
   - Step-by-step assembly instructions
   - Location highlighting
   - Assembly confirmation system

4. 3D Viewer
   - 3D model visualization
   - Basic model controls
   - Product information display

## Development Guidelines

- Follow the established code style and conventions
- Write tests for new features
- Update documentation as needed
- Create feature branches for new development
- Submit pull requests for review

## Environment Variables
- **Backend** (.env):
  - `DATABASE_URL` – connection string for PostgreSQL
  - `JWT_SECRET` – secret for JWT tokens
  - `JWT_EXPIRES_IN` – expiration time for JWT
- **Frontend** (.env):
  - `REACT_APP_SUPABASE_URL` – Supabase API URL
  - `REACT_APP_SUPABASE_ANON_KEY` – Supabase public anon key

## Testing
- Unit & Integration: `npm test`
- Coverage report: `npm run test:coverage`
- E2E tests: `npm run e2e`

## Code Quality
- Lint: `npm run lint`
- Format: `npm run format`

## CI/CD
This project uses GitHub Actions:
- Linting, testing, coverage, and build run on `push` and `pull_request`
- Workflows defined in `.github/workflows/`

## Contributing
Please follow these guidelines:
- Branch naming: `feat/`, `fix/`, `chore/`
- Commit messages: Conventional Commits
- Create pull requests for review

## Documentation
- Detailed setup and audit notes: `DEVLOG.md`
- API docs in `docs/` directory

## License

Proprietary - All rights reserved 