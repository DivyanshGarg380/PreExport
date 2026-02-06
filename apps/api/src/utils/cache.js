import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "data", "problems");

export async function saveSheetToCache(sheetId, data) {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
        const filePath = path.join(CACHE_DIR, `${sheetId}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`[Cache] Saved ${sheetId} to disk.`);
    } catch (error) {
        console.error(`[Cache] Failed to save ${sheetId}:`, error.message);
    }
}

export async function getSheetFromCache(sheetId) {
    try {
        const filePath = path.join(CACHE_DIR, `${sheetId}.json`);
        const content = await fs.readFile(filePath, "utf-8");
        console.log(`[Cache] Loaded ${sheetId} from disk.`);
        return JSON.parse(content);
    } catch (error) {
        console.warn(`[Cache] Miss/Error for ${sheetId}:`, error.message);
        return null;
    }
}
