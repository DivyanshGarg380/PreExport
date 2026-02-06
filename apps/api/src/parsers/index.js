import { parseStriver } from "./striver.js";

const parsers = {
    "strivers-sde-sheet": parseStriver,
    "strivers-a2z-sheet": parseStriver,
    "blind-75": parseStriver,
    "strivers-79": parseStriver,
    // New parsers can be added here
};

export function getParser(sheetId) {
    return parsers[sheetId];
}
