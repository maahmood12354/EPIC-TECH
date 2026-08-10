// دالة لجلب وعرض المنتجات أوتوماتيك من السيرفر
async function loadStoreProducts() {
    try {
        // 1. طلب المنتجات من السيرفر اللي شغال على بورت 5000
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        // 2. المكان أو الفولدر في HTML اللي هتظهر فيه المنتجات (تأكد إن ده الـ ID بتاع الكونتينر عندك)
        const productsContainer = document.getElementById('products-container'); 
        
        if (!productsContainer) return;
        productsContainer.innerHTML = '';

        if (products.length === 0) {
            productsContainer.innerHTML = '<p style="color: #94a3b8; text-align: center;">لا توجد منتجات مضافة حالياً.</p>';
            return;
        }

        // 3. لفة على كل منتج ورسمه في الموقع أوتوماتيك
        products.forEach(product => {
            productsContainer.innerHTML += `
                <div class="product-card" style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 10px; padding: 15px; text-align: center; color: #fff;">
                    <!-- صورة المنتج -->
                    <img src="http://localhost:5000${product.image}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px;">
                    
                    <!-- اسم المنتج -->
                    <h3 style="color: #38bdf8; margin: 10px 0 5px;">${product.name}</h3>
                    
                    <!-- القسم والمميزات (جديد، مستعمل، بلوتوث، إلخ) -->
                    <p style="color: #94a3b8; font-size: 13px; margin: 5px 0;">القسم: ${product.category} | ${product.subType || ''}</p>
                    
                    <!-- الوصف -->
                    <p style="font-size: 14px; color: #cbd5e1;">${product.description || ''}</p>
                    
                    <!-- السعر -->
                    <p style="color: #4ade80; font-weight: bold; font-size: 18px;">${product.price} ج.م</p>
                    
                    <!-- زر الشراء اللي بيفتح الواتساب ويسجل الطلب -->
                    <button onclick="buyProduct('${product.name}', ${product.price})" style="background: #06b6d4; color: #fff; border: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">
                        شراء الآن 🛒
                    </button>
                </div>
            `;
        });
    } catch (err) {
        console.error('تعذر جلب المنتجات من السيرفر:', err);
    }
}

// تشغيل الدالة أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', loadStoreProducts);
// دالة لجلب المنتجات وعرضها في الموقع الرئيسي للزباين
async function loadStoreProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        const container = document.getElementById('products-container');
        if (!container) return;
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p style="color: #94a3b8; text-align: center;">لا توجد منتجات مضافة حالياً.</p>';
            return;
        }

        products.forEach(product => {
            // التحقق من حالة المخزون (لو متوفر أو خلصان)
            const inStock = product.inStock !== false;
            
            const actionButton = inStock 
                ? `<button onclick="buyProduct('${product.name}', ${product.price})" style="background: #06b6d4; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">شراء الآن 🛒</button>`
                : `<button disabled style="background: #64748b; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: not-allowed; width: 100%;">نفذت الكمية (Out of Stock)</button>`;

            container.innerHTML += `
                <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 10px; padding: 15px; text-align: center; color: #fff;">
                    <img src="http://localhost:5000${product.image}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px;">
                    <h3 style="color: #38bdf8; margin: 10px 0 5px;">${product.name}</h3>
                    <p style="color: #94a3b8; font-size: 13px;">القسم: ${product.category} | ${product.subType || ''}</p>
                    <p style="font-size: 14px; color: #cbd5e1;">${product.description || ''}</p>
                    <p style="color: #4ade80; font-weight: bold; font-size: 18px;">${product.price} ج.م</p>
                    ${actionButton}
                </div>
            `;
        });
    } catch (err) {
        console.error('تعذر جلب المنتجات:', err);
    }
}

// دالة الشراء وربطها بالواتساب والسيرفر برقمك (201017229055)
async function buyProduct(productName, productPrice) {
    const customerName = prompt("أدخل اسمك الكريم:");
    if (!customerName) return;
    
    const phone = prompt("أدخل رقم هاتفك للتواصل:");
    if (!phone) return;

    const address = prompt("أدخل عنوان الاستلام بالتفصيل:");
    if (!address) return;

    const orderData = { customerName, phone, address, productName, price: productPrice };

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
            alert('حدث خطأ أثناء تسجيل الطلب.');
        }
    } catch (err) {
        alert('تعذر الاتصال بالسيرفر!');
    }
}

document.addEventListener('DOMContentLoaded', loadStoreProducts);