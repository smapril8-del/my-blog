const fs = require('fs');
const path = require('path');

const DATA_FILE = '/tmp/memos.json';

function readMemos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function writeMemos(memos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const memos = readMemos();
    memos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res.json(memos);
  }

  if (req.method === 'POST') {
    const { sender, content } = req.body || {};
    if (!content || !content.trim()) {
      return res.status(400).json({ error: '内容不能为空' });
    }
    const memos = readMemos();
    const memo = {
      id: generateId(),
      sender: sender || 'me',
      content: content.trim(),
      starred: false,
      createdAt: new Date().toISOString(),
    };
    memos.push(memo);
    writeMemos(memos);
    return res.status(201).json(memo);
  }

  if (req.method === 'PUT') {
    const { id, content, starred } = req.body || {};
    if (!id) return res.status(400).json({ error: '缺少 ID' });
    const memos = readMemos();
    const idx = memos.findIndex((m) => m.id === id);
    if (idx === -1) return res.status(404).json({ error: '记录不存在' });
    if (content !== undefined) memos[idx].content = content.trim();
    if (starred !== undefined) memos[idx].starred = starred;
    writeMemos(memos);
    return res.json(memos[idx]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: '缺少 ID' });
    let memos = readMemos();
    memos = memos.filter((m) => m.id !== id);
    writeMemos(memos);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
