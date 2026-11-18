import initialPosts from '../data/mockPosts.json';

const STORAGE_KEY = 'looma_board_posts';

export const postsService = {
  async getAllPosts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
      return initialPosts;
    } catch (error) {
      console.error('Помилка завантаження постів:', error);
      throw new Error('Не вдалося завантажити дані дошки.');
    }
  },

  async createPost(newPost) {
    try {
      const posts = await this.getAllPosts();
      const postWithId = {
        ...newPost,
        id: `post-${Date.now()}`,
      };
      const updated = [postWithId, ...posts];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return postWithId;
    } catch (error) {
      console.error('Помилка створення поста:', error);
      throw new Error('Не вдалося зберегти запис.');
    }
  },

  async updatePostStatus(id, status) {
    try {
      const posts = await this.getAllPosts();
      const updated = posts.map((post) =>
        post.id === id ? { ...post, status } : post
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Помилка оновлення статусу:', error);
      throw new Error('Не вдалося оновити статус події.');
    }
  },
};