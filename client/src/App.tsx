import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import FirstVisit from "./pages/FirstVisit";
import About from "./pages/About";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import BeforeCare from "./pages/BeforeCare";
import AfterCare from "./pages/AfterCare";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import AccessibilityWidget from "./components/AccessibilityWidget";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Mascot hunt pages
import Register from "./pages/Register";
import MascotHunt from "./pages/MascotHunt";
import MascotHuntBadge from "./components/MascotHuntBadge";

// Giveaway pages
import WinAFreeWax from "./pages/WinAFreeWax";
import GiveawayConfirm from "./pages/GiveawayConfirm";
import AdminGiveaway from "./pages/AdminGiveaway";
import AdminBlog from "./pages/AdminBlog";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminHub from "./pages/AdminHub";
import AdminMascot from "./pages/AdminMascot";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
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

        {/* Mascot Hunt */}
        <Route path="/register" component={Register} />
        <Route path="/mascot-hunt" component={MascotHunt} />

        {/* Admin */}
        <Route path="/admin" component={AdminHub} />
        <Route path="/admin/giveaway" component={AdminGiveaway} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/subscribers" component={AdminSubscribers} />
        <Route path="/admin/mascot" component={AdminMascot} />

        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
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
          <MascotHuntBadge />
          <CookieConsent />
          <AccessibilityWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
