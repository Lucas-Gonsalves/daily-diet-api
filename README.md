# daily-diet-api

This project was created to apply my backend knowledge, now implementing DDD testing. It utilizes Knex, SQLite, and primarily the Fastify micro-framework.

## Prerequisites

- Node.js (recommended version: 18 or higher)
- npm or pnpm

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Setup

After installation, run the database migrations:

```bash
npm run knex migrate:latest
```

This will create the necessary tables in the SQLite database.

## Running the Application

To start the server in development mode:

```bash
npm run dev
```

The server will be running on `http://localhost:3333` (or the configured port).

## Tests

To run the tests:

```bash
npm run test
```

## Lint

To check and fix linting issues:

```bash
npm run lint
```

## Technologies Used

- **Fastify**: Micro-framework for Node.js
- **Knex**: SQL query builder
- **SQLite**: Database
- **TypeScript**: Superset of JavaScript
- **Vitest**: Testing framework
- **ESLint**: Linter for JavaScript/TypeScript
