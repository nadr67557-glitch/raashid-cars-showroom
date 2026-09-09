'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car } from '@/types';

export default function BrandCarsClient({ brandName, cars, models }: { 
  brandName: string; 
  cars: Car[]; 
  models: string[];
}) {
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filteredCars = activeFilter === 'الكل' 
    ? cars 
    : cars.filter(car => (car.model || car.category) === activeFilter);

  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA]">
      <header className="sticky top-0 z-40 bg-[#111315]/95 backdrop-blur-md border-b border-[#3A3E40]/60">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-[#F3F0EA]">{brandName.toUpperCase()}</h1>
            <p className="text-[#B8B0A6] mt-1 text-sm md:text-base">سيارات {brandName} المتوفرة لدى معرض راشد كارز</p>
          </div>
          <div className="flex gap-3">
            <Link href="/brands" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B1E20] border border-[#3A3E40] rounded-lg text-[#F3F0EA] hover:border-[#C8CDD0] transition-all text-sm font-medium">
              الماركات
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B1E20] border border-[#3A3E40] rounded-lg text-[#F3F0EA] hover:border-[#C8CDD0] transition-all text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              المعرض
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {models.length > 1 && (
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('الكل')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'الكل' ? 'bg-[#F3F0EA] text-[#111315]' : 'bg-[#1B1E20] text-[#B8B0A6] border border-[#3A3E40] hover:text-[#F3F0EA]'
              }`}
            >
              الكل ({cars.length})
            </button>
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setActiveFilter(model)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === model ? 'bg-[#F3F0EA] text-[#111315]' : 'bg-[#1B1E20] text-[#B8B0A6] border border-[#3A3E40] hover:text-[#F3F0EA]'
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link 
              key={car.id} 
              href={`/cars/${car.id}`}
              className="group block bg-[#1B1E20] border border-[#3A3E40]/60 rounded-xl overflow-hidden hover:border-[#C8CDD0]/50 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-[#111315] overflow-hidden">
                <img
                  src={car.heroImage}
                  alt={car.nameAr}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {car.status && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-[#111315]/80 backdrop-blur-sm border border-[#3A3E40] rounded-full text-xs text-[#F3F0EA]">
                    {car.status}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-[#B8B0A6] uppercase tracking-wider mb-1">{car.brand} • {car.year}</p>
                    <h3 className="text-lg font-bold text-[#F3F0EA] leading-tight">{car.nameAr}</h3>
                    {(car.model || car.category) && <p className="text-sm text-[#C8CDD0] mt-1">{car.model || car.category}</p>}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xl font-bold text-[#F3F0EA]">
                    {new Intl.NumberFormat('en-US').format(car.price)}
                  </span>
                  <span className="text-sm text-[#B8B0A6]">ريال</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#3A3E40]/60">
                  <div className="flex gap-3 text-xs text-[#B8B0A6]">
                    <span>{car.fuelType}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                  </div>
                  <span className="text-sm font-medium text-[#F3F0EA] group-hover:text-[#C8CDD0] transition-colors flex items-center gap-1">
                    مشاهدة السيارة
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20 text-[#B8B0A6]">
            لا توجد سيارات متطابقة مع هذا الفلتر حالياً.
          </div>
        )}
      </main>
    </div>
  );
}
