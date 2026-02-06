# PrepExport

**Open Source tool to convert DSA Sheets (Striver, etc.) into Excel, Markdown, Notion/CSV.

![DSA Sheet Exporter Hero](/apps/web/public/hero.png)

## Features
- **Multi-Format Export**: Get your problems in Excel (.xlsx), Markdown (.md), or CSV (for Notion/GDocs).
- **Plugins System**: Easily add new sheet parsers or export formats.
- **Clean UI**: Distraction-free interface built with Next.js and Tailwind.

## Supported Sheets
Currently, we support **all Striver's DSA Sheets** (SDE Sheet, A2Z, Blind 75, Striver's 79).
We are actively working on adding support for more sheets (Love Babbar, Cracking the Coding Interview, etc.) in the future.

## Getting Started

### Prerequisites
- Node.js 18+

### Installation
1. Clone the repo
   ```bash
   git clone https://github.com/nitishkumar/dsa-sheet-to-excel.git
   ```
2. Install dependencies
   ```bash
   cd apps/web && npm install
   cd ../api && npm install
   ```

### Running Locally
You need two terminals:

**Backend:**
```bash
cd apps/api
npm run dev
```

**Frontend:**
```bash
cd apps/web
npm run dev
```
Visit `http://localhost:3000`.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to add new sheets or formats.

## License
MIT
