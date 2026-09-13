import Link from 'next/link';
import { cars } from '../../data/cars';

export const metadata = {
  title: 'الماركات | معرض راشد كارز للسيارات',
  description: 'تصفح سيارات معرض راشد كارز حسب الماركة: نيسان، تويوتا، لكزس، كاديلاك',
};

const brands = [
  { slug: 'nissan', nameAr: 'نيسان', nameEn: 'Nissan', letter: 'N' },
  { slug: 'toyota', nameAr: 'تويوتا', nameEn: 'Toyota', letter: 'T' },
  { slug: 'lexus', nameAr: 'لكزس', nameEn: 'Lexus', letter: 'L' },
  { slug: 'cadillac', nameAr: 'كاديلاك', nameEn: 'Cadillac', letter: 'C' },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA]">
      <header className="sticky top-0 z-40 bg-[#111315]/95 backdrop-blur-md border-b border-[#8B5CF6]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#B8B0A6] hover:text-[#F3F0EA] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">العودة للمعرض</span>
          </Link>
          <div className="w-8 h-8 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-[#F3F0EA]">RC</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-widest text-[#B8B0A6] uppercase mb-2">RAASHID CARS</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">الماركات</h1>
          <p className="text-sm text-[#B8B0A6]">اختر ماركتك المفضلة لاستعراض سياراتها المتاحة</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand) => {
            const count = cars.filter((c) => c.brand === brand.nameEn).length;
            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center gap-4 p-6 bg-[#1B1E20]/60 border border-[#8B5CF6]/20 rounded-2xl hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center group-hover:shadow-[0_0_18px_rgba(139,92,246,0.35)] transition-all">
                  <span className="text-xl font-bold text-[#8B5CF6]">{brand.letter}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#F3F0EA] mb-1">{brand.nameAr}</h2>
                  <p className="text-[10px] tracking-widest text-[#B8B0A6] uppercase">{brand.nameEn}</p>
                </div>
                <span className="px-3 py-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-full text-xs text-[#F3F0EA]">
                  {count} سيارة
                </span>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-[#8B5CF6]/20 py-8 px-6 mt-12 bg-[#0a0a0a]">
        <div className="space-y-4 text-center">
          <p className="text-xs text-[#B8B0A6]">
            جميع الحقوق محفوظة © 2026 معرض راشد للسيارات — RAASHID CARS
          </p>
          <div className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-[#8B5CF6]/25 bg-[#1B1E20]/60">
            <span className="w-8 h-8 self-center bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#8B5CF6]">KJ</span>
            </span>
            <span className="self-center flex flex-col items-center leading-tight text-center">
              <span className="text-sm font-semibold text-[#F3F0EA]">خالد الجراش</span>
              <span className="text-[10px] text-[#B8B0A6]">تصميم وتنفيذ الحلول الرقمية</span>
            </span>
            <a
              href="tel:779184839"
              dir="ltr"
              className="h-9 self-center flex items-center text-xs font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors flex-shrink-0"
            >
              779184839
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
