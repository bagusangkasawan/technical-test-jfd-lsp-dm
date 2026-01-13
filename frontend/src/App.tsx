import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import InventoryPage from './pages/InventoryPage';
import UserManagementPage from './pages/UserManagementPage';
import Notification from './components/Notification';

// Root app component dengan routing dan notification system
const App: React.FC = () => {
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Tampilkan notifikasi dengan auto-dismiss setelah 3 detik
  const notify = (msg: string, type: 'success'|'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Router>
      {notification && (
        <Notification 
          message={notification.msg} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<InventoryPage notify={notify} />} />
          <Route path="users" element={<UserManagementPage notify={notify} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
