import { useState, useEffect } from 'react';
import { postsService } from '../../services/postsService';
import {categoriesService} from '../../services/categoriesService';
import Modal from '../ui/Modal';
import './Sidebar.scss';

function CategoryNode({
  node,
  level,
  selectedCategory,
  onSelectCategory,
  onAddSubcategory,
  onOpenRename,
  onOpenDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isActionOpen, setIsActionOpen] = useState(false);

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
    setIsActionOpen(false);
  };

  const handleRenameClick = (e) => {
    e.stopPropagation();
    onOpenRename(node.id, node.label);
    setIsActionOpen(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onOpenDelete(node.id, node.label);
    setIsActionOpen(false);
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
              <button type="button" onClick={handleCreateChild}>
                + Підпапка
              </button>
              <button type="button" onClick={handleRenameClick}>
                Перейменувати
              </button>
              <button type="button" className="is-danger" onClick={handleDeleteClick}>
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
              onOpenRename={onOpenRename}
              onOpenDelete={onOpenDelete}
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
  const [modalData, setModalData] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedCategories, loadedPosts] = await Promise.all([
          categoriesService.getCategories(),
          postsService.getAllPosts(),
        ]);
        setCategories(loadedCategories);
        setPosts(loadedPosts);
      } catch (err) {
        setErrorMessage(err.message || 'Помилка завантаження даних');
      }
    }
    loadData();
  }, []);

  const openDeleteModal = (id, label) => {
    setModalData({ type: 'delete', id, label });
  };

  const openRenameModal = (id, label) => {
    setRenameValue(label);
    setModalData({ type: 'rename', id, label });
  };

  const handleOpenCreate = (parentId = null, parentLabel = 'Кореневий розділ') => {
    setCreatingFor({ parentId, parentLabel });
    setNewFolderName('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const updated = await categoriesService.addCategory(newFolderName, creatingFor.parentId);
      setCategories(updated);
      setCreatingFor(null);
      setNewFolderName('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRenameSubmit = async () => {
    if (!renameValue.trim() || !modalData) return;
    try {
      const updated = await categoriesService.renameCategory(modalData.id, renameValue);
      setCategories(updated);
      setModalData(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modalData) return;
    try {
      const updated = await categoriesService.deleteCategory(modalData.id);
      setCategories(updated);
      if (selectedCategory === modalData.id) {
        onSelectCategory('all');
      }
      setModalData(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
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

        {/* Кастомний банер помилки */}
        {errorMessage && (
          <div className="sidebar__error-banner">
            <span>{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage('')}>
              ✕
            </button>
          </div>
        )}

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
              onOpenRename={openRenameModal}
              onOpenDelete={openDeleteModal}
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

      <Modal
        isOpen={Boolean(modalData)}
        title={modalData?.type === 'delete' ? 'Видалити папку?' : 'Перейменувати папку'}
        onClose={() => setModalData(null)}
      >
        {modalData?.type === 'delete' && (
          <>
            <p>
              Ви впевнені, що хочете видалити папку <strong>«{modalData.label}»</strong> та всі
              вкладені в неї підпапки?
            </p>
            <div className="modal-card__actions">
              <button type="button" onClick={() => setModalData(null)}>
                Скасувати
              </button>
              <button type="button" className="is-danger" onClick={handleDeleteConfirm}>
                Так, видалити
              </button>
            </div>
          </>
        )}

        {modalData?.type === 'rename' && (
          <>
            <p>Нова назва для «{modalData.label}»:</p>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && renameValue.trim()) {
                  handleRenameSubmit();
                }
              }}
              autoFocus
            />
            {!renameValue.trim() && (
              <p className="modal-card__error">Назва не може бути порожньою.</p>
            )}
            <div className="modal-card__actions">
              <button type="button" onClick={() => setModalData(null)}>
                Скасувати
              </button>
              <button
                type="button"
                className="is-primary"
                disabled={!renameValue.trim()}
                onClick={handleRenameSubmit}
              >
                Зберегти
              </button>
            </div>
          </>
        )}
      </Modal>
    </aside>
  );
}