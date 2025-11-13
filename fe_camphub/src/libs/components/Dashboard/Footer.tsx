"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-50 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        {/* Left */}
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">CampHub</span>. All rights reserved.
        </p>

        {/* Right */}
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:text-blue-600">
            Chính sách bảo mật
          </a>
          <a href="/terms" className="hover:text-blue-600">
            Điều khoản sử dụng
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
}
