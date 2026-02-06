export async function exportMarkdown(data, extraColumns = [], { metadata } = {}) {
    let md = "";
    if (metadata) {
        md += `# ${metadata.label}\n`;
        md += `> **Author**: ${metadata.author} | **Version**: ${metadata.version} | **Source**: ${metadata.url}\n\n`;
    } else {
        md += "# PrepExport Problems\n\n";
    }

    md += "| Topic | Problem | Difficulty | Link |\n";
    md += "|---|---|---|---|\n";

    data.forEach(p => {
        const title = p.title || p.name;
        // Handle potentially missing links gracefully
        const link = p.links ? (p.links.leetcode || p.links.article) : '';
        md += `| ${p.topic} | ${title} | ${p.difficulty} | [Solve](${link}) |\n`;
    });

    return {
        buffer: Buffer.from(md),
        contentType: "text/markdown",
        extension: "md"
    };
}
