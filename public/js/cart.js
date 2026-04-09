/**
 * Carrito de Compras - Filomena Arte y Diseño
 * Maneja la persistencia en localStorage y la lógica de la UI
 */

const Cart = {
  storageKey: 'filomena_cart',

  get() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer el carrito', e);
      return [];
    }
  },

  save(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateBadge();
    // Disparar evento para que otras partes de la UI se enteren
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  },

  add(product, quantity = 1) {
    const cart = this.get();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > cart[existingIndex].stock) {
        alert(`No hay suficiente stock. Máximo disponible: ${cart[existingIndex].stock}`);
        cart[existingIndex].quantity = cart[existingIndex].stock;
      } else {
        cart[existingIndex].quantity = newQty;
      }
    } else {
      // Si el producto no venía con stock, lo seteamos muy alto o lo pedimos
      const stock = product.stock !== undefined ? product.stock : 999;
      if (quantity > stock) {
          alert(`No hay suficiente stock. Máximo disponible: ${stock}`);
          quantity = stock;
      }
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        codigo: product.codigo,
        stock: stock,
        quantity: quantity
      });
    }

    this.save(cart);
    return cart;
  },

  remove(productId) {
    let cart = this.get();
    cart = cart.filter(item => item.id !== productId);
    this.save(cart);
    return cart;
  },

  updateQuantity(productId, delta) {
    const cart = this.get();
    const item = cart.find(i => i.id === productId);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty > item.stock) {
        alert(`Máximo stock alcanzado (${item.stock})`);
        return cart;
      }
      if (newQty <= 0) {
        return this.remove(productId);
      }
      item.quantity = newQty;
      this.save(cart);
    }
    return cart;
  },

  clear() {
    this.save([]);
  },

  getCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  },

  formatPrice(amount) {
    return '$ ' + Number(amount).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

// Inicializar el badge al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});
