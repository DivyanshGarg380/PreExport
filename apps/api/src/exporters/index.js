import { exportExcel } from "./excel.js";
import { exportMarkdown } from "./markdown.js";
import { exportCSV } from "./csv.js";

const exporters = {
    excel: exportExcel,
    markdown: exportMarkdown,
    csv: exportCSV
};

export function getExporter(format) {
    return exporters[format] || exporters.excel;
}
