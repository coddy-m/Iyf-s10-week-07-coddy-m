import { storage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const stats = document.getElementById('todo-stats');
  const filters = document.querySelectorAll('.filter-btn');

  if (!form || !list) return console.warn('Todo HTML elements missing');

  let todos = storage.get('todos_v2', []);
  let filter = 'all';

  function save() { storage.set('todos_v2', todos); }

  function render() {
    list.innerHTML = '';
    const visible = filter === 'all' ? todos : todos.filter(t => filter === 'active' ? !t.done : t.done);
    
    visible.forEach(todo => {
      const li = document.createElement('li');
      li.className = `item ${todo.done ? 'completed' : ''}`;
      li.innerHTML = `
        <span data-id="${todo.id}" style="cursor:pointer; flex:1;">${todo.text}</span>
        <button data-delete="${todo.id}" class="btn btn-danger btn-sm">✕</button>
      `;
      li.querySelector('span').onclick = () => toggle(todo.id);
      li.querySelector('button').onclick = () => remove(todo.id);
      list.appendChild(li);
    });

    const active = todos.filter(t => !t.done).length;
    stats.textContent = `${active} left • ${todos.filter(t => t.done).length} done`;
  }

  function add(text) {
    todos.unshift({ id: crypto.randomUUID(), text, done: false, created: Date.now() });
    save(); render();
  }

  window.toggle = function(id) {
    const t = todos.find(x => x.id === id);
    if (t) { t.done = !t.done; save(); render(); }
  };

  function remove(id) {
    todos = todos.filter(x => x.id !== id);
    save(); render();
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) { add(text); input.value = ''; }
  };

  filters.forEach(btn => {
    btn.onclick = () => {
      filter = btn.dataset.filter;
      filters.forEach(b => b.classList.remove('btn', 'btn-secondary', 'active'));
      btn.classList.add('btn', 'btn-secondary', 'active');
      render();
    };
  });

  render();
});