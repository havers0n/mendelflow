# MendelFlow

Internal warehouse management application for Mendelson trading network.

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

## License

Proprietary - All rights reserved 