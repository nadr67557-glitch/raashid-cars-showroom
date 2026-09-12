'use client';

import { Car } from '../types';
import { cars } from '../data/cars';
import Link from 'next/link';

interface QuickInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar: (car: Car) => void;  // ✅ تم الإضافة
}

export default function QuickInventory({ 
  isOpen, 
  onClose, 
  onSelectCar  // ✅ تم الإضافة
}: QuickInventoryProps) {
  const availableCars: Car[] = cars.filter((car: Car) => 
    car.status === 'available' || 
    car.status === 'جديدة' || 
    car.status === 'بطاقة جمركية'
  );

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-y-0 md:right-0 md:left-auto md:w-[480px] md:max-w-full bg-[#111315] border-t md:border-t-0 md:border-l border-[#3A3E40]/60 rounded-t-3xl md:rounded-none max-h-[85vh] md:max-h-full overflow-hidden flex flex-col shadow-2xl">
        
        <div className="flex items-center justify-between p-6 border-b border-[#3A3E40]/60 bg-[#111315]">
          <div>
            <h2 className="text-xl font-bold text-[#F3F0EA]">المخزون السريع</h2>
            <p className="text-sm text-[#B8B0A6] mt-1">{availableCars.length} سيارة متوفرة</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-[#1B1E20] border border-[#3A3E40] rounded-full text-[#F3F0EA] hover:bg-[#2C3032] transition-all"
            aria-label="إغلاق القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {availableCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                onClick={() => {
                  onSelectCar(car);  // ✅ تم التعديل: استدعاء onSelectCar
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-3 bg-[#1B1E20] border border-[#3A3E40]/60 rounded-xl hover:border-[#C8CDD0] transition-all text-right group"
              >
                <div className="w-24 h-24 bg-[#111315] rounded-lg overflow-hidden flex-shrink-0 border border-[#3A3E40]/30">
                  <img
                    src={car.heroImage}
                    alt={car.nameAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#B8B0A6] mb-1 truncate">{car.brand} • {car.year}</p>
                  <h3 className="text-base font-semibold text-[#F3F0EA] mb-2 truncate group-hover:text-[#C8CDD0] transition-colors">
                    {car.nameAr}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#F3F0EA]">
                      {formatPrice(car.price)}
                    </span>
                    <span className="text-xs text-[#B8B0A6]">ريال</span>
                  </div>
                </div>

                <div className="text-[#B8B0A6] group-hover:text-[#F3F0EA] group-hover:translate-x-[-4px] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#3A3E40]/60 bg-[#111315] text-center">
          <p className="text-xs text-[#B8B0A6]">
            معرض راشد كارز للسيارات — الرياض
          </p>
        </div>
      </div>
    </>
  );
}
