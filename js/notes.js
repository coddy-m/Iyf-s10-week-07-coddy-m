import { storage, session, generateId, debounce } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('notes-list');
  const editorEl = document.getElementById('note-editor');
  const titleInput = document.getElementById('note-title');
  const contentInput = document.getElementById('note-content');
  const newBtn = document.getElementById('new-note');

  if (!listEl || !editorEl) return console.warn('Notes HTML elements missing');

  let notes = storage.get('notes_v2', []);
  let activeId = null;

  const saveDraft = debounce(() => {
    if (!activeId) return;
    session.set(`draft_${activeId}`, { title: titleInput.value, content: contentInput.value });
    document.getElementById('draft-status').textContent = '💾 Draft saved';
    setTimeout(() => document.getElementById('draft-status').textContent = '', 1500);
  }, 800);

  function renderList() {
    listEl.innerHTML = '';
    if (notes.length === 0) {
      listEl.innerHTML = '<li class="item text-muted">No notes. Create one!</li>';
      return;
    }
    notes.forEach(note => {
      const li = document.createElement('li');
      li.className = `item ${note.id === activeId ? 'active' : ''}`;
      li.style.cursor = 'pointer';
      li.innerHTML = `<strong>${note.title || 'Untitled'}</strong>`;
      li.onclick = () => selectNote(note.id);
      listEl.appendChild(li);
    });
  }

  function selectNote(id) {
    activeId = id;
    const note = notes.find(n => n.id === id);
    const draft = session.get(`draft_${id}`);
    
    titleInput.value = draft?.title ?? note?.title ?? '';
    contentInput.value = draft?.content ?? note?.content ?? '';
    
    editorEl.classList.remove('hidden');
    renderList();
    titleInput.focus();
  }

  titleInput.oninput = contentInput.oninput = saveDraft;

  document.getElementById('save-note').onclick = () => {
    if (!activeId) return;
    const note = notes.find(n => n.id === activeId);
    if (note) {
      note.title = titleInput.value;
      note.content = contentInput.value;
      storage.set('notes_v2', notes);
      session.remove(`draft_${activeId}`);
      renderList();
    }
  };

  newBtn.onclick = () => {
    const id = generateId();
    notes.unshift({ id, title: 'New Note', content: '', created: Date.now() });
    storage.set('notes_v2', notes);
    selectNote(id);
  };

  renderList();
});