import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import BoardPage from './pages/BoardPage';
import GalleryPage from './pages/GalleryPage';
import ContactsPage from './pages/ContactsPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<BoardPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;