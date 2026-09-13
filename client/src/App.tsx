import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import ArticlePage from "@/pages/ArticlePage";
import EditorPage from "@/pages/EditorPage";
import AboutPage from "@/pages/AboutPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() { return <Switch>
  <Route path="/" component={Home} />
  <Route path="/article/:slug" component={ArticlePage} />
  <Route path="/category/vpn-troubleshooting" component={Home} />
  <Route path="/about" component={AboutPage} />
  <Route path="/editor" component={EditorPage} />
  <Route path="/404" component={NotFound} />
  <Route component={NotFound} />
</Switch>; }

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
