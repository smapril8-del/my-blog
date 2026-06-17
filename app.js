var api = {
  base: '/api/messages',

  getAll: async function() {
    var res = await fetch(this.base);
    if (!res.ok) throw new Error('加载失败');
    return res.json();
  },

  add: async function(memo) {
    var res = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memo)
    });
    if (!res.ok) throw new Error('保存失败');
    return res.json();
  },

  update: async function(id, data) {
    var res = await fetch(this.base, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, content: data.content, starred: data.starred })
    });
    if (!res.ok) throw new Error('更新失败');
    return res.json();
  },

  remove: async function(id) {
    var res = await fetch(this.base + '?id=' + id, { method: 'DELETE' });
    if (!res.ok) throw new Error('删除失败');
  }
};

function formatTime(dateStr) {
  var d = new Date(dateStr);
  var now = new Date();
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  var time = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

  if (d.toDateString() === now.toDateString()) return '今天 ' + time;

  var yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return '昨天 ' + time;

  return d.getFullYear() + '-' + month + '-' + day + ' ' + time;
}
