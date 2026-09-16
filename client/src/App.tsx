import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import ArticlePage from "@/pages/ArticlePage";
import AboutPage from "@/pages/AboutPage";
import FeedbackPage from "@/pages/FeedbackPage";
import NotFound from "@/pages/NotFound";

export default function App() { return <Switch><Route path="/" component={Home} /><Route path="/category/vpn-troubleshooting" component={Home} /><Route path="/article/:slug" component={ArticlePage} /><Route path="/about" component={AboutPage} /><Route path="/feedback" component={FeedbackPage} /><Route component={NotFound} /></Switch>; }
