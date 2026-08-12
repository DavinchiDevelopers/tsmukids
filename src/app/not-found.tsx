import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Страница не найдена</h1>
        <p className="text-gray-500 mb-6">Sahifa topilmadi</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/ru/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            На главную (RU)
          </Link>
          <Link
            href="/uz/"
            className="inline-flex items-center justify-center border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Bosh sahifa (UZ)
          </Link>
        </div>
      </div>
    </div>
  );
}
