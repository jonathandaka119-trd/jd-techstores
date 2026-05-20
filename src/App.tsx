import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { PageLoader, Spinner } from './components/ui'

import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages'
import { CartPage, CheckoutPage, OrderConfirmationPage } from './pages/CartCheckoutPages'
import { ShippingPage, ReturnsPage, PrivacyPage, TermsPage } from './pages/PolicyPages'
import { StorekeeperDashboard } from './pages/StorekeeperPages'
import CompareBar from './components/CompareBar'

const HomePage          = lazy(() => import('./pages/HomePage'))
const ProductsPage      = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CategoryPage      = lazy(() => import('./pages/CategoryPage'))
const SearchPage        = lazy(() => import('./pages/SearchPage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))
const ContactPage       = lazy(() => import('./pages/ContactPage'))
const FAQPage           = lazy(() => import('./pages/FAQPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const WishlistPage      = lazy(() => import('./pages/WishlistPage'))
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'))
const ComparePage       = lazy(() => import('./pages/ComparePage'))

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'storekeeper' }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner size="lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />
  if (requiredRole === 'storekeeper' && !['admin', 'storekeeper'].includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Header />
      <CartDrawer />
      <main className="flex-1 page-enter">{children}</main>
      <Footer />
      <CompareBar />
    </div>
  )
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1A1A1A', color: '#fff', border: '1px solid #333' },
            success: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"           element={<Layout><HomePage /></Layout>} />
            <Route path="/products"   element={<Layout><ProductsPage /></Layout>} />
            <Route path="/product/:slug" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/search"     element={<Layout><SearchPage /></Layout>} />
            <Route path="/about"      element={<Layout><AboutPage /></Layout>} />
            <Route path="/contact"    element={<Layout><ContactPage /></Layout>} />
            <Route path="/faq"        element={<Layout><FAQPage /></Layout>} />
            <Route path="/shipping"   element={<Layout><ShippingPage /></Layout>} />
            <Route path="/returns"    element={<Layout><ReturnsPage /></Layout>} />
            <Route path="/privacy"    element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/terms"      element={<Layout><TermsPage /></Layout>} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/cart"       element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout"   element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
            <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><Layout><OrderConfirmationPage /></Layout></ProtectedRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            <Route path="/wishlist"   element={<ProtectedRoute><Layout><WishlistPage /></Layout></ProtectedRoute>} />
            <Route path="/compare"    element={<Layout><ComparePage /></Layout>} />
            <Route path="/admin/*"    element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/storekeeper/*" element={<ProtectedRoute requiredRole="storekeeper"><AdminLayout><StorekeeperDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
