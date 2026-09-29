import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Eye,
  EyeOff,
  House,
  LogOut,
  Menu,
  ReceiptText,
  Repeat2,
  Scale,
  Settings,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { usePrivacy } from "../hooks/usePrivacy";
import { AIAssistant } from "./AIAssistant";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: House },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/rules", label: "Rules", icon: Sparkles },
  { to: "/debts", label: "Debts", icon: Scale },
  { to: "/subscriptions", label: "Subscriptions", icon: Repeat2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const primaryNavItems = navItems.filter(({ to }) =>
  ["/", "/transactions", "/debts"].includes(to)
);

const secondaryNavItems = navItems.filter(({ to }) =>
  !["/", "/transactions", "/debts"].includes(to)
);

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { privacyMode, togglePrivacy, isLoading: privacyLoading } = usePrivacy();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [showAI, setShowAI] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const isMoreActive = secondaryNavItems.some(
    ({ to }) => location.pathname === to
  );

  const displayName = user?.name || user?.email || "Account";

  return (
    <div className="app-frame">
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="app-brand" aria-label="Koin dashboard">
            <span className="app-brand-mark">K</span>
            <span>
              <span className="app-brand-name">Koin</span>
              <span className="app-brand-kicker">Money, made clear</span>
            </span>
          </Link>

          <div className="app-header-actions">
            <button
              onClick={togglePrivacy}
              disabled={privacyLoading}
              className={`icon-button ${privacyMode ? "is-active" : ""}`}
              title={privacyMode ? "Show financial values" : "Hide financial values"}
              aria-label={privacyMode ? "Show financial values" : "Hide financial values"}
            >
              {privacyMode ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
            <button
              onClick={() => setShowMore(true)}
              className="profile-button"
              aria-label={`Open menu for ${displayName}`}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </button>
          </div>
        </header>

        <main ref={mainRef} className="app-main">
          {children}
        </main>

        <nav className="app-bottom-nav" aria-label="Primary navigation">
          {primaryNavItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="bottom-nav-item"
              activeProps={{ className: "bottom-nav-item is-active" }}
            >
              <Icon size={20} strokeWidth={2.1} />
              <span>{label === "Transactions" ? "Activity" : label}</span>
            </Link>
          ))}
          <button
            type="button"
            className={`bottom-nav-item ${isMoreActive ? "is-active" : ""}`}
            onClick={() => setShowMore(true)}
          >
            <Menu size={20} strokeWidth={2.1} />
            <span>More</span>
          </button>
        </nav>

        {showMore && (
          <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <button
              className="menu-scrim"
              onClick={() => setShowMore(false)}
              aria-label="Close navigation menu"
            />
            <div className="more-sheet">
              <div className="sheet-grabber" />
              <div className="more-sheet-header">
                <div>
                  <p className="eyebrow">Your workspace</p>
                  <h2>{displayName}</h2>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setShowMore(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="more-grid">
                {secondaryNavItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="more-link"
                    activeProps={{ className: "more-link is-active" }}
                    onClick={() => setShowMore(false)}
                  >
                    <span className="more-link-icon"><Icon size={21} /></span>
                    <span>{label}</span>
                  </Link>
                ))}
                <button
                  className="more-link"
                  onClick={() => {
                    setShowMore(false);
                    setShowAI(true);
                  }}
                >
                  <span className="more-link-icon"><ReceiptText size={21} /></span>
                  <span>Ask Koin</span>
                </button>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>
        )}

        <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
      </div>
    </div>
  );
}
