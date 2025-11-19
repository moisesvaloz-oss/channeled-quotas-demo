import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotaManagement from './pages/QuotaManagement';
import Businesses from './pages/Businesses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quota-management" element={<QuotaManagement />} />
        <Route path="/businesses" element={<Businesses />} />
      </Routes>
    </Router>
  );
}

export default App;
