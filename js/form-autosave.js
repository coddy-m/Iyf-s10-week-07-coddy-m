import { session } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('autosave-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const fields = form.querySelectorAll('input, textarea, select');
  const STORAGE_KEY = 'form_draft_v2';

  // Restore saved data
  const saved = session.get(STORAGE_KEY, {});
  fields.forEach(field => {
    if (saved[field.name]) field.value = saved[field.name];
  });

  // Auto-save on input
  fields.forEach(field => {
    field.oninput = () => {
      const data = {};
      fields.forEach(f => data[f.name] = f.value);
      session.set(STORAGE_KEY, data);
      status.textContent = '💾 Auto-saved';
      setTimeout(() => status.textContent = '', 2000);
    };
  });

  // Clear on submit
  form.onsubmit = (e) => {
    e.preventDefault();
    session.remove(STORAGE_KEY);
    form.reset();
    status.textContent = '✅ Form submitted & draft cleared';
    setTimeout(() => status.textContent = '', 3000);
  };
});