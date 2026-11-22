import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useAuth } from './auth.jsx';
import Browse from './pages/Browse.jsx';
import ReportDetail from './pages/ReportDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ReportForm from './pages/ReportForm.jsx';
import MyReports from './pages/MyReports.jsx';
import MyClaims from './pages/MyClaims.jsx';
import AdminClaims from './pages/AdminClaims.jsx';

function Protected({ children, admin }) {
  const { user, ready } = useAuth();
  if (!ready) return <p role="status">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report/new" element={<Protected><ReportForm /></Protected>} />
        <Route path="/report/:id/edit" element={<Protected><ReportForm /></Protected>} />
        <Route path="/my-reports" element={<Protected><MyReports /></Protected>} />
        <Route path="/my-claims" element={<Protected><MyClaims /></Protected>} />
        <Route path="/admin" element={<Protected admin><AdminClaims /></Protected>} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </Layout>
  );
}
