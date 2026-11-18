import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from '../ui/Breadcrumbs';
import './AppLayout.scss';

export default function AppLayout() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="app-shell">
      <Header />
      <div className="app-shell__body">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <main className="app-shell__main">
          <Breadcrumbs />
          <div className="app-shell__content">
            <Outlet context={{ selectedCategory, setSelectedCategory }} />
          </div>
        </main>
      </div>
    </div>
  );
}