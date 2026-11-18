import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSeasonTheme } from '../../hooks/useSeasonTheme';
import initialPosts from '../../data/mockPosts.json';
import './Header.scss';

export default function Header() {
  const { theme, setTheme } = useSeasonTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = initialPosts.filter((post) => post.status === 'memory').slice(0, 4);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[slideIndex];

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <header className="header">
      {currentSlide && (
        <div className="header__slider">
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            className="header__slider-img"
          />
          <div className="header__slider-info">
            <span className="header__slider-badge">Спогад дня • {currentSlide.date}</span>
            <p className="header__slider-title">{currentSlide.title}</p>
          </div>
          <div className="header__slider-controls">
            <button type="button" onClick={handlePrevSlide} aria-label="Попередній слайд">
              ‹
            </button>
            <button type="button" onClick={handleNextSlide} aria-label="Наступний слайд">
              ›
            </button>
          </div>
        </div>
      )}

      <div className="header__bar">
        <Link className="header__logo" to="/">
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
            <option value="autumn">Осінь</option>
            <option value="winter">Зима</option>
            <option value="spring">Весна</option>
            <option value="summer">Літо</option>
          </select>

          <NavLink className="header__auth-btn" to="/auth">
            Увійти
          </NavLink>
        </div>
      </div>
    </header>
  );
}