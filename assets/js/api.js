export async function getProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('فشل في جلب البيانات من السيرفر');
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}