import axios from "axios";
import { getParser } from "../parsers/index.js";
import { getExporter } from "../exporters/index.js";
import { SHEETS } from "../data/sheets.js";

// Helper to fetch and normalize
async function fetchAndNormalize(sheetId) {
  if (!sheetId || !SHEETS[sheetId]) {
    throw new Error("Invalid or missing sheet ID");
  }

  const { url, ...staticMeta } = SHEETS[sheetId];
  const parser = getParser(sheetId);

  if (!parser) {
    throw new Error("No parser found for this sheet");
  }

  console.log(`Fetching ${url}...`);
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const normalizedData = parser(html);

  // Merge static metadata (like author) with parsed metadata (like total counts)
  return {
    metadata: {
      ...staticMeta,
      ...normalizedData.metadata
    },
    problems: normalizedData.problems
  };
}

export const getSheetPreview = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const data = await fetchAndNormalize(sheetId);
    res.json(data);
  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).json({ error: error.message || "Failed to preview sheet." });
  }
};

export const convertSheetToExcel = async (req, res) => {
  try {
    const { sheetId, format, extraColumns, filters, options } = req.body;
    console.log(`Received conversion request for ${sheetId} with extraColumns:`, extraColumns);

    const { problems, metadata } = await fetchAndNormalize(sheetId);

    // Filtering Logic
    let filteredProblems = problems;
    if (filters) {
      if (filters.difficulty && filters.difficulty.length > 0) {
        filteredProblems = filteredProblems.filter(p => filters.difficulty.includes(p.difficulty));
      }
      if (filters.topics && filters.topics.length > 0) {
        filteredProblems = filteredProblems.filter(p => filters.topics.includes(p.topic));
      }
    }

    console.log(`Exporting ${filteredProblems.length} problems (filtered from ${problems.length})`);

    // 3. Get Exporter
    const exporter = getExporter(format);

    // 4. Export (Pass metadata and options for attribution/progress)
    const { buffer, contentType, extension } = await exporter(filteredProblems, extraColumns, { metadata, options });

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${sheetId}-export.${extension}"`);
    res.send(buffer);

  } catch (error) {
    console.error("Conversion error:", error.message);
    res.status(500).json({ error: "Failed to convert sheet. The source structure might have changed." });
  }
};

export const getAvailableSheets = (req, res) => {
  const list = Object.entries(SHEETS).map(([id, data]) => ({
    id,
    label: data.label,
    author: data.author
  }));
  res.json(list);
};
