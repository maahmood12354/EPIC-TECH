// ==========================================
// أكواد السلة والإشعارات (النسخة الصافية والمدرعة)
// ==========================================

// 1. دالة إضافة المنتج للسلة
window.addToCart = function (productName, price) {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('epic_cart')) || []; } catch (e) { cart = []; }

    let existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ name: productName, price: Number(price), quantity: 1 });
    }

    localStorage.setItem('epic_cart', JSON.stringify(cart));
    if (window.updateCartBadge) window.updateCartBadge();
    if (window.showToast) window.showToast(`تم إضافة "${productName}" إلى السلة بنجاح 🛒`);
};

// 2. دالة تحديث عداد السلة
window.updateCartBadge = function () {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('epic_cart')) || []; } catch (e) { cart = []; }

    let totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    badge.textContent = totalItems;

    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
};

// 3. دالة الإشعار الزجاجي
window.showToast = function (message) {
    let toast = document.getElementById('epicToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'epicToast';
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px);
            background: rgba(56, 189, 248, 0.95); color: #04121d; padding: 12px 24px;
            border-radius: 30px; font-weight: bold; font-size: 14px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            transition: transform 0.4s ease, opacity 0.4s ease;
            opacity: 0; z-index: 999999; backdrop-filter: blur(10px); text-align: center;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(0)'; toast.style.opacity = '1'; }, 10);
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; toast.style.opacity = '0'; }, 2500);
};

// 4. دالة عرض المنتجات في صفحة السلة
window.loadCartItems = function() {
    let cartContainer = document.getElementById('cart-items-container');
    let totalPriceElement = document.getElementById('total-price');

    if (!cartContainer) return;

    let cart = [];
    try {
        // توحيد اسم السلة هنا وخليناه epic_cart عشان تطابق العداد
        cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch(e) {
        cart = [];
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">سلة المشتريات فارغة حالياً 🛒</p>';
        if (totalPriceElement) totalPriceElement.innerText = 'الإجمالي: 0 ج.م';
        return;
    }

    let html = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        let itemTotal = (item.price || 0) * (item.quantity || 1);
        grandTotal += itemTotal;
        html += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 18px 25px; margin-bottom: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); direction: rtl;">
                <div style="text-align: right;">
                    <h4 style="margin: 0 0 6px 0; color: #fff; font-size: 16px;">${item.name}</h4>
                    <p style="margin: 0; color: #38bdf8; font-size: 14px; font-weight: bold;">السعر: ${item.price} EGP | الكمية: ${item.quantity || 1}</p>
                </div>
                <button onclick="window.removeItem(${index})" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">حذف 🗑️</button>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    if (totalPriceElement) totalPriceElement.innerText = 'الإجمالي: ' + grandTotal + ' ج.م';
};

window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('epic_cart', JSON.stringify(cart));
    if (window.loadCartItems) window.loadCartItems();
    if (window.updateCartBadge) window.updateCartBadge();
};

// 6. تشغيل دوال السلة أوتوماتيك أول ما أي صفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    if (window.updateCartBadge) window.updateCartBadge();
    if (document.getElementById('cart-items-container')) {
        window.loadCartItems();
    }
});