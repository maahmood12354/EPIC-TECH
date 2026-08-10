// دالة عرض المنتجات في السلة
function loadCart() {
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('total-price');
    
    if (!container) return; // لو مش في صفحة السلة اخرج من الدالة عشان ميعملش أخطاء

    // بنقرا من الـ localStorage بنفس المفتاح الموحد 'cart'
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center;">السلة فارغة حالياً.</p>';
        if (totalPriceEl) totalPriceEl.textContent = 'الإجمالي: 0 ج.م';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemPrice = Number(item.price) || 0;
        let itemQty = Number(item.quantity) || 1;
        total += itemPrice * itemQty;

        container.innerHTML += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 15px 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; color: #fff;">
                <div>
                    <h4 style="color: #38bdf8; margin-bottom: 5px;">${item.name}</h4>
                    <p style="color: #aaa; font-size: 14px;">السعر: ${itemPrice} EGP</p>
                </div>
                <button onclick="removeItem(${index})" style="background: #ef4444; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer;">حذف ❌</button>
            </div>
        `;
    });

    if (totalPriceEl) {
        totalPriceEl.textContent = `الإجمالي: ${total} EGP`;
    }
}

// دالة حذف منتج من السلة
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// دالة الإضافة مع الإشعار الزجاجي الجديد بدلاً من الـ alert القديم
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart.push({
        name: productName,
        price: productPrice,
        quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تم استبدال الـ alert القديم بالإشعار الزجاجي الشيك تحت
    showToast(`تم إضافة "${productName}" إلى السلة بنجاح! ✔️`);
}

// دالة إظهار الإشعار الزجاجي الشفاف
function showToast(message) {
    const oldToast = document.getElementById('custom-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.innerHTML = message;
    
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)',
        color: '#4ade80',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '12px 25px',
        borderRadius: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        zIndex: '999999',
        fontSize: '15px',
        fontWeight: 'bold',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// تشغيل الدالة أول ما الصفحة تحمل
document.addEventListener('DOMContentLoaded', loadCart);