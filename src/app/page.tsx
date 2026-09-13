'use client';

import { useState } from 'react';
import ShowroomHero from '../components/ShowroomHero';
import CarDetailView from '../components/CarDetailView';
import QuickInventory from '../components/QuickInventory';
import { Car } from '../types';

export default function Home() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedCar(null);
  };

  if (selectedCar) {
    return <CarDetailView car={selectedCar} onBack={handleBack} />;
  }

  return (
    <>
      <ShowroomHero
        onCarSelect={handleCarSelect}
        onInventoryOpen={() => setIsInventoryOpen(true)}
      />

      {/* ===== الأقسام السفلية: تعريفي + معلومات الصالة + ثوابت + فوتر ===== */}
      <section className="relative bg-[#111315] px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* القسم التعريفي */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
              <div className="w-12 h-12 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-[#F3F0EA]">RC</span>
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-[#B8B0A6] uppercase">RAASHID CARS</p>
                <h2 className="text-xl font-bold text-[#F3F0EA]">معرض راشد للسيارات</h2>
              </div>
            </div>
            <p className="text-sm md:text-base text-[#B8B0A6] leading-relaxed">
              صالة العرض الرقمية الحصرية المتخصصة في أرقى السيارات الفاخرة والنادرة في مدينة
              الرياض. تجربة استعراض سينمائية بمعايير رفيعة.
            </p>
          </div>

          <div className="border-t border-[#8B5CF6]/15"></div>

          {/* معلومات الصالة */}
          <div>
            <h3 className="text-sm font-bold text-[#F3F0EA] mb-5">معلومات الصالة</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-[#B8B0A6]">الرياض، طريق خريص، المملكة العربية السعودية</span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[#B8B0A6]">السبت - الخميس: 9:00 صباحاً – 10:00 مساءً</span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                </svg>
                <a href="tel:+966580537317" dir="ltr" className="text-sm text-[#F3F0EA] hover:text-[#8B5CF6] transition-colors">
                  +966 58 053 7317
                </a>
                <a
                  href="https://wa.me/966580537317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  واتساب
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#8B5CF6]/15"></div>

          {/* ثوابت الصالة */}
          <div>
            <h3 className="text-sm font-bold text-[#F3F0EA] mb-4">ثوابت الصالة</h3>
            <p className="text-sm md:text-base text-[#B8B0A6] leading-relaxed mb-4">
              «السيارة هي البطل، والموقع هو صالة العرض الرقمية.»
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-full text-xs text-[#F3F0EA]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              جميع السيارات متوفرة للمعاينة الفورية
            </span>
          </div>

          <div className="border-t border-[#8B5CF6]/15"></div>

          {/* الفوتر: حقوق + كبسولة المصمم */}
          <div className="space-y-5 text-center">
            <p className="text-xs text-[#B8B0A6]">
              جميع الحقوق محفوظة © 2026 معرض راشد للسيارات — RAASHID CARS
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 rounded-full border border-[#8B5CF6]/25 bg-[#1B1E20]/60">
              <span className="w-8 h-8 bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#8B5CF6]">KJ</span>
              </span>
              <span className="text-sm font-semibold text-[#F3F0EA]">خالد الجراش</span>
              <span className="text-xs text-[#B8B0A6]">تصميم وتنفيذ الحلول الرقمية</span>
              <a href="tel:779184839" dir="ltr" className="text-xs font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
                779184839
              </a>
            </div>
          </div>

        </div>
      </section>

      <QuickInventory
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        onSelectCar={handleCarSelect}
      />
    </>
  );
}
