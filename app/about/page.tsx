import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - CSVWizard",
  description: "About CSVWizard — a free online CSV viewer, editor, and converter.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: "var(--primary)" }}>&larr; Back to CSVWizard</Link>
        <h1 className="text-3xl font-bold mb-2">About CSVWizard</h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Free CSV Viewer, Editor &amp; Converter</p>

        <div className="space-y-6 text-sm leading-7" style={{ color: "var(--muted)" }}>
          <p>CSVWizard is a free, open-source CSV and TSV viewer, editor, and converter built for speed and privacy. Upload, paste, or drag-and-drop your spreadsheet data to view it in a sortable, filterable table &mdash; then export to JSON, SQL, XML, and more. All without creating an account or uploading your data to a server.</p>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>Why CSVWizard?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>100% Client-Side</strong> &mdash; Everything runs in your browser. No data leaves your device.</li>
              <li><strong>Fast with Large Files</strong> &mdash; Virtualized rendering handles 10,000+ rows smoothly.</li>
              <li><strong>Multiple Export Formats</strong> &mdash; CSV, TSV, JSON, SQL INSERT, and XML.</li>
              <li><strong>Inline Editing</strong> &mdash; Double-click any cell to edit. Add or delete rows.</li>
              <li><strong>Smart Detection</strong> &mdash; Auto-detects delimiters (comma, tab, semicolon, pipe).</li>
              <li><strong>Free &amp; Open Source</strong> &mdash; Source code available on <a href="https://github.com/pedromussi1/CSVWizard" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>GitHub</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>Who Made This?</h2>
            <p>CSVWizard was created by <a href="https://github.com/pedromussi1" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Pedro Mussi</a>, a developer building free web tools. Check out the other tools in the collection:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><a href="https://github.com/pedromussi1/format-converter" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>FormatConverter</a> &mdash; Image format converter</li>
              <li><a href="https://github.com/pedromussi1/QRCraft" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>QRCraft</a> &mdash; QR code generator</li>
              <li><a href="https://github.com/pedromussi1/PaletteGen" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>PaletteGen</a> &mdash; Color palette generator</li>
              <li><a href="https://github.com/pedromussi1/JSONToolbox" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>JSONToolbox</a> &mdash; JSON formatter &amp; validator</li>
              <li><a href="https://github.com/pedromussi1/PDF2Text" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>PDF2Text</a> &mdash; PDF to text converter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>Contact</h2>
            <p>For bug reports, feature requests, or questions, please open an issue on the <a href="https://github.com/pedromussi1/CSVWizard" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>GitHub repository</a>.</p>
          </section>
        </div>
      </main>
      <footer className="border-t text-center py-4 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <Link href="/" style={{ color: "var(--primary)" }}>CSVWizard</Link> &middot;{" "}
        <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy</Link> &middot;{" "}
        <Link href="/terms" style={{ color: "var(--primary)" }}>Terms</Link> &middot;{" "}
        <Link href="/about" style={{ color: "var(--primary)" }}>About</Link>
      </footer>
    </div>
  );
}
