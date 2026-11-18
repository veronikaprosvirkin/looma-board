import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSeasonTheme } from '../../hooks/useSeasonTheme';
import initialPosts from '../../data/mockPosts.json';
import './Header.scss';

export default function Header() {
  const { theme, setTheme } = useSeasonTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const memoryPhotos = initialPosts.filter((post) => post.imageUrl);
  const marqueeItems = [...memoryPhotos, ...memoryPhotos];

  return (
    <header className="header">
      <div className="header__marquee">
        <span className="header__marquee-badge">FEATURED MEMORIES</span>
        <div className="header__marquee-track">
          {marqueeItems.map((post, idx) => (
            <div className="header__marquee-card" key={`${post.id}-${idx}`}>
              <img src={post.imageUrl} alt={post.title} />
              <div className="header__marquee-caption">
                <span>{post.date}</span>
                <strong>{post.title}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="header__bar">
        <Link className="header__logo" to="/">
          <span className="header__logo-dot" />
          LoomaBoard
        </Link>

        <nav className="header__nav">
          <ul className="header__menu">
            <li
              className="header__menu-item"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <NavLink to="/" end>
                Дошка ▾
              </NavLink>
              {isMenuOpen && (
                <ul className="header__submenu">
                  <li>
                    <Link to="/?status=all" onClick={() => setIsMenuOpen(false)}>
                      Усі записи
                    </Link>
                  </li>
                  <li>
                    <Link to="/?status=memory" onClick={() => setIsMenuOpen(false)}>
                      Спогади
                    </Link>
                  </li>
                  <li>
                    <Link to="/?status=plan" onClick={() => setIsMenuOpen(false)}>
                      Плани
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="header__menu-item">
              <NavLink to="/gallery">Галерея 300×300</NavLink>
            </li>

            <li className="header__menu-item">
              <NavLink to="/contacts">Контакти</NavLink>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <select
            className="header__season-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Оберіть пору року"
          >
            <option value="auto">Авто-сезон</option>
            <option value="autumn">🍂 Осінь</option>
            <option value="winter">❄️ Зима</option>
            <option value="spring">🌸 Весна</option>
            <option value="summer">☀️ Літо</option>
          </select>

          <NavLink className="header__auth-btn" to="/auth">
            Увійти
          </NavLink>
        </div>
      </div>
    </header>
  );
}