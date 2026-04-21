import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/ScrollToTop";

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
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
