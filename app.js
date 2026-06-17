var MemoStore = {
  KEY: 'memo_messages',

  getAll: function() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveAll: function(messages) {
    localStorage.setItem(this.KEY, JSON.stringify(messages));
  },

  add: function(msg) {
    var messages = this.getAll();
    msg.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    msg.createdAt = new Date().toISOString();
    msg.starred = false;
    messages.push(msg);
    this.saveAll(messages);
    return msg;
  },

  remove: function(id) {
    var messages = this.getAll().filter(function(m) { return m.id !== id; });
    this.saveAll(messages);
  },

  toggleStar: function(id) {
    var messages = this.getAll();
    var m = messages.find(function(item) { return item.id === id; });
    if (m) {
      m.starred = !m.starred;
      this.saveAll(messages);
    }
    return m;
  },

  update: function(id, text) {
    var messages = this.getAll();
    var m = messages.find(function(item) { return item.id === id; });
    if (m) {
      m.content = text;
      this.saveAll(messages);
    }
    return m;
  }
};

function formatTime(dateStr) {
  var d = new Date(dateStr);
  var now = new Date();
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  var time = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

  if (d.toDateString() === now.toDateString()) {
    return time;
  }

  var yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + time;
  }

  return d.getFullYear() + '-' + month + '-' + day + ' ' + time;
}
