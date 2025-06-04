
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoanApplication from "./pages/LoanApplication";
import LoanApplicationSuccess from "./pages/LoanApplicationSuccess";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PayLoan from './pages/PayLoan';
import About from './pages/About';
import CreditScore from './pages/CreditScoreCalculator'
import Chatbot from "./pages/Chatbot";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply" element={<LoanApplication />} />
          <Route path="/application-success" element={<LoanApplicationSuccess />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pay-loan/:reservationId" element={<PayLoan />} />
          <Route path="/about" element={<About />} />
          <Route path="/credit" element={<CreditScore />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
