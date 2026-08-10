document.addEventListener('DOMContentLoaded', () => {

    // 1. منطق الثيم
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if(themeToggle) themeToggle.checked = true;
        if(themeIcon) themeIcon.textContent = '🌙';
    } else {
        if(themeIcon) themeIcon.textContent = '☀️';
    }

    if(themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isLight = themeToggle.checked;
            document.body.classList.toggle('light-mode', isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeIcon.textContent = isLight ? '🌙' : '☀️';
        });
    }

    // 2. منطق Swiper للمنتجات
    document.querySelectorAll('.productSwiper').forEach(function(el) {
        new Swiper(el, {
            loop: true,
            navigation: {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
            },
        });
    });

    // 3. منطق آراء العملاء (بالتصميم القديم والـ Grid الأصلي)
    function initSwiper() {
        const container = document.getElementById('testimonialSlider');
        if (!container) return;
        
        // تفريغ الكونتير أولاً لمنع التكرار
        container.innerHTML = '';

        for (let i = 1; i <= 32; i++) {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide testimonial-card';
            slide.innerHTML = `<img src="assets/images/clients/clients${i}.png" class="client-img" alt="Client ${i}">`;
            container.appendChild(slide);
        }

        // تشغيل السلايدر بنفس إعداداتك القديمة تماماً
        setTimeout(() => {
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
        }, 100);
    }
    initSwiper();

    // 4. منطق البحث
    const searchBtn = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchInput.classList.toggle('active'));
    }

}); // قفلة الـ DOMContentLoaded الصح

// منطق الـ Scroll للهيدر
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// دالة بتشتغل لما العميل يضغط على زرار "شراء" لأي منتج
async function buyProduct(productName, productPrice) {
    const customerName = prompt("أدخل اسمك الكريم:");
    if (!customerName) return;
    
    const phone = prompt("أدخل رقم هاتفك للتواصل:");
    if (!phone) return;

    const address = prompt("أدخل عنوان الاستلام بالتفصيل:");
    if (!address) return;

    const orderData = {
        customerName: customerName,
        phone: phone,
        address: address,
        productName: productName,
        price: productPrice
    };

    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            alert('تم تسجيل طلبك بنجاح! جاري تحويلك للواتساب لإتمام التواصل... 🚀');

            const myWhatsAppNumber = "201017229055";

            const message = `السلام عليكم، أريد طلب هذا المنتج:%0A` +
                            `- المنتج: ${productName}%0A` +
                            `- السعر: ${productPrice} ج.م%0A` +
                            `- الاسم: ${customerName}%0A` +
                            `- الهاتف: ${phone}%0A` +
                            `- العنوان: ${address}`;

            window.open(`https://wa.me/${myWhatsAppNumber}?text=${message}`, '_blank');
        } else {
            alert('حدث خطأ أثناء تسجيل الطلب، حاول مرة أخرى.');
        }
    } catch (err) {
        alert('تعذر الاتصال بالسيرفر، تأكد أن السيرفر يعمل!');
    }
}

// دالة إضافة المنتج للسلة مع الإشعار الزجاجي الواضح
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart.push({
        name: productName,
        price: productPrice,
        quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    // إنشاء رسالة نجاح صغيرة تظهر فوق زرار الإضافة فوراً
    showInlineMessage(event.target, `تمت الإضافة بنجاح ✔️`);
}

function showInlineMessage(buttonElement, message) {
    // لو فيه رسالة قديمة موجودة امسحها
    const parent = buttonElement.parentElement;
    const oldMsg = parent.querySelector('.success-msg');
    if (oldMsg) oldMsg.remove();

    // عمل عنصر النص الجديد
    const msg = document.createElement('div');
    msg.className = 'success-msg';
    msg.innerText = message;
    
    Object.assign(msg.style, {
        color: '#4ade80',
        fontSize: '13px',
        fontWeight: 'bold',
        marginTop: '8px',
        textAlign: 'center',
        transition: 'opacity 0.3s'
    });

    parent.appendChild(msg);

    // إخفاء الرسالة بعد ثانيتين
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
    }, 2000);
}