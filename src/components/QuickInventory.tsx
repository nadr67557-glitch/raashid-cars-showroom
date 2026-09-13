'use client';

import { useState } from 'react';
import { Car } from '../types';
import { cars } from '../data/cars';
import Link from 'next/link';

interface QuickInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar: (car: Car) => void;
}

// صورة مصغّرة مع Placeholder أنيق عند فشل التحميل (بدون أيقونة مكسورة)
function CarThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#1B1E20] border border-[#8B5CF6]/25 rounded-xl">
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

export default function QuickInventory({ isOpen, onClose, onSelectCar }: QuickInventoryProps) {
  const [query, setQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('الكل');
  const [yearFilter, setYearFilter] = useState<string>('الكل');

  const availableCars: Car[] = cars.filter((car: Car) => 
    car.status === 'available' || 
    car.status === 'متاحة' || 
    car.status === 'جديدة' || 
    car.status === 'بطاقة جمركية'
  );

  const brandChips: string[] = ['الكل', 'Nissan', 'Toyota', 'Lexus', 'Cadillac'];

  const yearOptions: string[] = Array.from(new Set(cars.map(c => String(c.year))))
    .sort((a, b) => Number(b) - Number(a));

  const filteredCars: Car[] = availableCars.filter((car: Car) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === '' ||
      car.nameAr.toLowerCase().includes(q) ||
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      String(car.year).includes(q);
    const matchesBrand = brandFilter === 'الكل' || car.brand === brandFilter;
    const matchesYear = yearFilter === 'الكل' || String(car.year) === yearFilter;
    return matchesQuery && matchesBrand && matchesYear;
  });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const resetFilters = () => {
    setQuery('');
    setBrandFilter('الكل');
    setYearFilter('الكل');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-y-0 md:right-0 md:left-auto md:w-[480px] md:max-w-full bg-[#111315] border-t md:border-t-0 md:border-l border-[#8B5CF6]/30 rounded-t-3xl md:rounded-none max-h-[88vh] md:max-h-full overflow-hidden flex flex-col shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        
        {/* مقبض السحب */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#3A3E40]"></div>
        </div>

        {/* الترويسة */}
        <div className="flex items-center justify-between px-6 pt-4 pb-4 md:pt-6 border-b border-[#8B5CF6]/20 bg-[#111315]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-[#F3F0EA]">RC</span>
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-[#B8B0A6] uppercase">RAASHID CARS</p>
              <h2 className="text-lg font-bold text-[#F3F0EA]">المخزون السريع</h2>
            </div>
            <span className="px-3 py-1 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs font-medium text-[#F3F0EA]">
              {filteredCars.length} سيارات
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all"
            aria-label="إغلاق القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* البحث والفلاتر */}
        <div className="px-6 py-4 border-b border-[#8B5CF6]/15 bg-[#111315] space-y-3">
          <div className="relative">
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم، الموديل، الماركة..."
              className="w-full pr-11 pl-4 py-3 bg-[#1B1E20] border border-[#8B5CF6]/25 rounded-full text-sm text-[#F3F0EA] placeholder-[#B8B0A6]/60 focus:outline-none focus:border-[#8B5CF6]/60 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {brandChips.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  brandFilter === brand
                    ? 'bg-[#F3F0EA] text-[#111315]'
                    : 'bg-[#1B1E20] border border-[#8B5CF6]/25 text-[#B8B0A6] hover:border-[#8B5CF6]/50 hover:text-[#F3F0EA]'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-[#B8B0A6] whitespace-nowrap">سنة الصنع</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#1B1E20] border border-[#8B5CF6]/25 rounded-xl text-sm text-[#F3F0EA] focus:outline-none focus:border-[#8B5CF6]/60 transition-colors"
            >
              <option value="الكل">الكل</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* قائمة النتائج */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-[#B8B0A6]">لا توجد نتائج مطابقة لبحثك</p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs font-medium text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  onClick={() => {
                    onSelectCar(car);
                    onClose();
                  }}
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
                      <span className="text-lg font-bold text-[#F3F0EA]">
                        {formatPrice(car.price)}
                      </span>
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
        </div>

        {/* التذييل */}
        <div className="p-4 border-t border-[#8B5CF6]/20 bg-[#111315] text-center">
          <p className="text-xs text-[#B8B0A6]">
            معرض راشد كارز للسيارات — طريق خريص، الرياض
          </p>
        </div>
      </div>
    </>
  );
}
