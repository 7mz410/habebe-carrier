/**
 * app.js - Habebe Essentials Brand Showroom Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Product Colorways Data ---
  const colorways = [
    {
      name: 'Wildheart Leopard',
      img: 'images/prnt-copy.png',
      price: 70,
      desc: 'Hand-printed leopard in warm camel and ink — unmistakable from across the room. For the parent who was never going to blend in.',
      specs: ['Hand-printed signature leopard', 'Gold woven fox label', 'Reinforced safety stitching']
    },
    {
      name: 'Midnight',
      img: 'images/blk-copy.png',
      price: 60,
      desc: 'Deep navy-black with the fox mark in gold foil — evening-ready and endlessly easy. The one that goes with the good coat.',
      specs: ['Midnight canvas, gold-foil mark', 'Padded one-shoulder strap', 'Hidden interior pocket']
    },
    {
      name: 'Sage',
      img: 'images/wit-copy.png',
      price: 50,
      desc: 'Soft mineral sage on breathable cotton canvas — the quiet one. Pairs with everything, hides the everyday, keeps its calm.',
      specs: ['Breathable 100% cotton canvas', 'Padded one-shoulder strap', 'Machine washable, line dry']
    }
  ];

  // --- State ---
  let activeIndex = 0;
  let cart = [];

  // --- DOM Elements ---
  const mainNav = document.getElementById('main-nav');
  
  // Showroom Display Elements
  const productImg = document.getElementById('product-display-img');
  const productNum = document.getElementById('product-display-num');
  const numberTag = document.getElementById('product-number-tag');
  const titleLabel = document.getElementById('product-title-label');
  const descLabel = document.getElementById('product-desc-label');
  const specsContainer = document.getElementById('product-specs-container');
  const swatches = document.querySelectorAll('.showroom-swatch-btn');
  const addToCartBtn = document.getElementById('showroom-add-to-cart-btn');
  const bundleEstimateLabel = document.getElementById('showroom-bundle-estimate-label');

  // Cart Drawer Elements
  const cartToggleBtn = document.getElementById('cart-drawer-toggle');
  const cartCloseBtn = document.getElementById('cart-drawer-close-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer-pane');
  const cartCounterBadge = document.getElementById('cart-counter-badge');
  const cartItemsListContainer = document.getElementById('cart-items-list-container');
  const cartEmptyStateView = document.getElementById('cart-empty-state-view');
  const cartDrawerFooter = document.getElementById('cart-drawer-footer');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartDiscountRowView = document.getElementById('cart-discount-row-view');
  const cartDiscountVal = document.getElementById('cart-discount-val');
  const cartTotalVal = document.getElementById('cart-total-val');
  const cartPromoBadgeView = document.getElementById('cart-promo-badge-view');
  const cartDrawerBackToShop = document.getElementById('cart-drawer-back-to-shop');
  const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');

  // --- Scroll Effects (Shrink Header Nav) ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Scroll Reveal Animations ---
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // --- Swatch Click Handler ---
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const index = parseInt(swatch.getAttribute('data-index'));
      activeIndex = index;
      
      // Update Swatch Active Styles (Border, Scale)
      swatches.forEach((s, idx) => {
        if (idx === index) {
          s.classList.add('active');
          s.style.borderColor = '#E0A24A';
          s.style.boxShadow = '0 0 0 3px rgba(224,162,74,0.22)';
          s.style.transform = 'scale(1.12)';
        } else {
          s.classList.remove('active');
          s.style.borderColor = 'rgba(245,240,231,0.35)';
          s.style.boxShadow = 'none';
          s.style.transform = 'scale(1)';
        }
      });

      const data = colorways[index];

      // Cross-fade visual display
      productImg.style.opacity = '0';
      productImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        productImg.src = data.img;
        productImg.alt = `${data.name} carrier`;
        productNum.textContent = `0${index + 1}`;
        numberTag.textContent = `Colorway 01 / 03`.replace('01', `0${index + 1}`);
        titleLabel.textContent = data.name;
        descLabel.textContent = data.desc;

        // Build Specs HTML
        specsContainer.innerHTML = data.specs.map(spec => `
          <div class="showroom-spec-item">
            <span class="showroom-spec-bullet">◆</span>${spec}
          </div>
        `).join('');

        // Update Button & Estimate
        addToCartBtn.textContent = `Reserve — $${data.price} →`;
        bundleEstimateLabel.textContent = `Two of these — $${Math.round(data.price * 2 * 0.75)} the pair`;

        // Restore visual state
        productImg.style.opacity = '1';
        productImg.style.transform = 'scale(1)';
      }, 300);
    });
  });

  // --- Drawer Open / Close Toggle ---
  const toggleCartDrawer = (show = true) => {
    if (show) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  cartToggleBtn.addEventListener('click', () => toggleCartDrawer(true));
  cartCloseBtn.addEventListener('click', () => toggleCartDrawer(false));
  cartOverlay.addEventListener('click', () => toggleCartDrawer(false));
  cartDrawerBackToShop.addEventListener('click', () => {
    toggleCartDrawer(false);
    document.getElementById('showroom').scrollIntoView({ behavior: 'smooth' });
  });

  // --- Cart Calculations & Render ---
  const updateCart = () => {
    // Update badge counter
    cartCounterBadge.textContent = cart.length;

    // Clear previous items in list (leaving empty state card)
    const items = cartItemsListContainer.querySelectorAll('.cart-item');
    items.forEach(it => it.remove());

    if (cart.length === 0) {
      cartEmptyStateView.style.display = 'block';
      cartDrawerFooter.style.display = 'none';
      return;
    }

    cartEmptyStateView.style.display = 'none';
    cartDrawerFooter.style.display = 'block';

    let subtotal = 0;

    // Build Cart Item Nodes
    cart.forEach((item, index) => {
      subtotal += item.price;
      const card = document.createElement('div');
      card.className = 'cart-item';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
          </div>
          <div class="cart-item-row">
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            <button class="cart-item-remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
      cartItemsListContainer.appendChild(card);
    });

    // Bundle Deal logic (25% off for 2 or more items)
    let discount = 0;
    const hasDiscount = cart.length >= 2;

    if (hasDiscount) {
      discount = subtotal * 0.25;
      cartDiscountRowView.style.display = 'flex';
      cartDiscountVal.textContent = `-$${discount.toFixed(2)}`;
      cartPromoBadgeView.style.display = 'flex';
    } else {
      cartDiscountRowView.style.display = 'none';
      cartPromoBadgeView.style.display = 'none';
    }

    const total = subtotal - discount;

    cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotalVal.textContent = `$${total.toFixed(2)}`;

    // Rebind remove item listeners
    const removeBtns = cartItemsListContainer.querySelectorAll('.cart-item-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indexToRemove = parseInt(e.target.getAttribute('data-index'));
        cart.splice(indexToRemove, 1);
        updateCart();
      });
    });
  };

  // Add Item to cart
  addToCartBtn.addEventListener('click', () => {
    const data = colorways[activeIndex];
    
    // Add to state
    cart.push({
      name: data.name,
      price: data.price,
      image: data.img
    });

    // Snuggle confirm animation on add button
    addToCartBtn.textContent = 'Reserve - Added!';
    addToCartBtn.style.backgroundColor = '#1E6B5D';
    addToCartBtn.style.color = '#FFFFFF';
    
    setTimeout(() => {
      addToCartBtn.textContent = `Reserve — $${data.price} →`;
      addToCartBtn.style.backgroundColor = '';
      addToCartBtn.style.color = '';
    }, 1200);

    // Sync and open drawer
    updateCart();
    setTimeout(() => {
      toggleCartDrawer(true);
    }, 450);
  });

  // Simulated Order Completion
  checkoutBtn.addEventListener('click', () => {
    const orderNo = Math.floor(100000 + Math.random() * 900000);
    const hasDiscount = cart.length >= 2;
    
    let alertMsg = `💖 Snuggle Order Complete!\n\nOrder Code: #HB${orderNo}\nTotal Price: ${cartTotalVal.textContent}\n\n`;
    if (hasDiscount) {
      alertMsg += `Double Snuggle bundle coupon (25% off) has been successfully applied!\n\n`;
    }
    alertMsg += `Thank you for choosing Habebé Essentials. Your hand-crafted package will ship within 24 hours.`;
    
    alert(alertMsg);

    // Reset State
    cart = [];
    updateCart();
    toggleCartDrawer(false);
  });

  // Newsletter form submission handling
  const emailForm = document.getElementById('email-subscribe-form');
  const submitLabel = document.getElementById('newsletter-submit-label');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('newsletter-email').value = '';
      submitLabel.textContent = 'Welcome ✦';
      submitLabel.style.backgroundColor = '#F5F0E7';
      submitLabel.style.color = '#072E2A';
      
      setTimeout(() => {
        submitLabel.textContent = 'Subscribe';
        submitLabel.style.backgroundColor = '';
        submitLabel.style.color = '';
      }, 3000);
    });
  }
});
