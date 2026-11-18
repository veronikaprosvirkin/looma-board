import initialPosts from '../data/mockPosts.json';

const POSTS_KEY = 'looma_board_posts';
const CATEGORIES_KEY = 'looma_board_categories';

const DEFAULT_CATEGORIES = [
  {
    id: 'travel',
    label: 'Подорожі',
    children: [
      {
        id: '2026',
        label: '2026 рік',
        children: [{ id: 'mountains', label: 'Гори' }],
      },
    ],
  },
  { id: 'personal', label: 'Особисте', children: [] },
  { id: 'study', label: 'Навчання', children: [] },
];

function insertSubcategory(nodes, parentId, newNode) {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children?.length) {
      return {
        ...node,
        children: insertSubcategory(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

export const postsService = {
  async getAllPosts() {
    try {
      const saved = localStorage.getItem(POSTS_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
      return initialPosts;
    } catch (error) {
      throw new Error('Не вдалося завантажити пости.', { cause: error });
    }
  },

  async createPost(newPost) {
    try {
      const posts = await this.getAllPosts();
      const postWithId = { ...newPost, id: `post-${Date.now()}` };
      const updated = [postWithId, ...posts];
      localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
      return postWithId;
    } catch (error) {
      throw new Error('Не вдалося зберегти запис.', { cause: error });
    }
  },

  async getCategories() {
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    } catch (error) {
      throw new Error('Не вдалося завантажити категорії.', { cause: error });
    }
  },

  async addCategory(label, parentId = null) {
    try {
      const categories = await this.getCategories();
      const newCategory = {
        id: `cat-${Date.now()}`,
        label: label.trim(),
        children: [],
      };

      const updated = parentId
        ? insertSubcategory(categories, parentId, newCategory)
        : [...categories, newCategory];

      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new Error('Не вдалося створити папку.', { cause: error });
    }
  },
};