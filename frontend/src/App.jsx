import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/providers/ThemeProvider'
import { NotificationProvider } from './components/providers/NotificationProvider'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Internships from './components/Internships'
import Resume from './components/Resume'
import Profile from './components/Profile'
import AppliedJobs from './components/AppliedJobs'
import JobDescription from './components/JobDescription'
import AdminDashboard from './components/admin/AdminDashboard'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import Analytics from './components/admin/Analytics'
import ProtectedRoute from './components/admin/ProtectedRoute'
// Footer pages
import AboutUs from './components/AboutUs'
import Contact from './components/Contact'
import Careers from './components/Careers'
import HelpCenter from './components/HelpCenter'
import PrivacyPolicy from './components/PrivacyPolicy'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/internships",
    element: <Internships />
  },
  {
    path: "/resume",
    element: <Resume />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/applied-jobs",
    element: <AppliedJobs />
  },
  // Footer pages
  {
    path: "/about",
    element: <AboutUs />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/careers",
    element: <Careers />
  },
  {
    path: "/help",
    element: <HelpCenter />
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />
  },
  {
    path: "/faqs",
    element: <HelpCenter />
  },
  {
    path: "/advice",
    element: <HelpCenter />
  },
  {
    path: "/report",
    element: <Contact />
  },
  {
    path: "/feedback",
    element: <Contact />
  },
  // admin ke liye yha se start hoga
  {
    path: "/admin",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path:"/admin/analytics",
    element:<ProtectedRoute><Analytics/></ProtectedRoute> 
  },
])

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <RouterProvider router={appRouter} />
    </div>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
