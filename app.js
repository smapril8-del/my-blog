var BlogStore = {
  KEY: 'blog_posts',

  getAll: function() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveAll: function(posts) {
    localStorage.setItem(this.KEY, JSON.stringify(posts));
  },

  getById: function(id) {
    return this.getAll().find(function(p) { return p.id === id; }) || null;
  },

  create: function(post) {
    var posts = this.getAll();
    post.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    post.createdAt = new Date().toISOString();
    post.updatedAt = post.createdAt;
    post.excerpt = post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '').slice(0, 150);
    posts.push(post);
    this.saveAll(posts);
    return post;
  },

  update: function(id, data) {
    var posts = this.getAll();
    var idx = posts.findIndex(function(p) { return p.id === id; });
    if (idx === -1) return null;
    if (data.title !== undefined) posts[idx].title = data.title;
    if (data.content !== undefined) {
      posts[idx].content = data.content;
      posts[idx].excerpt = data.content.slice(0, 150).replace(/<[^>]*>/g, '').slice(0, 150);
    }
    posts[idx].updatedAt = new Date().toISOString();
    this.saveAll(posts);
    return posts[idx];
  },

  remove: function(id) {
    var posts = this.getAll().filter(function(p) { return p.id !== id; });
    this.saveAll(posts);
  }
};

function formatDate(dateStr) {
  var d = new Date(dateStr);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
