import { useState, useEffect } from 'react';
import { postsService } from '../../services/postsService';
import './Sidebar.scss';

function CategoryNode({ node, level, selectedCategory, onSelectCategory, onAddSubcategory, onRenameCategory, onDeleteCategory }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isActive = selectedCategory === node.id;
  const [isActionOpen, setIsActionOpen] = useState(false);

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

  const handleRename = (e) => {
    e.stopPropagation();
    const newLabel = prompt('Введіть нову назву папки:', node.label);
    if (newLabel !== null) {
      onRenameCategory(node.id, newLabel);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цю папку?')) {
      onDeleteCategory(node.id);
    }
  };

  return (
    <li className="sidebar__node">
      <div
        className={`sidebar__item ${isActive ? 'is-active' : ''}`}
        style={{ '--level': level }}
        onClick={handleSelect}
        onMouseLeave={() => setIsActionOpen(false)}
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

        <div className="sidebar__actions">
          <button
            type="button"
            className="sidebar__dots-btn"
            title="Дії з папкою"
            onClick={(e) => {
              e.stopPropagation();
              setIsActionOpen((prev) => !prev);
            }}
          >
            ⋯
          </button>

          {isActionOpen && (
            <div className="sidebar__dropdown">
              <button
                type="button"
                onClick={(e) => {
                  handleCreateChild(e);
                  setIsActionOpen(false);
                }}
              >
                + Підпапка
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleRename(e);
                  setIsActionOpen(false);
                }}
              >
                Перейменувати
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={(e) => {
                  handleDelete(e);
                  setIsActionOpen(false);
                }}
              >
                Видалити
              </button>
            </div>
          )}
        </div>
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
              onRenameCategory={onRenameCategory}
              onDeleteCategory={onDeleteCategory}
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

  const handleRenameCategory = async (id, newLabel) => {
    const updated = await postsService.renameCategory(id, newLabel);
    setCategories(updated);
  }

  const handleDeleteCategory = async (id) => {
    const updated = await postsService.deleteCategory(id);
    setCategories(updated);
    if (selectedCategory === id) {
      onSelectCategory('all');
    }
  }

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
              onRenameCategory={handleRenameCategory}
              onDeleteCategory={handleDeleteCategory}
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