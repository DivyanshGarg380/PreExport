# Contributing to PrepExport

We welcome contributions! Whether you want to add a new DSA sheet, a new export format, or improve the UI, here is how you can help.

## Project Structure
The project is a monorepo-style structure:
- **`apps/web`**: Next.js Frontend
- **`apps/api`**: Express Backend

## Core Architecture
The backend uses a plugin-based architecture for scalability:
- **Parsers (`apps/api/src/parsers/`)**: Logic to scrape/parse a specific DSA sheet site.
- **Exporters (`apps/api/src/exporters/`)**: Logic to convert standardized data into files (Excel, MD, CSV).

## How to Add a New Sheet Parser
1. Create a new file `apps/api/src/parsers/your-sheet-name.js`.
2. Implement a function that takes HTML string and returns an array of problems:
   ```js
   [{ name: "Two Sum", difficulty: "Easy", topic: "Arrays", links: { leetcode: "..." } }]
   ```
3. Register your parser in `apps/api/src/parsers/index.js`.
4. Add the sheet details to `apps/api/src/data/sheets.js`.

## How to Add a New Export Format
1. Create a new file `apps/api/src/exporters/your-format.js`.
2. Implement a function that takes the standardized problem array and returns a buffer + content type.
3. Register your exporter in `apps/api/src/exporters/index.js`.

## Local Development
1. Install dependencies:
   ```bash
   cd apps/web && npm install
   cd apps/api && npm install
   ```
2. Run backend:
   ```bash
   cd apps/api && npm run dev
   ```
3. Run frontend:
   ```bash
   cd apps/web && npm run dev
   ```

## Pull Requests
- Please open an issue first to discuss your feature.
- Keep PRs focused on one thing (e.g., "Add Love Babbar Parser").
