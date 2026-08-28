// ==========================================
// ملف main.js الشامل (السلة + البحث + الثيم)
// ==========================================

// 1. دالة إضافة المنتج للسلة
window.addToCart = function (productName, price) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }

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

// 2. تحديث عداد السلة في الهيدر
window.updateCartBadge = function () {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }

    let totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    badge.textContent = totalItems;

    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
};

// 3. الإشعار الزجاجي الشفاف
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

// 4. فتح وإغلاق خانة البحث
function openSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const isHidden = input.style.display === 'none' || input.style.display === '';
    input.style.display = isHidden ? 'block' : 'none';
    if (isHidden) input.focus();
}
window.openSearch = openSearch;

// 5. فلترة لايف للمنتجات أثناء الكتابة
function filterProducts(query) {
    const searchTerm = query.trim().toLowerCase();
    const productLinks = document.querySelectorAll('.product-card-link');

    productLinks.forEach(link => {
        const text = link.innerText.toLowerCase();
        link.style.display = (searchTerm === '' || text.includes(searchTerm)) ? '' : 'none';
    });
}
window.filterProducts = filterProducts;

// 6. البحث عند الضغط على Enter
function handleHomeSearch(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.trim();
        if (query !== '') {
            window.location.href = `pages/category.html?search=${encodeURIComponent(query)}`;
        }
    }
}
window.handleHomeSearch = handleHomeSearch;

// 7. تشغيل الأحداث بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (window.updateCartBadge) window.updateCartBadge();
    if (document.getElementById('cart-items-container') && window.loadCartItems) {
        window.loadCartItems();
    }
});

// 8. التقاط ضغطات زرار السلة في الكروت أوتوماتيك
document.addEventListener('click', function (event) {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    if (name && !isNaN(price)) {
        window.addToCart(name, price);
    }
});
window.loadCartItems = function () {
    let cartContainer = document.getElementById('cart-items-container');
    let totalPriceElement = document.getElementById('total-price');

    if (!cartContainer) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
    } catch (e) {
        cart = [];
    }

    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">سلة المشتريات فارغة حالياً 🛒</p>';
        if (totalPriceElement) totalPriceElement.innerText = 'الإجمالي: 0 ج.م';
        return;
    }

    let html = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        let itemPrice = Number(item.price) || 0;
        let itemQty = Number(item.quantity) || 1;
        grandTotal += itemPrice * itemQty;

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 18px 25px; margin-bottom: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); direction: rtl; color: #fff;">
                <div>
                    <h4 style="margin: 0 0 6px 0; color: #38bdf8; font-size: 16px;">${item.name}</h4>
                    <p style="margin: 0; color: #aaa; font-size: 14px;">السعر: ${itemPrice} EGP | الكمية: ${itemQty}</p>
                </div>
                <button onclick="window.removeItem(${index})" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">حذف 🗑️</button>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    if (totalPriceElement) {
        totalPriceElement.innerText = 'الإجمالي: ' + grandTotal + ' ج.م';
    }
};

window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('epic_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('epic_cart', JSON.stringify(cart));
    if (window.loadCartItems) window.loadCartItems();
    if (window.updateCartBadge) window.updateCartBadge();
};
// ==========================================
// تشغيل سلايدر آراء العملاء أوتوماتيك
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonialSlider');
    if (!container) return;

    // تفريغ الكونتير لمنع التكرار
    container.innerHTML = '';

    // رسم الـ 32 صورة للعملاء
    for (let i = 1; i <= 32; i++) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide testimonial-card';
        slide.innerHTML = `<img src="assets/images/clients/clients${i}.png" class="client-img" alt="Client ${i}" onerror="this.parentElement.style.display='none'">`;
        container.appendChild(slide);
    }

    // تفعيل مكتبة Swiper بنفس إعداداتك الأصلية
    setTimeout(() => {
        if (typeof Swiper !== 'undefined') {
            new Swiper(".mySwiper", {
                slidesPerView: 4,
                spaceBetween: 20,
                grid: { rows: 2, fill: 'row' },
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    0: { slidesPerView: 1, grid: { rows: 1 } },
                    768: { slidesPerView: 2, grid: { rows: 2 } },
                    1024: { slidesPerView: 4, grid: { rows: 2 } }
                }
            });
        }
    }, 100);
});
// ==========================================
// دالة البحث الشامل من أي صفحة في الموقع
// ==========================================
window.handleHomeSearch = function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.trim();

        if (query !== '') {
            // بنتحقق إحنا في الرئيسية بره ولا جوه فولدر pages
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('pages');

            // التوجيه لصفحة النتائج الشاملة (category.html) اللي إحنا برمجناها
            if (isHomePage) {
                window.location.href = `pages/category.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `category.html?search=${encodeURIComponent(query)}`;
            }
        }
    }
};

// تعطيل دالة الفلترة القديمة المحدودة عشان متعملش عطل في الرئيسية
window.filterProducts = function (query) {
    return;
};