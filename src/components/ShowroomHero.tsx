'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cars } from '../data/cars';
import { Car } from '../types';

interface ShowroomHeroProps {
  onCarSelect: (car: Car) => void;
  onInventoryOpen: () => void;
}

export default function ShowroomHero({ onCarSelect, onInventoryOpen }: ShowroomHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const availableCars = cars.filter(car => 
    car.status === 'available' || 
    car.status === 'جديدة' || 
    car.status === 'بطاقة جمركية'
  );
  
  const currentCar = availableCars[currentIndex];

  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < availableCars.length) {
        const img = new Image();
        img.src = availableCars[index].heroImage;
      }
    };
    preloadImage(currentIndex - 1);
    preloadImage(currentIndex + 1);
  }, [currentIndex, availableCars]);

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
    const nextIndex = (currentIndex + 1) % availableCars.length;
    navigateToCar(nextIndex);
  }, [currentIndex, availableCars.length, navigateToCar]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + availableCars.length) % availableCars.length;
    navigateToCar(prevIndex);
  }, [currentIndex, availableCars.length, navigateToCar]);

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
    <div id="hero-showroom" className="relative w-full h-screen overflow-hidden bg-[#111315]">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, 
                rgba(44, 48, 50, 0.4) 0%, 
                rgba(27, 30, 32, 0.7) 50%,
                rgba(17, 19, 21, 0.95) 100%
              ),
              url('/backgrounds/riyadh-golden-hour.jpg')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div 
          className="absolute top-0 right-0 w-1/2 h-2/3 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(184, 176, 166, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
        <div 
          className={`relative transition-all duration-300 ease-out ${
            isTransitioning 
              ? direction === 'next' 
                ? 'opacity-0 translate-x-8' 
                : 'opacity-0 -translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
          style={{ width: '100%', maxWidth: '1400px', height: '70vh' }}
        >
          <img
            src={currentCar.heroImage}
            alt={currentCar.nameAr}
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.95) contrast(1.05)' }}
          />
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: '80%',
              height: '40px',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
              filter: 'blur(20px)'
            }}
          />
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-[45%] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(17,19,21,0.95) 0%, rgba(17,19,21,0.5) 50%, transparent 100%)'
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-32 md:px-12 md:pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full text-sm font-medium text-[#F3F0EA]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {currentCar.status}
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full text-sm font-medium text-[#F3F0EA]">
              {currentCar.year}
            </span>
            {currentCar.drivetrain && (
              <span className="inline-flex items-center px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full text-sm font-medium text-[#F3F0EA]">
                {currentCar.drivetrain}
              </span>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium tracking-widest text-[#B8B0A6] uppercase mb-2">
              {currentCar.brand} • {currentCar.name}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#F3F0EA] leading-tight">
              {currentCar.nameAr}
            </h1>
          </div>

          <div className="mb-8">
            <p className="text-sm text-[#B8B0A6] mb-1">السعر النقدي</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold text-[#F3F0EA]">
                {formatPrice(currentCar.price)}
              </span>
              <span className="text-xl md:text-2xl text-[#B8B0A6]">ريال</span>
            </div>
          </div>

          <button
            onClick={() => onCarSelect(currentCar)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F3F0EA] text-[#111315] font-semibold rounded-lg hover:bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <span>استعراض السيارة كاملة</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1B1E20]/60 backdrop-blur-md border border-[#3A3E40]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]/90 hover:border-[#C8CDD0] transition-all duration-200 active:scale-95"
        aria-label="السيارة السابقة"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1B1E20]/60 backdrop-blur-md border border-[#3A3E40]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]/90 hover:border-[#C8CDD0] transition-all duration-200 active:scale-95"
        aria-label="السيارة التالية"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div 
        className="absolute bottom-8 right-6 md:right-12 z-30 flex items-center gap-2 px-4 py-2 bg-[#111315]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full"
        dir="ltr"
      >
        <span className="text-lg font-bold text-[#F3F0EA]">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span className="text-sm text-[#B8B0A6]">/</span>
        <span className="text-sm text-[#B8B0A6]">
          {String(availableCars.length).padStart(2, '0')}
        </span>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {availableCars.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToCar(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#F3F0EA]'
                : 'w-2 h-2 bg-[#B8B0A6]/40 hover:bg-[#B8B0A6]/60'
            }`}
            aria-label={`الانتقال إلى السيارة ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={onInventoryOpen}
        className="absolute top-6 left-6 md:top-8 md:left-12 z-30 flex items-center gap-2 px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full text-sm font-medium text-[#F3F0EA] hover:bg-[#1B1E20] transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>المخزون السريع</span>
        <span className="text-xs text-[#B8B0A6]">({availableCars.length})</span>
      </button>

      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-6 md:px-12 md:py-8">
        <div 
          className="flex items-center justify-between"
          style={{ background: 'linear-gradient(to bottom, rgba(17,19,21,0.8) 0%, transparent 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B1E20] border border-[#3A3E40] rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-[#F3F0EA]">RC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-[#F3F0EA]">RAASHID CARS</h2>
              <p className="text-xs text-[#B8B0A6]">صالة العرض الرقمية</p>
            </div>
          </div>
          
          <Link href="/brands" className="flex items-center gap-2 px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full text-sm font-medium text-[#F3F0EA] hover:bg-[#1B1E20] transition-all">
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
