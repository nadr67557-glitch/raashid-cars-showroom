'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cars } from '../data/cars';
import { Car } from '../types';

interface ShowroomHeroProps {
  onCarSelect: (car: Car) => void;
  onInventoryOpen: () => void;
}

// سيارات الـ Hero فقط (الترتيب والعدد ثابتان)
const HERO_CAR_IDS: string[] = [
  'lexus-lx600-fsport-2026',
  'nissan-patrol-platinum-tt-2026',
  'cadillac-escalade-sport-2025',
  'toyota-land-cruiser-l5-al-sayer-2026'
];

export default function ShowroomHero({ onCarSelect, onInventoryOpen }: ShowroomHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // عدد المخزون الكامل (13)
  const availableCars = cars.filter(car => 
    car.status === 'available' || 
    car.status === 'متاحة' || 
    car.status === 'جديدة' || 
    car.status === 'بطاقة جمركية'
  );

  // قائمة الـ Hero: 4 سيارات بالترتيب المحدد
  const heroCars: Car[] = HERO_CAR_IDS
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is Car => car !== undefined);
  
  const currentCar = heroCars[currentIndex];

  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < heroCars.length) {
        const img = new Image();
        img.src = heroCars[index].heroImage;
      }
    };
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  }, [currentIndex, heroCars]);

  const navigateToCar = useCallback((index: number) => {
    if (isTransitioning) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentIndex, isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % heroCars.length;
    navigateToCar(nextIndex);
  }, [currentIndex, heroCars.length, navigateToCar]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + heroCars.length) % heroCars.length;
    navigateToCar(prevIndex);
  }, [currentIndex, heroCars.length, navigateToCar]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToNext();
      if (e.key === 'ArrowRight') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext();
        else goToPrev();
      }
    };

    const heroElement = document.getElementById('hero-showroom');
    if (heroElement) {
      heroElement.addEventListener('touchstart', handleTouchStart);
      heroElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('touchstart', handleTouchStart);
        heroElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [goToNext, goToPrev]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (!currentCar) return null;

  return (
    <div
      id="hero-showroom"
      className="relative w-full min-h-screen md:h-screen md:overflow-hidden bg-[#111315]"
      style={{ minHeight: '100dvh' }}
    >
      {/* الخلفية الفحمية مع لمسة بنفسجية سينمائية */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
          }}
        />
        <div 
          className="absolute top-0 right-0 w-1/2 h-2/3 opacity-25"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* التدرج السفلي: كمبيوتر فقط */}
      <div 
        className="hidden md:block absolute bottom-0 left-0 right-0 h-[45%] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(17,19,21,0.95) 0%, rgba(17,19,21,0.5) 50%, transparent 100%)'
        }}
      />

      {/* الجوال: تدفق طبيعي قابل للتمرير / الكمبيوتر: كما هو */}
      <div className="relative z-10 flex flex-col md:block md:h-full">

        {/* بطاقة الصورة + الأسهم على حوافها */}
        <div className="relative z-10 mt-32 md:mt-0 md:absolute md:inset-0 md:flex md:items-center md:justify-center px-6 md:px-4">
          <div 
            className={`relative h-[30vh] md:h-[70vh] w-full max-w-[1200px] transition-all duration-300 ease-out ${
              isTransitioning 
                ? direction === 'next' 
                  ? 'opacity-0 translate-x-8' 
                  : 'opacity-0 -translate-x-8'
                : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-[#8B5CF6]/40 bg-[#111315] shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <img
                src={currentCar.heroImage}
                alt={currentCar.nameAr}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(1.02) contrast(1.05)' }}
              />
            </div>

            <button
              onClick={goToPrev}
              className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#1B1E20]/90 backdrop-blur-md border border-[#8B5CF6]/50 text-[#F3F0EA] hover:bg-[#8B5CF6]/30 hover:shadow-[0_0_14px_rgba(139,92,246,0.4)] transition-all duration-200 active:scale-95"
              aria-label="السيارة السابقة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#8B5CF6]/80 backdrop-blur-md border border-[#8B5CF6]/60 text-[#F3F0EA] hover:bg-[#8B5CF6] hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] transition-all duration-200 active:scale-95"
              aria-label="السيارة التالية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* المعلومات: تحت الصورة في الجوال / مثبّتة أسفل في الكمبيوتر */}
        <div className="relative z-20 px-6 pt-5 pb-2 text-center md:text-right md:pt-0 md:pb-32 md:absolute md:bottom-0 md:left-0 md:right-0 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 md:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#8B5CF6]/15 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-xs md:text-sm font-medium text-[#F3F0EA]">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {currentCar.status === 'available' ? 'متاحة' : currentCar.status}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-[#8B5CF6]/15 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-xs md:text-sm font-medium text-[#F3F0EA]">
                موديل {currentCar.year}
              </span>
              {currentCar.drivetrain && (
                <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-[#8B5CF6]/15 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-xs md:text-sm font-medium text-[#F3F0EA]">
                  {currentCar.drivetrain}
                </span>
              )}
            </div>

            <div className="mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-[#B8B0A6] uppercase mb-2">
                {currentCar.brand} • موديل {currentCar.year}
              </p>
              <h1 className="text-2xl md:text-5xl font-bold text-[#F3F0EA] leading-tight mb-2">
                {currentCar.nameAr}
              </h1>
              <p className="text-xs md:text-base font-semibold tracking-[0.15em] text-[#8B5CF6] uppercase">
                {currentCar.name}
              </p>
            </div>

            <div className="mb-5 md:mb-8">
              <p className="text-sm text-[#B8B0A6] mb-1">السعر النقدي</p>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-3xl md:text-5xl font-bold text-[#F3F0EA]">
                  {formatPrice(currentCar.price)}
                </span>
                <span className="text-lg md:text-2xl text-[#B8B0A6]">ريال</span>
              </div>
            </div>

            <button
              onClick={() => onCarSelect(currentCar)}
              className="inline-flex items-center gap-3 px-8 py-3.5 md:py-4 bg-[#8B5CF6] text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#7C3AED] transition-all duration-200 hover:-translate-y-1 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]"
            >
              <span>استعراض السيارة كاملة</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* الصف السفلي: كبسولة النقاط + كبسولة العداد */}
        <div className="relative z-20 mt-3 pb-6 flex items-center justify-center gap-4 md:contents">
          <div className="z-30 flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#8B5CF6]/30 bg-[#111315]/80 backdrop-blur-md md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2">
            {heroCars.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToCar(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                    : 'bg-[#B8B0A6]/40 hover:bg-[#B8B0A6]/60'
                }`}
                style={
                  index === currentIndex
                    ? { width: '28px', height: '8px', minWidth: 0, minHeight: 0, padding: 0, flexShrink: 0 }
                    : { width: '8px', height: '8px', minWidth: 0, minHeight: 0, padding: 0, flexShrink: 0 }
                }
                aria-label={`الانتقال إلى السيارة ${index + 1}`}
              />
            ))}
          </div>

          <div 
            className="z-30 flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#8B5CF6]/30 bg-[#111315]/80 backdrop-blur-md md:absolute md:bottom-8 md:right-6 md:right-12"
            dir="ltr"
          >
            <span className="text-lg font-bold text-[#F3F0EA]">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-[#6B6B6B]">/</span>
            <span className="text-sm text-[#B8B0A6]">
              {String(heroCars.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* زر المخزون السريع: كبسولة بنفسجية */}
      <button
        onClick={onInventoryOpen}
        className="absolute top-20 left-6 md:top-8 md:left-12 z-30 flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6]/15 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-sm font-medium text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>المخزون السريع</span>
        <span className="text-xs text-[#B8B0A6]">({availableCars.length})</span>
      </button>

      {/* الهيدر: شعار بإطار بنفسجي + كبسولة الماركات */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-6 md:px-12 md:py-8">
        <div 
          className="flex items-center justify-between"
          style={{ background: 'linear-gradient(to bottom, rgba(17,19,21,0.8) 0%, transparent 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-[#F3F0EA]">RC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-[#F3F0EA]">RAASHID CARS</h2>
              <p className="text-xs text-[#B8B0A6]">معرض راشد كارز — الرياض</p>
            </div>
          </div>
          
          <Link href="/brands" className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6]/15 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-sm font-medium text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all">
            <span>الماركات</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
