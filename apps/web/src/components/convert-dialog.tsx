"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Download, Loader2, X, Plus, Trash2, Filter, Eye } from "lucide-react";

interface Sheet {
    id: string;
    label: string;
}

interface ConvertDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PreviewData {
    metadata: {
        label: string;
        author: string;
        totalProblems: number;
        topics: string[];
    };
    problems: any[];
}

export function ConvertDialog({ isOpen, onClose }: ConvertDialogProps) {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>("");
    const [selectedFormat, setSelectedFormat] = useState<string>("excel");
    const [extraColumns, setExtraColumns] = useState<string[]>([]);
    const [newColumnName, setNewColumnName] = useState("");

    // Advanced Features State
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [includeProgress, setIncludeProgress] = useState(false);

    // Filters
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (isOpen && sheets.length === 0) {
            fetch(`${API_BASE_URL}/api/convert`)
                .then((res) => res.json())
                .then((data) => {
                    setSheets(data);
                    if (data.length > 0) setSelectedSheet(data[0].id);
                })
                .catch((err) => console.error(err));
        }
    }, [isOpen, sheets.length]);

    // Fetch Preview when sheet changes
    useEffect(() => {
        if (selectedSheet) {
            setLoadingPreview(true);
            setPreviewData(null);
            setSelectedTopics([]); // Reset filters

            fetch(`${API_BASE_URL}/api/convert/${selectedSheet}`)
                .then(res => res.json())
                .then(data => {
                    setPreviewData(data);
                })
                .catch(err => console.error("Preview failed", err))
                .finally(() => setLoadingPreview(false));
        }
    }, [selectedSheet]);


    const addColumn = () => {
        if (newColumnName.trim()) {
            setExtraColumns([...extraColumns, newColumnName.trim()]);
            setNewColumnName("");
        }
    };

    const removeColumn = (index: number) => {
        setExtraColumns(extraColumns.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (!selectedSheet) return;

        // Auto-add pending column if user forgot to click +
        let finalExtraColumns = [...extraColumns];
        if (newColumnName.trim()) {
            finalExtraColumns.push(newColumnName.trim());
        }

        setLoading(true);
        setStatus(null);

        console.log("Sending convert request with extraColumns:", finalExtraColumns);

        try {
            const response = await fetch(`${API_BASE_URL}/api/convert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sheetId: selectedSheet,
                    format: selectedFormat,
                    extraColumns: finalExtraColumns,
                    options: {
                        includeProgress
                    },
                    filters: {
                        topics: selectedTopics,
                        difficulty: selectedDifficulty
                    }
                }),
            });

            if (!response.ok) throw new Error("Conversion failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const ext = selectedFormat === "excel" ? "xlsx" : selectedFormat === "markdown" ? "md" : "csv";
            a.download = `${selectedSheet}-export.${ext}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            setStatus({ type: "success", message: "Download started!" });
            // setTimeout(onClose, 3000);
        } catch {
            setStatus({ type: "error", message: "Failed to convert." });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredCount = previewData ? previewData.problems?.filter(p => {
        const tMatch = selectedTopics.length === 0 || selectedTopics.includes(p.topic);
        const dMatch = selectedDifficulty.length === 0 || selectedDifficulty.includes(p.difficulty);
        return tMatch && dMatch;
    }).length : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl p-0 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Export Sheet</h2>
                        <p className="text-sm text-muted-foreground">Customize your export options.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column: Configuration */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Sheet</label>
                                <select
                                    value={selectedSheet}
                                    onChange={(e) => setSelectedSheet(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {sheets.map((s) => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Output Format</label>
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="excel">Excel (.xlsx)</option>
                                    <option value="markdown">Markdown (.md)</option>
                                    <option value="csv">Notion / CSV</option>
                                </select>
                            </div>

                            {/* Progress Options */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground block">Options</label>
                                <label className="flex items-center gap-2 text-sm p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                                    <input
                                        type="checkbox"
                                        checked={includeProgress}
                                        onChange={(e) => setIncludeProgress(e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span>Include Progress Tracking</span>
                                </label>
                            </div>

                            {/* Custom Columns */}
                            {selectedFormat === "excel" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Custom Columns</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. Revision Count"
                                            value={newColumnName}
                                            onChange={(e) => setNewColumnName(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addColumn()}
                                            className="flex-1 p-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                        />
                                        <button
                                            onClick={addColumn}
                                            className="p-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 text-foreground transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {extraColumns.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {extraColumns.map((col, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary-foreground bg-primary rounded-full text-xs font-medium border border-primary/20">
                                                    <span>{col}</span>
                                                    <button onClick={() => removeColumn(idx)} className="hover:text-black/70">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Preview & Filters */}
                        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                Sheet Preview
                            </h3>

                            {loadingPreview && <div className="text-sm text-muted-foreground">Loading sheet data...</div>}

                            {previewData && !loadingPreview && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>Total: <span className="text-foreground font-mono">{previewData.metadata?.totalProblems}</span></div>
                                        <div>Selected: <span className="text-foreground font-mono font-bold">{filteredCount}</span></div>
                                    </div>

                                    {/* Difficulty Filter */}
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Difficulty</label>
                                        <div className="flex gap-2">
                                            {['Easy', 'Medium', 'Hard'].map(diff => (
                                                <button
                                                    key={diff}
                                                    onClick={() => {
                                                        if (selectedDifficulty.includes(diff)) setSelectedDifficulty(selectedDifficulty.filter(d => d !== diff));
                                                        else setSelectedDifficulty([...selectedDifficulty, diff]);
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${selectedDifficulty.includes(diff)
                                                        ? 'bg-foreground text-background border-foreground'
                                                        : 'border-border hover:border-foreground/50'
                                                        }`}
                                                >
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Topic Filter */}
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Topics</label>
                                        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                                            {previewData.metadata?.topics.map(topic => (
                                                <button
                                                    key={topic}
                                                    onClick={() => {
                                                        if (selectedTopics.includes(topic)) setSelectedTopics(selectedTopics.filter(t => t !== topic));
                                                        else setSelectedTopics([...selectedTopics, topic]);
                                                    }}
                                                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${selectedTopics.includes(topic)
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-background border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center shrink-0">
                    <div className="text-sm">
                        {status && (
                            <span className={`${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {status.message}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleConvert}
                            disabled={loading || !selectedSheet}
                            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Export {filteredCount} Problems
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
