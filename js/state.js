// js/state.js
export class StateStore {
  constructor(key, initialState) {
    this.key = key;
    this.state = JSON.parse(JSON.stringify(initialState));
    this.listeners = [];
    this._load();
  }

  get() { 
    return JSON.parse(JSON.stringify(this.state)); 
  }

  set(updates) {
    this.state = { ...this.state, ...updates };
    this._save();
    this._notify();
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => { 
      this.listeners = this.listeners.filter(l => l !== fn); 
    };
  }

  _save() { 
    try {
      localStorage.setItem(this.key, JSON.stringify(this.state));
    } catch(e) {
      console.error('Storage save failed:', e);
    }
  }
  
  _load() { 
    try {
      const saved = localStorage.getItem(this.key);
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch(e) {
      console.warn('Storage load failed:', e);
    }
  }
  
  _notify() { 
    this.listeners.forEach(fn => fn(this.state)); 
  }
}