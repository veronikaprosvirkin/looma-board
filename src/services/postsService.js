import initialPosts from '../data/mockPosts.json';

const POSTS_KEY = 'looma_board_posts';

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

  async deletePost(id) {
    try {
      const posts = await this.getAllPosts();
      const updated = posts.filter((post) => post.id !== id);
      localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new Error('Не вдалося видалити запис.', { cause: error });
    }
  },
};