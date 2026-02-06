export function parseStriver(html) {
    const problems = [];
    let currentCategory = null;

    // Extract all script contents for Next.js data
    const scriptRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
        const chunk = match[1]
            .replace(/\\u003c/g, "<")
            .replace(/\\u003e/g, ">")
            .replace(/\\n/g, "")
            .replace(/\\"/g, '"');

        // 1. Detect category
        const categoryMatch = chunk.match(/"category_name":"([^"]+)"/);
        if (categoryMatch) {
            currentCategory = categoryMatch[1];
        }

        // 2. Detect problems
        const problemRegex = /"problem_name":"([^"]+)"([\s\S]*?)"difficulty":"([^"]+)"/g;
        let pMatch;

        while ((pMatch = problemRegex.exec(chunk)) !== null) {
            const problemBlock = pMatch[0];

            const getField = (name) => {
                const m = problemBlock.match(new RegExp(`"${name}":"([^"]+)"`));
                return m ? m[1] : "";
            };

            const name = getField("problem_name");
            const difficulty = getField("difficulty");
            // Basic slug generation
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

            problems.push({
                id: slug,
                title: name,
                slug: slug,
                difficulty: difficulty,
                topic: currentCategory || "General",
                links: {
                    leetcode: getField("leetcode_link"),
                    article: getField("article_link"),
                    video: getField("video_link")
                }
            });
        }
    }

    if (problems.length === 0) {
        throw new Error("No problems extracted");
    }

    // Unified Schema Return
    return {
        metadata: {
            totalProblems: problems.length,
            topics: [...new Set(problems.map(p => p.topic))],
            lastUpdated: new Date().toISOString() // In a real parser we'd scrape this
        },
        problems
    };
}
