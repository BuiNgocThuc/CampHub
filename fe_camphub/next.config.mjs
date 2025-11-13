/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "images.unsplash.com", // ✅ Cho phép ảnh từ Unsplash
            "res.cloudinary.com",  // (nếu sau này bạn dùng Cloudinary)
            "lh3.googleusercontent.com", // (nếu dùng Google Avatar)
        ],
    },
};

export default nextConfig;
