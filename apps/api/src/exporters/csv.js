export async function exportCSV(data) {
    const header = "Topic,Problem,Difficulty,Link\n";
    const rows = data.map(p => {
        const safeText = (text) => `"${(text || "").replace(/"/g, '""')}"`;
        return `${safeText(p.topic)},${safeText(p.name)},${safeText(p.difficulty)},${safeText(p.links.leetcode || p.links.article)}`;
    }).join("\n");

    return {
        buffer: Buffer.from(header + rows),
        contentType: "text/csv",
        extension: "csv"
    };
}
