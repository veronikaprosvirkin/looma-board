import { useState } from 'react';
import Modal from '../ui/Modal';
import './PostPreviewModal.scss';
import {exportPostCard} from '../../utils/exportPostCard';

export default function PostPreviewModal({ post, onClose, onDelete, onEdit }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleClose = () => {
    setShowShareMenu(false);
    setIsCopied(false);
    onClose?.();
  };

  const shareText = post
    ? `${post.title} (${post.date})\n${post.description || ''}${
        post.location ? `\n📍 ${post.location}` : ''
      }`
    : '';

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(window.location.href);

  const shareLinks = {
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    threads: `https://www.threads.net/intent/post?text=${encodedText}`,
    viber: `viber://forward?text=${encodedText}`,
};

  const handleOpenSocial = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
    }
  };

  return (
    <Modal
      isOpen={Boolean(post)}
      title={post?.title || ''}
      onClose={handleClose}
    >
      {post?.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="post-preview__image"
        />
      )}

      <div className="post-preview__meta">
        <span className={post?.status === 'memory' ? 'is-memory' : 'is-plan'}>
          {post?.status === 'memory' ? '• Спогад' : '• План'}
        </span>
        <span>{post?.date}</span>
      </div>

      {post?.location && (
        <p className="post-preview__location">📍 {post.location}</p>
      )}

      <p className="post-preview__description">{post?.description}</p>

      {post?.tags?.length > 0 && (
        <div className="post-preview__tags">
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      {post?.location && (
        <iframe
          title={post.location}
          width="100%"
          height="200"
          style={{ border: 0, borderRadius: '10px' }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(post.location)}&output=embed`}
        />
      )}

      {showShareMenu && (
        <div className="post-preview__share-panel">
          <button
            type="button"
            onClick={() => handleOpenSocial(shareLinks.telegram)}
          >
            Telegram
          </button>
          <button
            type="button"
            onClick={() => handleOpenSocial(shareLinks.threads)}
          >
            Threads
          </button>
          <button
            type="button"
            onClick={() => handleOpenSocial(shareLinks.viber)}
          >
            Viber
          </button>
          <button type="button" onClick={handleCopyText}>
            {isCopied ? 'Скопійовано! ✓' : 'Копіювати текст'}
          </button>
          <button type="button" onClick={() => exportPostCard(post)}>
            Зберегти PNG
        </button>
        </div>
      )}

      <div className="modal-card__actions">
        {onDelete && (
          <button
            type="button"
            className="is-danger"
            onClick={() => onDelete(post)}
          >
            Видалити
          </button>
        )}

        {onEdit && (
          <button type="button" onClick={() => onEdit(post)}>
            Редагувати
          </button>
        )}

        <button
          type="button"
          className="is-primary"
          onClick={() => setShowShareMenu((prev) => !prev)}
        >
          {showShareMenu ? 'Згорнути' : 'Поділитися'}
        </button>

        <button type="button" onClick={handleClose}>
          Закрити
        </button>
      </div>
    </Modal>
  );
}