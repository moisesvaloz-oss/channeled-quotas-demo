import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotaManagement from './pages/QuotaManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quota-management" element={<QuotaManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
