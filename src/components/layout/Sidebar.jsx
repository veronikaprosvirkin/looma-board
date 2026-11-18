import { useState, useEffect } from 'react';
import { postsService } from '../../services/postsService';
import './Sidebar.scss';

function CategoryNode({ node, level, selectedCategory, onSelectCategory, onAddSubcategory }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isActive = selectedCategory === node.id;

  const handleSelect = () => {
    onSelectCategory(node.id);
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  };

  const handleCreateChild = (e) => {
    e.stopPropagation();
    onAddSubcategory(node.id, node.label);
    setIsExpanded(true);
  };

  return (
    <li className="sidebar__node">
      <div
        className={`sidebar__item ${isActive ? 'is-active' : ''}`}
        style={{ '--level': level }}
        onClick={handleSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
      >
        <span className="sidebar__item-left">
          <span className="sidebar__arrow">
            {hasChildren ? (isExpanded ? '▾' : '▸') : '•'}
          </span>
          <span className="sidebar__label">{node.label}</span>
        </span>

        <button
          type="button"
          className="sidebar__add-sub-btn"
          title={`Додати підпапку в «${node.label}»`}
          onClick={handleCreateChild}
        >
          +
        </button>
      </div>

      {hasChildren && isExpanded && (
        <ul className="sidebar__sublist">
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onAddSubcategory={onAddSubcategory}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({ selectedCategory = 'all', onSelectCategory = () => {} }) {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [creatingFor, setCreatingFor] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    async function loadData() {
      const [loadedCategories, loadedPosts] = await Promise.all([
        postsService.getCategories(),
        postsService.getAllPosts(),
      ]);
      setCategories(loadedCategories);
      setPosts(loadedPosts);
    }
    loadData();
  }, []);

  const handleOpenCreate = (parentId = null, parentLabel = 'Кореневий розділ') => {
    setCreatingFor({ parentId, parentLabel });
    setNewFolderName('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const updated = await postsService.addCategory(newFolderName, creatingFor.parentId);
    setCategories(updated);
    setCreatingFor(null);
    setNewFolderName('');
  };

  const memoriesCount = posts.filter((p) => p.status === 'memory').length;
  const plansCount = posts.filter((p) => p.status === 'plan').length;

  return (
    <aside className="sidebar">
      <div className="sidebar__scroll-area">
        <div className="sidebar__header-row">
          <span className="sidebar__section-title">КОЛЕКЦІЇ</span>
          <button
            type="button"
            className="sidebar__new-root-btn"
            onClick={() => handleOpenCreate(null)}
            title="Створити нову папку"
          >
            + Папка
          </button>
        </div>

        {creatingFor && (
          <form className="sidebar__create-form" onSubmit={handleCreateSubmit}>
            <span className="sidebar__create-hint">У: {creatingFor.parentLabel}</span>
            <input
              type="text"
              placeholder="Назва папки..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <div className="sidebar__create-actions">
              <button type="submit">Додати</button>
              <button type="button" onClick={() => setCreatingFor(null)}>
                ✕
              </button>
            </div>
          </form>
        )}

        <ul className="sidebar__list">
          <li className="sidebar__node">
            <div
              className={`sidebar__item ${selectedCategory === 'all' ? 'is-active' : ''}`}
              style={{ '--level': 0 }}
              onClick={() => onSelectCategory('all')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCategory('all')}
            >
              <span className="sidebar__item-left">
                <span className="sidebar__arrow">◈</span>
                <span className="sidebar__label">Усі записи</span>
              </span>
              <span className="sidebar__count">{posts.length}</span>
            </div>
          </li>

          {categories.map((node) => (
            <CategoryNode
              key={node.id}
              node={node}
              level={0}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onAddSubcategory={handleOpenCreate}
            />
          ))}
        </ul>
      </div>

      <div className="sidebar__legend">
        <div className="sidebar__section-title">ЛЕГЕНДА</div>
        <div className="sidebar__legend-row">
          <span>
            <i className="dot dot--memory" /> Минуле • Спогади
          </span>
          <strong>{memoriesCount}</strong>
        </div>
        <div className="sidebar__legend-row">
          <span>
            <i className="dot dot--plan" /> Майбутнє • Плани
          </span>
          <strong>{plansCount}</strong>
        </div>
      </div>
    </aside>
  );
}