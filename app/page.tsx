"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// --- CSV Parser ---
function parseCSV(text: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        row.push(cell);
        cell = "";
      } else if (ch === "\r" && next === "\n") {
        row.push(cell);
        cell = "";
        rows.push(row);
        row = [];
        i++;
      } else if (ch === "\n") {
        row.push(cell);
        cell = "";
        rows.push(row);
        row = [];
      } else {
        cell += ch;
      }
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  // Remove trailing empty rows
  while (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }

  return rows;
}

function detectDelimiter(text: string): string {
  const firstLine = text.split("\n")[0] || "";
  const commas = (firstLine.match(/,/g) || []).length;
  const tabs = (firstLine.match(/\t/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;
  const pipes = (firstLine.match(/\|/g) || []).length;

  const counts = [
    { d: ",", c: commas },
    { d: "\t", c: tabs },
    { d: ";", c: semicolons },
    { d: "|", c: pipes },
  ];
  counts.sort((a, b) => b.c - a.c);
  return counts[0].c > 0 ? counts[0].d : ",";
}

// --- Exporters ---
function toCSV(headers: string[], data: string[][]): string {
  const escape = (s: string) =>
    s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  const lines = [headers.map(escape).join(",")];
  for (const row of data) lines.push(row.map(escape).join(","));
  return lines.join("\n");
}

function toTSV(headers: string[], data: string[][]): string {
  const lines = [headers.join("\t")];
  for (const row of data) lines.push(row.join("\t"));
  return lines.join("\n");
}

function toJSON(headers: string[], data: string[][]): string {
  const objs = data.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = row[i] || ""));
    return obj;
  });
  return JSON.stringify(objs, null, 2);
}

function toSQL(
  headers: string[],
  data: string[][],
  tableName = "table_name"
): string {
  const escSQL = (s: string) => s.replace(/'/g, "''");
  const lines = data.map((row) => {
    const vals = row.map((v) => `'${escSQL(v)}'`).join(", ");
    return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${vals});`;
  });
  return lines.join("\n");
}

function toXML(headers: string[], data: string[][]): string {
  const escXML = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
  for (const row of data) {
    xml += "  <row>\n";
    headers.forEach((h, i) => {
      const tag = h.replace(/[^a-zA-Z0-9_]/g, "_") || `col${i}`;
      xml += `    <${tag}>${escXML(row[i] || "")}</${tag}>\n`;
    });
    xml += "  </row>\n";
  }
  xml += "</data>";
  return xml;
}

// --- Sort type detection ---
type SortDir = "asc" | "desc" | null;

function isNumeric(val: string): boolean {
  return val !== "" && !isNaN(Number(val));
}

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [filterText, setFilterText] = useState("");
  const [editCell, setEditCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState<string | null>(null);
  const [tableName, setTableName] = useState("table_name");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem("csvwizard-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches)
      setTheme("light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("csvwizard-theme", theme);
  }, [theme]);

  // Focus edit input
  useEffect(() => {
    if (editCell && editInputRef.current) editInputRef.current.focus();
  }, [editCell]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // Parse input
  const processData = useCallback(
    (text: string) => {
      setRawText(text);
      const det = detectDelimiter(text);
      setDelimiter(det);
      const rows = parseCSV(text, det);
      if (rows.length === 0) {
        setHeaders([]);
        setData([]);
        return;
      }
      if (hasHeader) {
        setHeaders(rows[0]);
        setData(rows.slice(1));
      } else {
        const cols = Math.max(...rows.map((r) => r.length));
        setHeaders(Array.from({ length: cols }, (_, i) => `Column ${i + 1}`));
        setData(rows);
      }
      setSortCol(null);
      setSortDir(null);
      setFilterText("");
    },
    [hasHeader]
  );

  // File upload
  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processData(text);
      };
      reader.readAsText(file);
    },
    [processData]
  );

  // Drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // Sort
  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortCol(null);
        setSortDir(null);
        return;
      }
    } else {
      setSortCol(colIndex);
      setSortDir("asc");
    }
  };

  // Edit cell
  const startEdit = (rowIdx: number, colIdx: number) => {
    setEditCell({ row: rowIdx, col: colIdx });
    setEditValue(data[rowIdx]?.[colIdx] || "");
  };

  const commitEdit = () => {
    if (!editCell) return;
    const newData = data.map((r) => [...r]);
    newData[editCell.row][editCell.col] = editValue;
    setData(newData);
    setEditCell(null);
  };

  // Delete row
  const deleteRow = (rowIdx: number) => {
    setData(data.filter((_, i) => i !== rowIdx));
  };

  // Add row
  const addRow = () => {
    setData([...data, Array(headers.length).fill("")]);
  };

  // Processed data (sorted + filtered)
  let displayData = [...data];

  if (filterText) {
    const lower = filterText.toLowerCase();
    displayData = displayData.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(lower))
    );
  }

  if (sortCol !== null && sortDir) {
    const col = sortCol;
    const allNumeric = displayData.every((row) => isNumeric(row[col] || ""));
    displayData.sort((a, b) => {
      const va = a[col] || "";
      const vb = b[col] || "";
      let cmp: number;
      if (allNumeric) cmp = Number(va) - Number(vb);
      else cmp = va.localeCompare(vb);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }

  // Export
  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const hasData = headers.length > 0 && data.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b flex items-center justify-between px-6 py-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1
            className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]"
            style={{ color: "var(--primary)" }}
          >
            CSVWizard
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            View, edit, and convert CSV data
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg border transition-colors hover:opacity-80"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* Input Section */}
        {!hasData && (
          <div
            className="border-2 border-dashed rounded-xl p-12 text-center transition-colors"
            style={{ borderColor: "var(--border)" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="text-lg font-medium">
                  Drop a CSV/TSV file here
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  or upload a file / paste data below
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors"
                  style={{ background: "var(--primary)" }}
                >
                  Upload File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
              <div className="w-full max-w-xl mt-4">
                <textarea
                  className="w-full h-40 rounded-lg border p-3 text-sm font-[family-name:var(--font-geist-mono)] resize-y focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder="Or paste CSV/TSV data here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") processData(rawText);
                  }}
                />
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                    <input
                      type="checkbox"
                      checked={hasHeader}
                      onChange={(e) => setHasHeader(e.target.checked)}
                      className="accent-[var(--primary)]"
                    />
                    First row is header
                  </label>
                  <button
                    onClick={() => processData(rawText)}
                    className="ml-auto px-4 py-1.5 rounded-lg text-white text-sm font-medium"
                    style={{ background: "var(--primary)" }}
                  >
                    Parse Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        {hasData && (
          <div
            className="flex flex-wrap items-center gap-3 p-3 rounded-xl border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <input
              type="text"
              placeholder="Filter rows..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />

            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {displayData.length} / {data.length} rows &middot;{" "}
              {headers.length} cols
            </span>

            <button
              onClick={addRow}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              + Add Row
            </button>

            <button
              onClick={() => {
                setHeaders([]);
                setData([]);
                setRawText("");
              }}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium text-red-500 transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border)" }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        {hasData && (
          <div
            className="rounded-xl border overflow-auto max-h-[60vh]"
            style={{ borderColor: "var(--border)" }}
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th
                    className="sticky top-0 z-10 px-2 py-2 text-center text-xs font-medium w-10"
                    style={{
                      background: "var(--surface)",
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      onClick={() => handleSort(i)}
                      className="sticky top-0 z-10 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                      style={{
                        background: "var(--surface)",
                        color: "var(--muted)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {h}
                        {sortCol === i && sortDir === "asc" && " ▲"}
                        {sortCol === i && sortDir === "desc" && " ▼"}
                        {sortCol !== i && (
                          <span className="opacity-30">⇅</span>
                        )}
                      </span>
                    </th>
                  ))}
                  <th
                    className="sticky top-0 z-10 px-2 py-2 w-10"
                    style={{
                      background: "var(--surface)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  />
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, ri) => {
                  const actualIdx = data.indexOf(row);
                  return (
                    <tr
                      key={actualIdx}
                      className="transition-colors"
                      style={{
                        borderBottom: "1px solid var(--border)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        className="px-2 py-1.5 text-center text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        {actualIdx + 1}
                      </td>
                      {headers.map((_, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs"
                          onDoubleClick={() => startEdit(actualIdx, ci)}
                        >
                          {editCell?.row === actualIdx &&
                          editCell?.col === ci ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitEdit();
                                if (e.key === "Escape") setEditCell(null);
                              }}
                              className="w-full px-1 py-0.5 rounded border text-xs focus:outline-none focus:ring-1"
                              style={{
                                background: "var(--background)",
                                borderColor: "var(--primary)",
                                color: "var(--foreground)",
                              }}
                            />
                          ) : (
                            <span className="block max-w-[300px] truncate">
                              {row[ci] || ""}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => deleteRow(actualIdx)}
                          className="text-xs opacity-30 hover:opacity-100 hover:text-red-500 transition-opacity"
                          title="Delete row"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Export Section */}
        {hasData && (
          <div
            className="rounded-xl border p-4"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--muted)" }}
            >
              Export
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() =>
                  download(
                    toCSV(headers, data),
                    "data.csv",
                    "text/csv"
                  )
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                CSV
              </button>
              <button
                onClick={() =>
                  download(
                    toTSV(headers, data),
                    "data.tsv",
                    "text/tab-separated-values"
                  )
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                TSV
              </button>
              <button
                onClick={() =>
                  download(
                    toJSON(headers, data),
                    "data.json",
                    "application/json"
                  )
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                JSON
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    download(
                      toSQL(headers, data, tableName),
                      "data.sql",
                      "text/sql"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  SQL
                </button>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="px-2 py-1 rounded border text-xs w-28 font-[family-name:var(--font-geist-mono)]"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  title="Table name for SQL export"
                />
              </div>
              <button
                onClick={() =>
                  download(
                    toXML(headers, data),
                    "data.xml",
                    "application/xml"
                  )
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                XML
              </button>

              <div
                className="h-6 w-px mx-1"
                style={{ background: "var(--border)" }}
              />

              <button
                onClick={() =>
                  copyToClipboard(toJSON(headers, data))
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                Copy JSON
              </button>
              <button
                onClick={() =>
                  copyToClipboard(toCSV(headers, data))
                }
                className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                Copy CSV
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t text-center py-4 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        Client-side processing &middot; No data sent to servers &middot;{" "}
        <a
          href="https://github.com/pedromussi1/CSVWizard"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--primary)" }}
        >
          GitHub
        </a>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className="px-4 py-2 rounded-lg border text-sm shadow-lg animate-pulse"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              borderLeft: "3px solid var(--primary)",
              color: "var(--foreground)",
            }}
          >
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
