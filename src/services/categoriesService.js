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

function updateCategoryLabel(nodes, targetId, newLabel) {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return { ...node, label: newLabel.trim() };
    }
    if (node.children?.length) {
      return {
        ...node,
        children: updateCategoryLabel(node.children, targetId, newLabel),
      };
    }
    return node;
  });
}

function removeCategory(nodes, targetId) {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children ? removeCategory(node.children, targetId) : [],
    }));
}

export const categoriesService = {
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

  async renameCategory(id, newLabel) {
    try {
      const categories = await this.getCategories();
      const updated = updateCategoryLabel(categories, id, newLabel);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new Error('Не вдалося перейменувати папку.', { cause: error });
    }
  },

  async deleteCategory(id) {
    try {
      const categories = await this.getCategories();
      const updated = removeCategory(categories, id);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new Error('Не вдалося видалити папку.', { cause: error });
    }
  },
};