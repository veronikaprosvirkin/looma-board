import { useState, useEffect, useMemo } from 'react';
import { postsService } from '../services/postsService';
import PostCard from '../components/board/PostCard';
import './BoardPage.scss';

export default function BoardPage({ selectedCategory = 'all' }) {

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'memory' | 'plan'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'calendar'

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const data = await postsService.getAllPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Помилка завантаження постів');
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, statusFilter, searchQuery]);

  // 4. Конвеєр фільтрації та сортування (useMemo)
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.categoryPath?.includes(selectedCategory));
    }

    if (statusFilter !== 'all') {
      result = result.filter((post) => post.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) || post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [posts, selectedCategory, statusFilter, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredPosts.length / 10);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * 10, currentPage * 10);

  if (isLoading) return <div className="board-page">Завантаження записів...</div>;

  return (
    <div className="board-page">
      {error && <div className="board-page__error">{error}</div>}
      <div className="board-toolbar">
        <div className="board-toolbar__left">
        <input type="search" placeholder="Пошук за назвою, описом, тегами..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        />

        <button
        type="button"
        className={statusFilter === 'all' ? 'active' : ''}
        onClick={() => setStatusFilter('all')}>
          Усі
        </button>

        <button
        type="button"
        className={statusFilter === 'memory' ? 'active' : ''}
        onClick={() => setStatusFilter('memory')}>
          Спогади
        </button>

        <button
        type="button"
        className={statusFilter === 'plan' ? 'active' : ''}
        onClick={() => setStatusFilter('plan')}>
          Плани
        </button>
        </div>

        <div className="board-toolbar__right">
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Спочатку нові</option>
          <option value="oldest">Спочатку старі</option>
        </select>

        <button
        type="button"
        className={viewMode === 'calendar' ? 'active' : ''}
        onClick={() => setViewMode('calendar')}>
          Calendar View
        </button>

        <button
        type="button"
        className={viewMode === 'feed' ? 'active' : ''}
        onClick={() => setViewMode('feed')}>
          Feed View
        </button>
        </div>
      </div>

      {viewMode === 'feed' && (
        <>
          <div className="board-feed-grid">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}/>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {viewMode === 'calendar' && (
        <div className="board-calendar-placeholder">
          Тут буде календар (знайдено {filteredPosts.length} записів)
        </div>
      )}
    </div>
  );
}