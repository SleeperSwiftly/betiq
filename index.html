<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BetIQ — Sports Betting AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #070a0d;
      --surface:  #0d1117;
      --surface2: #111820;
      --border:   #1c2530;
      --border2:  #243040;
      --green:    #00c274;
      --green-dim:#004d2e;
      --gold:     #f5a623;
      --red:      #e05252;
      --text:     #dde4ef;
      --muted:    #5a6a7e;
      --muted2:   #3a4a5a;
    }

    html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }

    /* ─── Layout ─────────────────────────── */
    #app { display: flex; height: 100vh; }

    /* ─── Sidebar ─────────────────────────── */
    #sidebar {
      width: 260px; min-width: 260px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      overflow: hidden;
    }

    #sidebar-header {
      padding: 20px 16px 14px;
      border-bottom: 1px solid var(--border);
    }

    .logo {
      display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
    }
    .logo-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--green-dim);
      border: 1px solid var(--green);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
    .logo-text { font-size: 16px; font-weight: 600; letter-spacing: 0.02em; }
    .logo-text span { color: var(--green); }

    .new-chat-btn {
      width: 100%; padding: 8px 12px;
      background: var(--green);
      border: none; border-radius: 8px;
      color: #000; font-size: 13px; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 8px;
      transition: opacity 0.15s;
    }
    .new-chat-btn:hover { opacity: 0.88; }

    #conv-list { flex: 1; overflow-y: auto; padding: 8px; }

    .conv-item {
      padding: 9px 10px; border-radius: 8px; margin-bottom: 2px;
      cursor: pointer; display: flex; align-items: center; gap: 8px;
      transition: background 0.1s; position: relative;
    }
    .conv-item:hover { background: var(--surface2); }
    .conv-item.active { background: var(--surface2); border: 1px solid var(--border2); }
    .conv-item-inner { flex: 1; overflow: hidden; }
    .conv-title { font-size: 12.5px; color: #aab4c0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .conv-item.active .conv-title { color: var(--text); }
    .conv-date { font-size: 10.5px; color: var(--muted); margin-top: 1px; }
    .conv-del {
      background: none; border: none; color: var(--muted2);
      cursor: pointer; font-size: 16px; padding: 2px 5px;
      border-radius: 4px; line-height: 1; opacity: 0;
      transition: opacity 0.15s, color 0.15s;
    }
    .conv-item:hover .conv-del { opacity: 1; }
    .conv-del:hover { color: var(--red); }

    .conv-empty { padding: 24px 12px; text-align: center; color: var(--muted); font-size: 12px; line-height: 1.6; }

    /* Quick prompts */
    #quick-prompts {
      border-top: 1px solid var(--border);
      padding: 12px;
    }
    .qp-label { font-size: 10px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
    .qp-btn {
      display: block; width: 100%;
      text-align: left; padding: 7px 10px;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 6px; color: #8a9ab0; font-size: 11.5px;
      cursor: pointer; margin-bottom: 5px;
      transition: all 0.15s; font-family: inherit;
    }
    .qp-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }
    .qp-btn:last-child { margin-bottom: 0; }

    /* ─── Main area ──────────────────────── */
    #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

    /* Welcome screen */
    #welcome {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 32px; text-align: center;
    }
    .welcome-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 100px;
      background: var(--green-dim); border: 1px solid var(--green);
      font-size: 11px; color: var(--green); font-weight: 500;
      letter-spacing: 0.05em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .welcome-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 2s ease-in-out infinite; }
    .welcome-title { font-size: 28px; font-weight: 300; margin-bottom: 10px; }
    .welcome-title strong { color: var(--green); font-weight: 600; }
    .welcome-sub { font-size: 14px; color: var(--muted); line-height: 1.7; max-width: 420px; margin-bottom: 28px; }
    .welcome-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 500px; width: 100%; }
    .welcome-card {
      padding: 14px 16px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; text-align: left; cursor: pointer;
      transition: all 0.15s;
    }
    .welcome-card:hover { border-color: var(--green); background: var(--green-dim); }
    .wc-icon { font-size: 18px; margin-bottom: 6px; }
    .wc-text { font-size: 12.5px; color: #8a9ab0; line-height: 1.4; }

    /* Messages */
    #messages-wrap { flex: 1; overflow-y: auto; }
    #messages { max-width: 720px; margin: 0 auto; padding: 28px 24px; }

    .msg { display: flex; gap: 12px; margin-bottom: 26px; animation: fadeUp 0.2s ease; }
    .msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      flex-shrink: 0; margin-top: 2px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 600;
    }
    .msg.user .msg-avatar { background: var(--surface2); border: 1px solid var(--border2); color: var(--muted); }
    .msg.bot .msg-avatar { background: var(--green-dim); border: 1px solid var(--green); color: var(--green); }
    .msg-inner { flex: 1; min-width: 0; }
    .msg-name { font-size: 11px; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.04em; }
    .msg.user .msg-name { color: var(--muted); }
    .msg.bot .msg-name { color: var(--green); }
    .msg-body { font-size: 14.5px; line-height: 1.75; color: #bdc8d6; }

    /* Markdown rendering */
    .msg-body p { margin: 0 0 10px; }
    .msg-body p:last-child { margin-bottom: 0; }
    .msg-body strong { color: var(--text); font-weight: 600; }
    .msg-body em { color: #a0b0c0; font-style: italic; }
    .msg-body h1, .msg-body h2, .msg-body h3 { color: var(--text); font-weight: 600; margin: 16px 0 6px; }
    .msg-body h1 { font-size: 17px; }
    .msg-body h2 { font-size: 15px; }
    .msg-body h3 { font-size: 14px; color: var(--green); }
    .msg-body ul, .msg-body ol { padding-left: 20px; margin: 8px 0; }
    .msg-body li { margin: 4px 0; }
    .msg-body code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px; background: var(--surface2);
      border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px;
      color: var(--gold);
    }
    .msg-body pre {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 14px; overflow-x: auto; margin: 10px 0;
    }
    .msg-body pre code { background: none; border: none; padding: 0; font-size: 13px; color: #a0c4a0; }
    .msg-body blockquote {
      border-left: 3px solid var(--green); padding-left: 12px;
      color: var(--muted); font-style: italic; margin: 10px 0;
    }
    /* Odds highlight */
    .odds { font-family: 'JetBrains Mono', monospace; color: var(--gold); font-size: 13px; }
    .ev-pos { color: var(--green); font-weight: 600; }
    .ev-neg { color: var(--red); font-weight: 600; }

    /* Typing indicator */
    .typing-dots { display: flex; gap: 4px; padding-top: 4px; }
    .typing-dots span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--green); opacity: 0.3;
      animation: typingPulse 1.2s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    /* Input area */
    #input-area {
      border-top: 1px solid var(--border);
      padding: 16px 24px 18px;
      background: var(--surface);
    }
    #input-wrap {
      max-width: 720px; margin: 0 auto;
    }
    #input-box {
      display: flex; gap: 10px; align-items: flex-end;
      background: var(--bg); border: 1px solid var(--border2);
      border-radius: 12px; padding: 11px 14px;
      transition: border-color 0.15s;
    }
    #input-box:focus-within { border-color: var(--green); }
    #msg-input {
      flex: 1; background: none; border: none; outline: none;
      resize: none; color: var(--text);
      font-size: 14.5px; line-height: 1.5;
      font-family: 'Inter', sans-serif;
      max-height: 120px; overflow-y: auto;
    }
    #msg-input::placeholder { color: var(--muted2); }
    #send-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: none; cursor: pointer; flex-shrink: 0;
      background: var(--green); color: #000;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700;
      transition: all 0.15s;
    }
    #send-btn:disabled { background: var(--surface2); color: var(--muted2); cursor: default; }
    #send-btn:not(:disabled):hover { opacity: 0.85; }
    #input-hint { text-align: center; font-size: 10.5px; color: var(--muted2); margin-top: 8px; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes blink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    @keyframes typingPulse { 0%, 100% { opacity: 0.25; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }

    /* Responsive */
    @media (max-width: 680px) {
      #sidebar { display: none; }
    }
  </style>
</head>
<body>
<div id="app">
  <!-- Sidebar -->
  <div id="sidebar">
    <div id="sidebar-header">
      <div class="logo">
        <div class="logo-icon">🎯</div>
        <div class="logo-text">Bet<span>IQ</span></div>
      </div>
      <button class="new-chat-btn" onclick="newChat()">
        <span style="font-size:18px;line-height:1">+</span> New conversation
      </button>
    </div>

    <div id="conv-list"></div>

    <div id="quick-prompts">
      <div class="qp-label">Quick questions</div>
      <button class="qp-btn" onclick="quickPrompt('How do I calculate Expected Value on a bet?')">📊 How to calculate EV</button>
      <button class="qp-btn" onclick="quickPrompt('Explain how to manage my bankroll properly')">💰 Bankroll management</button>
      <button class="qp-btn" onclick="quickPrompt('What is line shopping and why does it matter?')">🔍 Line shopping</button>
      <button class="qp-btn" onclick="quickPrompt('Explain sharp money and line movement')">📈 Sharp money moves</button>
      <button class="qp-btn" onclick="quickPrompt('What are the key numbers I should know in NFL betting?')">🏈 NFL key numbers</button>
    </div>
  </div>

  <!-- Main -->
  <div id="main">
    <div id="welcome">
      <div class="welcome-badge">
        <div class="welcome-dot"></div>
        Powered by Gemini 2.0 Flash · Free
      </div>
      <h1 class="welcome-title">Your personal <strong>sports betting</strong> analyst</h1>
      <p class="welcome-sub">
        Ask me anything — odds explained, bankroll strategy, EV calculations,
        line movement, props, parlays, and more. I'll help you bet sharper.
      </p>
      <div class="welcome-cards">
        <div class="welcome-card" onclick="quickPrompt('Explain how American odds work with examples')">
          <div class="wc-icon">🎰</div>
          <div class="wc-text">How do American odds work?</div>
        </div>
        <div class="welcome-card" onclick="quickPrompt('What is the Kelly Criterion and how should I use it for bet sizing?')">
          <div class="wc-icon">📐</div>
          <div class="wc-text">Kelly Criterion bet sizing</div>
        </div>
        <div class="welcome-card" onclick="quickPrompt('Is it worth betting parlays or should I stick to straight bets?')">
          <div class="wc-icon">🔗</div>
          <div class="wc-text">Parlays vs straight bets</div>
        </div>
        <div class="welcome-card" onclick="quickPrompt('How do I read line movement and what does it tell me?')">
          <div class="wc-icon">📉</div>
          <div class="wc-text">Reading line movement</div>
        </div>
      </div>
    </div>

    <div id="chat-view" style="display:none;flex:1;flex-direction:column;overflow:hidden;">
      <div id="messages-wrap">
        <div id="messages"></div>
      </div>
    </div>

    <div id="input-area">
      <div id="input-wrap">
        <div id="input-box">
          <textarea id="msg-input" placeholder="Ask BetIQ anything about sports betting…" rows="1"
            oninput="autoResize(this)"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send();}"></textarea>
          <button id="send-btn" onclick="send()" disabled>↑</button>
        </div>
        <div id="input-hint">Enter to send · Shift+Enter for new line · Chats saved automatically</div>
      </div>
    </div>
  </div>
</div>

<script>
// ─── State ───────────────────────────────────────────
let conversations = [];
let currentId = null;
let isLoading = false;

// ─── Storage ─────────────────────────────────────────
function save() {
  try { localStorage.setItem('betiq_convs', JSON.stringify(conversations)); } catch(e) {}
}
function load() {
  try {
    const raw = localStorage.getItem('betiq_convs');
    if (raw) conversations = JSON.parse(raw);
    if (conversations.length > 0) { currentId = conversations[0].id; showChat(); }
    renderSidebar();
    if (currentId) renderMessages();
  } catch(e) {}
}

// ─── Conversations ────────────────────────────────────
function newChat() {
  const id = Date.now().toString();
  conversations.unshift({ id, title: 'New conversation', messages: [], createdAt: Date.now() });
  currentId = id;
  save(); renderSidebar(); showChat(); renderMessages();
  setTimeout(() => document.getElementById('msg-input').focus(), 80);
}

function deleteConv(id, e) {
  e.stopPropagation();
  conversations = conversations.filter(c => c.id !== id);
  if (currentId === id) {
    currentId = conversations.length > 0 ? conversations[0].id : null;
    if (currentId) { showChat(); renderMessages(); }
    else showWelcome();
  }
  save(); renderSidebar();
}

function switchTo(id) {
  currentId = id;
  showChat(); renderMessages(); renderSidebar();
}

function currentConv() { return conversations.find(c => c.id === currentId); }

// ─── UI helpers ──────────────────────────────────────
function showChat() {
  document.getElementById('welcome').style.display = 'none';
  const cv = document.getElementById('chat-view');
  cv.style.display = 'flex';
}
function showWelcome() {
  document.getElementById('welcome').style.display = 'flex';
  document.getElementById('chat-view').style.display = 'none';
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  document.getElementById('send-btn').disabled = !el.value.trim() || isLoading;
}
function scrollBottom() {
  setTimeout(() => {
    const w = document.getElementById('messages-wrap');
    if (w) w.scrollTop = w.scrollHeight;
  }, 60);
}

// ─── Sidebar ─────────────────────────────────────────
function renderSidebar() {
  const list = document.getElementById('conv-list');
  if (conversations.length === 0) {
    list.innerHTML = '<div class="conv-empty">Your conversations will appear here.<br>Start a new chat above!</div>';
    return;
  }
  list.innerHTML = conversations.map(c => `
    <div class="conv-item${c.id === currentId ? ' active' : ''}" onclick="switchTo('${c.id}')">
      <div class="conv-item-inner">
        <div class="conv-title">${esc(c.title)}</div>
        <div class="conv-date">${fmtDate(c.createdAt)}</div>
      </div>
      <button class="conv-del" onclick="deleteConv('${c.id}',event)" title="Delete">×</button>
    </div>`).join('');
}

// ─── Messages ─────────────────────────────────────────
function renderMessages() {
  const conv = currentConv();
  const container = document.getElementById('messages');
  if (!conv) return;
  if (conv.messages.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--muted);font-size:13.5px;padding:40px 0">
      Ask BetIQ anything about sports betting to get started.
    </div>`;
    return;
  }
  container.innerHTML = conv.messages.map(m => `
    <div class="msg ${m.role === 'user' ? 'user' : 'bot'}">
      <div class="msg-avatar">${m.role === 'user' ? 'U' : '🎯'}</div>
      <div class="msg-inner">
        <div class="msg-name">${m.role === 'user' ? 'You' : 'BetIQ'}</div>
        <div class="msg-body">${md(m.content)}</div>
      </div>
    </div>`).join('');
  scrollBottom();
}

function addTypingIndicator() {
  const container = document.getElementById('messages');
  const el = document.createElement('div');
  el.id = 'typing-indicator';
  el.className = 'msg bot';
  el.innerHTML = `
    <div class="msg-avatar">🎯</div>
    <div class="msg-inner">
      <div class="msg-name">BetIQ</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  container.appendChild(el);
  scrollBottom();
}
function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// ─── Send ─────────────────────────────────────────────
async function send() {
  const inp = document.getElementById('msg-input');
  const text = inp.value.trim();
  if (!text || isLoading) return;

  inp.value = ''; inp.style.height = 'auto';
  document.getElementById('send-btn').disabled = true;

  if (!currentId) newChat();
  const conv = currentConv();

  conv.messages.push({ role: 'user', content: text });
  if (conv.messages.length === 1) conv.title = text.slice(0, 42) + (text.length > 42 ? '…' : '');

  showChat(); renderMessages(); renderSidebar();
  addTypingIndicator();
  isLoading = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conv.messages })
    });
    const data = await res.json();
    removeTypingIndicator();
    if (data.error) throw new Error(data.error);
    conv.messages.push({ role: 'assistant', content: data.response });
    save();
  } catch(err) {
    removeTypingIndicator();
    conv.messages.push({ role: 'assistant', content: `⚠️ Error: ${err.message}` });
  }

  isLoading = false;
  renderMessages(); renderSidebar();
  inp.focus();
}

function quickPrompt(text) {
  if (!currentId) newChat();
  document.getElementById('msg-input').value = text;
  autoResize(document.getElementById('msg-input'));
  send();
}

// ─── Markdown parser ─────────────────────────────────
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function md(raw) {
  let s = esc(raw);
  // code blocks
  s = s.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, c) =>
    `<pre><code>${c.trim()}</code></pre>`);
  // inline code
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  // bold
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // italic
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // headers
  s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // blockquote
  s = s.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // horizontal rule
  s = s.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:14px 0">');
  // unordered lists
  s = s.replace(/(^- .+$(\n^- .+$)*)/gm, match =>
    `<ul>${match.replace(/^- (.+)$/gm, '<li>$1</li>')}</ul>`);
  // ordered lists
  s = s.replace(/(^\d+\. .+$(\n^\d+\. .+$)*)/gm, match =>
    `<ol>${match.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')}</ol>`);
  // odds highlighting: +/-number with optional decimal
  s = s.replace(/([+-]\d+(?:\.\d+)?)/g, '<span class="odds">$1</span>');
  // paragraphs
  s = s.split(/\n{2,}/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (/^<(h[123]|ul|ol|pre|blockquote|hr)/.test(p)) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  return s;
}

// ─── Init ─────────────────────────────────────────────
load();
document.getElementById('msg-input').addEventListener('input', function() {
  document.getElementById('send-btn').disabled = !this.value.trim() || isLoading;
});
</script>
</body>
</html>
