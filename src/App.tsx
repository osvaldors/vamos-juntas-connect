import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminFAQ from "./pages/admin/AdminFAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="membros" element={<AdminMembers />} />
                <Route path="eventos" element={<AdminEvents />} />
                <Route path="livros" element={<AdminBooks />} />
                <Route path="parceiros" element={<AdminPartners />} />
                <Route path="faq" element={<AdminFAQ />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
