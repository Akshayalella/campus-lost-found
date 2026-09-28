import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import Items from './pages/Items.jsx';
import AddItem from './pages/AddItem.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/student-dashboard" element={<RoleRoute roles={['Student']}><StudentDashboard /></RoleRoute>} />
          <Route path="/faculty-dashboard" element={<RoleRoute roles={['Faculty']}><FacultyDashboard /></RoleRoute>} />
          <Route path="/owner-dashboard" element={<RoleRoute roles={['Owner']}><OwnerDashboard /></RoleRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Lost &amp; Found</p>
      </footer>
    </div>
  );
}
