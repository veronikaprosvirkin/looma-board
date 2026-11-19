import { useEffect } from 'react';
import './Modal.scss';

export default function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card__header">
          <h4>{title}</h4>
          <button type="button" className="modal-card__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  );
}