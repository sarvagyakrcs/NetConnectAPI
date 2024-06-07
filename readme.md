# NetConnect

<!-- [![Node.js CI](https://github.com/sarvagyakrcs/NetConnect/actions/workflows/node.js.yml/badge.svg)](https://github.com/sarvagyakrcs/NetConnect/actions) -->

## Description

The NetQuery Hub leverages concepts from both discrete mathematics and computer networks to offer a comprehensive tool for web developers, particularly those who are not deeply familiar with network analytics. By allowing users to query network performance data in natural language, the project makes advanced network analysis accessible and actionable. The use of a vector database enhances the ability to perform complex queries and retrieve information efficiently, thus empowering developers to optimize their web applications based on precise, data-driven insights.
Data Flow and Interactions:
1. Uploading and Parsing .HAR Files: The user uploads a .HAR file via a form on the Next.js frontend. The backend receives the .HAR file, parses it using a custom Node.js script, and extracts relevant data (e.g., request timings, sizes, statuses).
2. Data Storage: Non-vectorized data (user data, basic request logs) is stored in PostgreSQL for transactional integrity and relational queries.
Important metrics and features extracted from the .HAR file are vectorized (possibly using techniques like feature hashing or embeddings) and stored in a vector database for efficient query performance and similarity searches.
3. Query Processing with LangChain: The frontend allows users to type natural language queries about their data.
These queries are sent to the backend, where LangChain processes the queries to understand intent and context.
LangChain, integrated via its SDK in the Node.js application, communicates with the vector database or PostgreSQL as needed, depending on the query. For instance, if a query involves finding similar performance issues, it hits the vector database; if it’s about user settings or historical data, it queries PostgreSQL.
4. Response and Visualization: The backend aggregates the responses from LangChain and the databases and sends the data back to the frontend.
The frontend displays this data in a user-friendly format, allowing the developer to make informed decisions based on the insights provided.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/sarvagyakrcs/NetConnect.git
    cd NetConnect
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary environment variables.
    ```env
    PORT=3000
    DATABASE_URL=your_database_url
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. Access the application at `http://localhost:3000`.

## Features

- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: Modern database toolkit to query, migrate and model your database.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Bcrypt**: Library to hash and compare passwords securely.
- **ESLint**: Pluggable linting utility for JavaScript and TypeScript.
- **Prettier**: Opinionated code formatter.

## Scripts

- `npm run dev`: Run the application in development mode.
- `npm run build`: Build the application for production.
- `npm start`: Start the application in production mode.
- `npm run lint`: Run ESLint to lint the codebase.
- `npm run format`: Run Prettier to format the codebase.