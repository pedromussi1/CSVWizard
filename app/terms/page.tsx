import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - CSVWizard",
  description: "CSVWizard terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: "var(--primary)" }}>&larr; Back to CSVWizard</Link>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Last updated: March 2026</p>

        <div className="space-y-6 text-sm leading-7" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>1. Acceptance of Terms</h2>
            <p>By accessing and using CSVWizard (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>2. Description of Service</h2>
            <p>CSVWizard is a free, browser-based CSV and TSV viewer, editor, and converter. The Service allows you to upload, view, sort, filter, edit, and export tabular data in multiple formats. All processing occurs locally in your browser.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>3. Use of Service</h2>
            <p>You may use the Service for lawful purposes only. You are responsible for the data you process using the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>4. Intellectual Property</h2>
            <p>Data you process and export using the Service belongs to you. The Service itself, including its design, code, and branding, is protected by copyright.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>5. Advertising</h2>
            <p>The Service is funded by advertisements provided by Google AdSense. By using the Service, you acknowledge that ads may be displayed.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>6. Disclaimer of Warranties</h2>
            <p>The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be available at all times or that data conversions will be error-free.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>7. Limitation of Liability</h2>
            <p>In no event shall CSVWizard or its creators be liable for any damages arising from the use or inability to use the Service, including data loss during conversion.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>8. Changes</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>9. Contact</h2>
            <p>Questions about these terms can be directed to the <a href="https://github.com/pedromussi1/CSVWizard" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>GitHub repository</a>.</p>
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
