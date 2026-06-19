import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import AccessibilityWidget from "./components/AccessibilityWidget";

// Eagerly loaded — always needed on first paint
import Home from "./pages/Home";
import NotFound from "@/pages/NotFound";

// Lazy-loaded page chunks — each route gets its own JS chunk
const Services = lazy(() => import("./pages/Services"));
const FirstVisit = lazy(() => import("./pages/FirstVisit"));
const About = lazy(() => import("./pages/About"));
const Locations = lazy(() => import("./pages/Locations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const BeforeCare = lazy(() => import("./pages/BeforeCare"));
const AfterCare = lazy(() => import("./pages/AfterCare"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const WinAFreeWax = lazy(() => import("./pages/WinAFreeWax"));
const GiveawayConfirm = lazy(() => import("./pages/GiveawayConfirm"));
const Register = lazy(() => import("./pages/Register"));

// Minimal spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* make sure to consider if you need authentication for certain routes */}
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/first-visit" component={FirstVisit} />
          <Route path="/about" component={About} />
          <Route path="/locations" component={Locations} />
          <Route path="/locations/:id" component={LocationDetail} />
          <Route path="/faq" component={FAQ} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route path="/before-care" component={BeforeCare} />
          <Route path="/after-care" component={AfterCare} />

          {/* Canonical legal pages */}
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />

          {/* Legacy short URLs — redirect to canonical pages */}
          <Route path="/privacy"><Redirect to="/privacy-policy" /></Route>
          <Route path="/terms"><Redirect to="/terms-of-service" /></Route>

          {/* Giveaway */}
          <Route path="/win-a-free-wax" component={WinAFreeWax} />
          <Route path="/win-a-free-wax/confirm" component={GiveawayConfirm} />

          <Route path="/register" component={Register} />

          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
          <AccessibilityWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
