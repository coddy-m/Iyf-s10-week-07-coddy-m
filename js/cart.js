import { StateStore } from './state.js';

const products = [
  { id: 'p1', name: 'Mechanical Keyboard', price: 89.99, emoji: '⌨️' },
  { id: 'p2', name: 'Wireless Mouse', price: 45.00, emoji: '🖱️' },
  { id: 'p3', name: 'USB-C Hub', price: 35.50, emoji: '🔌' },
  { id: 'p4', name: 'Webcam HD', price: 65.00, emoji: '📷' }
];

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛒 Cart module loading...');
  
  const grid = document.getElementById('products-grid');
  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  if (!grid) {
    console.error('❌ products-grid element not found!');
    return;
  }
  if (!cartList) {
    console.error('❌ cart-items element not found!');
    return;
  }

  console.log('✅ DOM elements found');

  const store = new StateStore('cart_v2', { items: {} });

  function renderProducts() {
    console.log('📦 Rendering products...');
    grid.innerHTML = products.map(p => `
      <div class="card">
        <div style="font-size:2rem; text-align:center;">${p.emoji}</div>
        <h3>${p.name}</h3>
        <p class="text-muted">$${p.price.toFixed(2)}</p>
        <button class="btn btn-sm" data-add="${p.id}">Add to Cart</button>
      </div>
    `).join('');

    grid.querySelectorAll('button[data-add]').forEach(btn => {
      btn.onclick = () => {
        console.log('➕ Adding to cart:', btn.dataset.add);
        const currentItems = store.get().items;
        const productId = btn.dataset.add;
        const newQty = (currentItems[productId] || 0) + 1;
        store.set({ items: { ...currentItems, [productId]: newQty } });
      };
    });
    
    console.log('✅ Products rendered');
  }

  function renderCart() {
    console.log('🛒 Rendering cart...');
    const { items } = store.get();
    const ids = Object.keys(items);
    
    if (ids.length === 0) {
      cartList.innerHTML = '<li class="item text-muted">Cart is empty</li>';
      cartTotal.textContent = '$0.00';
      cartCount.textContent = '(0)';
      return;
    }

    let total = 0;
    let count = 0;
    cartList.innerHTML = ids.map(id => {
      const p = products.find(x => x.id === id);
      const qty = items[id];
      total += p.price * qty;
      count += qty;
      return `
        <li class="item">
          <span>${p.name} x${qty}</span>
          <div class="flex">
            <span>$${(p.price * qty).toFixed(2)}</span>
            <button data-remove="${id}" class="btn btn-danger btn-sm" style="margin-left:0.5rem;">✕</button>
          </div>
        </li>`;
    }).join('');

    cartList.querySelectorAll('button[data-remove]').forEach(btn => {
      btn.onclick = () => {
        const next = { ...items };
        delete next[btn.dataset.remove];
        store.set({ items: next });
      };
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = `(${count})`;
    console.log('✅ Cart rendered');
  }

  // Subscribe to store changes
  store.subscribe(renderCart);
  
  // INITIAL RENDER - This is what you were missing!
  renderProducts();
  renderCart();
  
  console.log('🎉 Cart module initialized');
});