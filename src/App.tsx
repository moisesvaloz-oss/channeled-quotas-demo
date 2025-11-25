import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuotaManagement from './pages/QuotaManagement';
import Businesses from './pages/Businesses';
import ReservationsOverview from './pages/ReservationsOverview';
import MakeReservation from './pages/MakeReservation';
import SelectEvent from './pages/SelectEvent';
import TicketSelection from './pages/TicketSelection';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ReservationConfirmation from './pages/ReservationConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quota-management" element={<QuotaManagement />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/reservations/overview" element={<ReservationsOverview />} />
        <Route path="/reservations/create" element={<MakeReservation />} />
        <Route path="/reservations/create/event" element={<SelectEvent />} />
        <Route path="/reservations/create/tickets" element={<TicketSelection />} />
        <Route path="/reservations/create/checkout" element={<Checkout />} />
        <Route path="/reservations/create/payment" element={<Payment />} />
        <Route path="/reservations/confirmation" element={<ReservationConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
