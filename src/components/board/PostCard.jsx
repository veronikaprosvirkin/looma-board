import './PostCard.scss';

export default function PostCard({ post, onSelect, onDelete }) {
    return (
        <article className="post-card" onClick={() => onSelect?.(post)}>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
            <div className="post-card__body">
            <div className="post-card__meta">
                <span className={post.status === 'memory' ? 'memory' : 'plan'}>
                    {post.status === 'memory' ? '• Спогад' : '• План'}
                </span>
                <p className="date">{post.date}</p>
            </div>
            <h3 className="title">{post.title}</h3>
            <p className="description">{post.description}</p>
            <div className="post-card__tags">
                {post.tags?.map((tag) => 
                    <span key={tag}>#{tag}</span>)}
            </div>
            
            <button
                type="button"
                className="delete-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(post);
                }}
            >
                Видалити
            </button>
            </div>
        </article>
        
    );
}