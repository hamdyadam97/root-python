import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/router/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { SignupPage } from '@/pages/auth/SignupPage';
import { VerifyOtpPage } from '@/pages/auth/VerifyOtpPage';
import { ForgetPage } from '@/pages/auth/ForgetPage';
import { OtpPage } from '@/pages/auth/OtpPage';
import { ResetPage } from '@/pages/auth/ResetPage';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/about/AboutPage';
import { PackagesPage } from '@/pages/public/PackagesPage';
import { PackagesCategoryPage } from '@/pages/public/PackagesCategoryPage';
import { BlogsPage } from '@/pages/public/BlogsPage';
import { BlogDetailPage } from '@/pages/public/BlogDetailPage';
import { InstructorsPage } from '@/pages/public/InstructorsPage';
import { CoursesPage } from '@/pages/public/CoursesPage';
import { ExamsPage } from '@/pages/public/ExamsPage';
import { ExamDetailPage } from '@/pages/public/ExamDetailPage';
import { CertificatesPage } from '@/pages/public/CertificatesPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ExamListPage } from '@/pages/dashboard/ExamListPage';
import { ExamCreatePage } from '@/pages/dashboard/ExamCreatePage';
import { ExamShowPage } from '@/pages/dashboard/ExamShowPage';
import { ExamResultPage } from '@/pages/dashboard/ExamResultPage';
import { UserPackagesPage } from '@/pages/dashboard/UserPackagesPage';
import { SubscriptionsPage } from '@/pages/dashboard/SubscriptionsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

function MainLayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function DashboardLayoutWrapper() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}

function ExamShowWrapper() {
  return (
    <ProtectedRoute>
      <ExamShowPage />
    </ProtectedRoute>
  );
}

function ExamResultWrapper() {
  return (
    <ProtectedRoute>
      <ExamResultPage />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/category/:id" element={<PackagesCategoryPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:id" element={<ExamDetailPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtpPage /></PublicRoute>} />
        <Route path="/forget" element={<PublicRoute><ForgetPage /></PublicRoute>} />
        <Route path="/otp" element={<PublicRoute><OtpPage /></PublicRoute>} />
        <Route path="/reset" element={<PublicRoute><ResetPage /></PublicRoute>} />

        {/* Full-screen exam routes */}
        <Route path="/user/exam/:id/show" element={<ExamShowWrapper />} />
        <Route path="/user/exam/:id/result" element={<ExamResultWrapper />} />

        {/* Dashboard routes */}
        <Route element={<DashboardLayoutWrapper />}>
          <Route path="/user/dashboard" element={<DashboardPage />} />
          <Route path="/user/exam" element={<ExamListPage />} />
          <Route path="/user/exam/create" element={<ExamCreatePage />} />
          <Route path="/user/packages" element={<UserPackagesPage />} />
          <Route path="/user/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/user/settings" element={<SettingsPage />} />
          <Route path="/user/support" element={<SupportPage />} />
        </Route>

      </Routes>
      <AuthModal />
    </>
  );
}
