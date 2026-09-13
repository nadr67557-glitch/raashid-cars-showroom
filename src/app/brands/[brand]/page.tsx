'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cars } from '../../../data/cars';
import { Car } from '../../../types';

const brandMeta: Record<string, { nameAr: string; nameEn: string; letter: string }> = {
  nissan: { nameAr: 'نيسان', nameEn: 'Nissan', letter: 'N' },
  toyota: { nameAr: 'تويوتا', nameEn: 'Toyota', letter: 'T' },
  lexus: { nameAr: 'لكزس', nameEn: 'Lexus', letter: 'L' },
  cadillac: { nameAr: 'كاديلاك', nameEn: 'Cadillac', letter: 'C' },
};

// صورة مع Placeholder بنفسجي عند فشل التحميل
function CarThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#1B1E20]">
        <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#8B5CF6]">RC</span>
        </div>
        <span className="text-[9px] text-[#B8B0A6] text-center px-1 truncate w-full">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
  );
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const meta = brandMeta[params.brand];

  useEffect(() => {
    if (meta) {
      document.title = `سيارات ${meta.nameAr} | معرض راشد كارز`;
    }
  }, [meta]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#111315] text-[#F3F0EA] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl font-bold text-[#8B5CF6] mb-4" dir="ltr">404</p>
        <h1 className="text-xl font-bold mb-2">الماركة غير موجودة</h1>
        <Link href="/brands" className="mt-6 px-6 py-3 bg-[#8B5CF6] text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#7C3AED] transition-all">
          العودة للماركات
        </Link>
      </div>
    );
  }

  const brandCars: Car[] = cars.filter((c) => c.brand === meta.nameEn);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA]">
      <header className="sticky top-0 z-40 bg-[#111315]/95 backdrop-blur-md border-b border-[#8B5CF6]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/brands" className="flex items-center gap-2 text-[#B8B0A6] hover:text-[#F3F0EA] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">كل الماركات</span>
          </Link>
          <div className="w-8 h-8 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-[#F3F0EA]">RC</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center">
            <span className="text-lg font-bold text-[#8B5CF6]">{meta.letter}</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{meta.nameAr}</h1>
            <p className="text-xs tracking-widest text-[#B8B0A6] uppercase">{meta.nameEn} • {brandCars.length} سيارة</p>
          </div>
        </div>

        {brandCars.length === 0 ? (
          <p className="text-sm text-[#B8B0A6] text-center py-16">لا توجد سيارات متاحة لهذه الماركة حاليًا</p>
        ) : (
          <div className="space-y-4">
            {brandCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="w-full flex items-center gap-4 p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-2xl hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/15 transition-all text-right group"
              >
                <div className="w-24 h-24 bg-[#111315] rounded-xl overflow-hidden flex-shrink-0 border border-[#8B5CF6]/20">
                  <CarThumb src={car.heroImage} alt={car.nameAr} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#B8B0A6] mb-1 truncate">
                    {car.year} • {car.drivetrain || car.brand}
                  </p>
                  <h3 className="text-base font-semibold text-[#F3F0EA] mb-2 truncate group-hover:text-[#A78BFA] transition-colors">
                    {car.nameAr}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#F3F0EA]">{formatPrice(car.price)}</span>
                    <span className="text-xs text-[#B8B0A6]">ريال</span>
                  </div>
                </div>

                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[#1B1E20] border border-[#8B5CF6]/30 text-[#8B5CF6] group-hover:bg-[#8B5CF6]/20 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
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
