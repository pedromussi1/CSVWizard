import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - CSVWizard",
  description: "CSVWizard privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <Link href="/" className="text-sm mb-6 inline-block" style={{ color: "var(--primary)" }}>&larr; Back to CSVWizard</Link>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Last updated: March 2026</p>

        <div className="space-y-6 text-sm leading-7" style={{ color: "var(--muted)" }}>
          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>1. Data Processing</h2>
            <p>CSVWizard processes all data entirely in your browser. No CSV files, spreadsheet data, or converted output is ever sent to our servers. Your data stays on your device at all times.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>2. Data Storage</h2>
            <p>We store only your theme preference (dark/light mode) in your browser&apos;s localStorage. No personal information, accounts, or usage data is collected or stored.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>3. Advertising</h2>
            <p>This site uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this site or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>4. Cookies</h2>
            <p>We do not set our own cookies. Third-party services (such as Google AdSense) may set cookies for advertising purposes. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>5. Third-Party Services</h2>
            <p>This site loads the following external resources:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Google Fonts (Geist, Geist Mono) for typography</li>
              <li>Google AdSense for advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>6. Children&apos;s Privacy</h2>
            <p>This site is not directed at children under 13. We do not knowingly collect any personal information from children.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>7. Changes</h2>
            <p>We may update this privacy policy from time to time. Changes will be reflected on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>8. Contact</h2>
            <p>If you have questions about this privacy policy, you can reach us via the <a href="https://github.com/pedromussi1/CSVWizard" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>GitHub repository</a>.</p>
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
