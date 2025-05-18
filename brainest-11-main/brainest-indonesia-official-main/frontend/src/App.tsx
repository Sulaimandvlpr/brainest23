import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/dashboard/Dashboard";
import Packages from "./pages/dashboard/Packages";
import History from "./pages/dashboard/History";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import TryoutLive from "./pages/dashboard/TryoutLive";
import LeaderboardXP from "./pages/dashboard/LeaderboardXP";
import ActivityLog from "./pages/dashboard/ActivityLog";
import DashboardGuru from "./pages/dashboard/DashboardGuru";

import ExamInterface from "./components/exam/ExamInterface";
import ExamResult from "./components/exam/ExamResult";

// Admin Panel Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Questions from "./pages/admin/Questions";
import QuestionCreate from "./pages/admin/QuestionCreate";
import TryoutPackages from "./pages/admin/TryoutPackages";
import PackageCreate from "./pages/admin/PackageCreate";
import UserManagement from "./pages/admin/UserManagement";
import Statistics from "./pages/admin/Statistics";
import AdminSettings from "./pages/admin/AdminSettings";
import UserCreate from "./pages/admin/UserCreate";
import AnnouncementCreate from "./pages/admin/AnnouncementCreate";

import SpaceBackground from "./components/three/SpaceBackground";
import GuruLayout from "./components/layout/GuruLayout";
import GuruQuestions from "./pages/guru/GuruQuestions";
import GuruQuestionCreate from "./pages/guru/GuruQuestionCreate";
import GuruStatistics from "./pages/guru/GuruStatistics";
import GuruSettings from "./pages/guru/GuruSettings";
import GuruLeaderboard from "./pages/guru/GuruLeaderboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SpaceBackground />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="packages" element={<Packages />} />
                <Route path="tryout-live" element={<TryoutLive />} />
                <Route path="history" element={<History />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="leaderboard-xp" element={<LeaderboardXP />} />
                <Route path="activity-log" element={<ActivityLog />} />
              </Route>
              
              {/* Admin Panel Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="questions" element={<Questions />} />
                <Route path="questions/create" element={<QuestionCreate />} />
                <Route path="packages" element={<TryoutPackages />} />
                <Route path="packages/create" element={<PackageCreate />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/create" element={<UserCreate />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="leaderboard" element={<LeaderboardXP />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="announcements/create" element={<AnnouncementCreate />} />
              </Route>

              <Route path="/exam/:id" element={<ExamInterface />} />
              <Route path="/exam/result/:id" element={<ExamResult />} />
              
              {/* Guru Panel Routes */}
              <Route path="/guru" element={<GuruLayout />}>
                <Route index element={<Navigate to="/guru/statistics" replace />} />
                <Route path="questions" element={<GuruQuestions />} />
                <Route path="questions/create" element={<GuruQuestionCreate />} />
                <Route path="statistics" element={<GuruStatistics />} />
                <Route path="settings" element={<GuruSettings />} />
                <Route path="leaderboard" element={<GuruLeaderboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
