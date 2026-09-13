import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center mb-6">
        <span className="text-sm font-bold text-[#F3F0EA]">RC</span>
      </div>
      <p className="text-6xl font-bold text-[#8B5CF6] mb-4" dir="ltr">404</p>
      <h1 className="text-xl font-bold mb-2">الصفحة غير موجودة</h1>
      <p className="text-sm text-[#B8B0A6] mb-8 max-w-xs">
        الرابط الذي تبحث عنه غير متاح أو تم نقله إلى عنوان آخر.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#8B5CF6] text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#7C3AED] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
