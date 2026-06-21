export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">页面不存在</h1>
        <p className="text-gray-600 mb-6">你访问的页面不存在或已被移除</p>
        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          返回首页
        </a>
      </div>
    </div>
  );
}
