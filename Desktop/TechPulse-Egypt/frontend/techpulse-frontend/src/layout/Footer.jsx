import React from "react";

/**
 * Container component to consistently format dimensions and margins across the entire site
 */
const Container = ({ children }) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
);

/**
 * Custom code icon (eliminates the need for external libraries)
 */
const CodeIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
    />
  </svg>
);

/**
 * Portfolio/Briefcase icon for professions and jobs
 */
const BriefcaseIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 .594-.482 1.08-1.08 1.08H4.83c-.598 0-1.08-.486-1.08-1.08v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8a2.18 2.18 0 0 1-.75 1.661m0 0a2.18 2.18 0 0 1-3 0m-9.75-1.661c0 .619-.304 1.17-.75 1.661m0 0a2.18 2.18 0 0 0-3 0m0 0a2.18 2.18 0 0 1-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175a48.114 48.114 0 0 1 3.413-.387m-4.5 8A2.18 2.18 0 0 0 4.83 12.5m4.5 1.651H14.17m-5.45-5.111a14.28 14.28 0 0 1 6.56 0M9 6.75V4.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25M9 6.75h6"
    />
  </svg>
);

/**
 * Charts and statistics icon
 */
const ChartIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);

/**
 * Footer component for TechPulse Egypt
 * @param {Function} onNavigate - Optional callback function for internal navigation
 */
export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  // Helper function to handle link clicks and support Single Page Applications (SPAs)
  const handleLinkClick = (e, path) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="mt-24 border-t border-slate-800 bg-slate-950 text-slate-400">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-black text-white">
              <span className="text-cyan-400"> TechPulse</span>
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-slate-400 text-left">
              Egypt's leading tech job market intelligence platform, helping
              developers, data professionals, AI engineers, and IT specialists
              discover the best career opportunities with top companies.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white text-left">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, "/")}
                  className="transition-colors duration-200 hover:text-cyan-400 block py-1 cursor-pointer text-left"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/jobs"
                  onClick={(e) => handleLinkClick(e, "/jobs")}
                  className="transition-colors duration-200 hover:text-cyan-400 block py-1 cursor-pointer text-left"
                >
                  Available Jobs
                </a>
              </li>

              <li>
                <a
                  href="/companies"
                  onClick={(e) => handleLinkClick(e, "/companies")}
                  className="transition-colors duration-200 hover:text-cyan-400 block py-1 cursor-pointer text-left"
                >
                  Companies
                </a>
              </li>

              <li>
                <a
                  href="/locations"
                  onClick={(e) => handleLinkClick(e, "/locations")}
                  className="transition-colors duration-200 hover:text-cyan-400 block py-1 cursor-pointer text-left"
                >
                  Locations
                </a>
              </li>

              <li>
                <a
                  href="/analytics"
                  onClick={(e) => handleLinkClick(e, "/analytics")}
                  className="transition-colors duration-200 hover:text-cyan-400 block py-1 cursor-pointer text-left"
                >
                  Analytics & Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack Section */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white text-left">
              Platform Built Using
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-start gap-3 text-slate-400 transition-colors hover:text-slate-200 dir-ltr">
                <CodeIcon className="text-cyan-400 h-5 w-5 flex-shrink-0" />
                <span>React + Node.js + Express</span>
              </div>

              <div className="flex items-center justify-start gap-3 text-slate-400 transition-colors hover:text-slate-200 dir-ltr">
                <BriefcaseIcon className="text-cyan-400 h-5 w-5 flex-shrink-0" />
                <span>SQL Server Data Warehouse</span>
              </div>

              <div className="flex items-center justify-start gap-3 text-slate-400 transition-colors hover:text-slate-200 dir-ltr">
                <ChartIcon className="text-cyan-400 h-5 w-5 flex-shrink-0" />
                <span>ETL Pipeline & Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 md:flex-row text-center md:text-left">
          <p className="text-sm text-slate-500">
            © {year}{" "}
            <span className="font-semibold text-white">TechPulse Egypt</span>.
            All rights reserved.
          </p>

          <p className="text-sm text-slate-500">
            Made with love using React • Node.js • SQL Server
          </p>
        </div>
      </Container>
    </footer>
  );
}
