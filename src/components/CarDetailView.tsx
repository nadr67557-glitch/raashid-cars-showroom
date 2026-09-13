'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Car } from '../types';

interface CarDetailViewProps {
  car: Car;
  onBack: () => void;
}

// صورة مع Placeholder بنفسجي أنيق عند فشل التحميل
function CarImage({ src, alt, className = '', style, draggable = true }: { src: string; alt: string; className?: string; style?: React.CSSProperties; draggable?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center gap-3 bg-[#1B1E20] ${className}`} style={style}>
        <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center">
          <span className="text-sm font-bold text-[#8B5CF6]">RC</span>
        </div>
        <span className="text-xs text-[#B8B0A6] text-center px-3">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      style={style}
      draggable={draggable}
      loading="lazy"
    />
  );
}

export default function CarDetailView({ car, onBack }: CarDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior' | 'details'>('exterior');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const getTabImages = () => car.gallery[activeTab] || [];
  const tabImages = getTabImages();

  const getAllImages = () => [
    ...(car.gallery.exterior || []),
    ...(car.gallery.interior || []),
    ...(car.gallery.details || [])
  ];
  const allImages = getAllImages();

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % tabImages.length);
  }, [tabImages.length]);

  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + tabImages.length) % tabImages.length);
  }, [tabImages.length]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNextImage();
      else goToPrevImage();
    }
  };

  const handleWhatsApp = () => {
    const message = `السلام عليكم، أرغب بالاستفسار عن ${car.nameAr} ${car.year}، السعر ${formatPrice(car.price)} ريال.`;
    window.open(`https://wa.me/966580537317?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+966580537317';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: car.nameAr,
          text: `${car.nameAr} - ${car.year} - ${formatPrice(car.price)} ريال`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط');
    }
  };

  const handleHaraj = () => {
    window.open(car.harajUrl, '_blank');
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  // استخراج المواصفات الكاملة من البيانات
  const buildFullSpecs = () => {
    const specsList: { label: string; value: string }[] = [];

    if (car.engine) specsList.push({ label: 'المحرك', value: car.engine });
    if (car.engineType) specsList.push({ label: 'نوع المحرك', value: car.engineType });
    if (car.cylinders) specsList.push({ label: 'عدد السلندرات', value: car.cylinders });
    if (car.horsepower) specsList.push({ label: 'القوة', value: car.horsepower });
    if (car.torque) specsList.push({ label: 'العزم', value: car.torque });
    if (car.transmission) specsList.push({ label: 'ناقل الحركة', value: car.transmission });
    if (car.drivetrain) specsList.push({ label: 'نظام الدفع', value: car.drivetrain });
    if (car.fuelType) specsList.push({ label: 'الوقود', value: car.fuelType });
    if (car.fuelTankCapacity) specsList.push({ label: 'سعة خزان الوقود', value: car.fuelTankCapacity });
    if (car.fuelEfficiency) specsList.push({ label: 'كفاءة الاستهلاك', value: car.fuelEfficiency });
    if (car.mileage !== undefined) specsList.push({ label: 'عداد الكيلومترات', value: `${car.mileage} كم` });
    if (car.color) specsList.push({ label: 'اللون الخارجي', value: car.color });
    if (car.interiorColor) specsList.push({ label: 'اللون الداخلي', value: car.interiorColor });
    if (car.agent) specsList.push({ label: 'الوكيل', value: car.agent });
    if (car.warranty) specsList.push({ label: 'الضمان', value: car.warranty });
    if (car.description) specsList.push({ label: 'ملاحظات', value: car.description });

    if (car.specs && car.specs.length > 0) {
      car.specs.forEach(spec => {
        if (!specsList.some(s => s.label === spec.label)) {
          specsList.push({ label: spec.label, value: spec.value });
        }
      });
    }

    if (car.features && typeof car.features === 'object') {
      const labelMap: Record<string, string> = {
        engineSize: 'سعة المحرك', turbo: 'نوع الشحن', transmissionSpeeds: 'ناقل الحركة',
        dualMode: 'نظام الدفع', differential: 'نظام الدفرنس', sunroof: 'فتحة السقف',
        wheels: 'الجنوط', ledLights: 'الإضاءة', leatherSeats: 'المقاعد',
        powerSeats: 'تعديل المقاعد', fridge: 'الثلاجة', radar: 'الرادار',
        audioSystem: 'النظام الصوتي'
      };
      Object.entries(car.features).forEach(([key, value]) => {
        if (value) {
          const label = labelMap[key] || key;
          if (!specsList.some(s => s.label === label)) {
            specsList.push({ 
              label, 
              value: typeof value === 'string' ? value : String(value) 
            });
          }
        }
      });
    }

    return specsList;
  };

  const fullSpecs = buildFullSpecs();

  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA] pb-20">
      <header className="sticky top-0 z-40 bg-[#111315]/95 backdrop-blur-md border-b border-[#8B5CF6]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#B8B0A6] hover:text-[#F3F0EA] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">العودة للمعرض</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-[#8B5CF6]/40 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#F3F0EA]">RC</span>
            </div>
          </div>
        </div>
      </header>

      {/* الصورة الرئيسية بنمط حراج — عرض كامل */}
      <section className="relative w-full h-[45vh] md:h-[65vh] overflow-hidden bg-[#0a0a0a]">
        <div 
          onClick={() => openLightbox(allImages.indexOf(tabImages[currentImageIndex] || car.heroImage))}
          className="absolute inset-0 flex items-center justify-center cursor-zoom-in"
        >
          <CarImage
            src={tabImages[currentImageIndex] || car.heroImage}
            alt={car.nameAr}
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(1.02) contrast(1.05)' }}
          />
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(17,19,21,1) 0%, rgba(17,19,21,0.6) 50%, transparent 100%)' }}
        />

        {tabImages.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); goToPrevImage(); }} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#8B5CF6]/80 backdrop-blur-md border border-[#8B5CF6]/60 text-[#F3F0EA] hover:bg-[#8B5CF6] hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToNextImage(); }} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#8B5CF6]/80 backdrop-blur-md border border-[#8B5CF6]/60 text-[#F3F0EA] hover:bg-[#8B5CF6] hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </>
        )}

        <div className="absolute bottom-24 right-4 md:right-12 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#111315]/80 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full" dir="ltr">
          <span className="text-sm font-bold text-[#F3F0EA]">{String(currentImageIndex + 1).padStart(2, '0')}</span>
          <span className="text-xs text-[#B8B0A6]">/</span>
          <span className="text-xs text-[#B8B0A6]">{String(tabImages.length).padStart(2, '0')}</span>
        </div>

        {/* شارة اضغط للتكبير */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#111315]/80 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-xs text-[#B8B0A6]">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          اضغط للتكبير
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs font-medium text-[#F3F0EA]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {car.status === 'available' ? 'متاحة' : car.status}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs font-medium text-[#F3F0EA]">
              موديل {car.year}
            </span>
            {car.brand && (
              <span className="inline-flex items-center px-3 py-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs font-medium text-[#F3F0EA]">
                {car.brand}
              </span>
            )}
          </div>

          <p className="text-sm font-medium tracking-widest text-[#B8B0A6] uppercase mb-2">{car.brand} • {car.year}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F3F0EA] mb-2">{car.nameAr}</h1>
          <p className="text-sm md:text-base font-semibold tracking-[0.15em] text-[#8B5CF6] uppercase mb-4">{car.name}</p>
          
          {car.category && <p className="text-lg text-[#C8CDD0] mb-4">{car.category}</p>}
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl md:text-5xl font-bold text-[#F3F0EA]">{formatPrice(car.price)}</span>
            <span className="text-xl text-[#B8B0A6]">ريال</span>
          </div>

          {/* الأزرار الأربعة بالهوية البنفسجية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-[0_0_15px_rgba(34,197,94,0.25)]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>واتساب</span>
            </button>
            <button onClick={handleCall} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#8B5CF6]/25 hover:border-[#8B5CF6]/50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>اتصال</span>
            </button>
            <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#8B5CF6]/25 hover:border-[#8B5CF6]/50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              <span>مشاركة</span>
            </button>
            <button onClick={handleHaraj} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#F3F0EA] font-semibold rounded-xl hover:bg-[#8B5CF6]/25 hover:border-[#8B5CF6]/50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <span>حراج</span>
            </button>
          </div>
        </div>

        {/* شريط تواصل لاصق — لمسة احترافية */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111315]/95 backdrop-blur-md border-t border-[#8B5CF6]/30 p-3 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <button onClick={handleWhatsApp} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>واتساب</span>
          </button>
          <button onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-all shadow-[0_0_15px_rgba(139,92,246,0.35)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span>اتصال</span>
          </button>
        </div>

        {/* قسم المعلومات الكاملة — بعد الأزرار الأربعة */}
        {fullSpecs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#F3F0EA] mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#8B5CF6] rounded-full"></div>
              المعلومات الكاملة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fullSpecs.map((spec, idx) => (
                <div key={idx} className="bg-[#1B1E20]/60 border border-[#8B5CF6]/20 rounded-xl p-4 flex justify-between items-center hover:border-[#8B5CF6]/50 transition-all">
                  <span className="text-sm text-[#B8B0A6]">{spec.label}</span>
                  <span className="text-base font-semibold text-[#F3F0EA] text-left">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* معرض الصور بالتبويبات — الشرط المصحح */}
        {allImages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#F3F0EA] mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#8B5CF6] rounded-full"></div>
              معرض الصور
            </h2>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[#8B5CF6]/20">
              {(['exterior', 'interior', 'details'] as const).map((tab) => {
                const count = car.gallery[tab]?.length || 0;
                if (count === 0) return null;
                const labels = { exterior: 'الخارجية', interior: 'الداخلية', details: 'التفاصيل' };
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentImageIndex(0); }}
                    className={`px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-[#8B5CF6]/15 text-[#F3F0EA] border-b-2 border-[#8B5CF6]' 
                        : 'text-[#B8B0A6] hover:text-[#F3F0EA]'
                    }`}
                  >
                    {labels[tab]} ({count})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tabImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(allImages.indexOf(img))}
                  className={`relative aspect-[4/3] bg-[#1B1E20] rounded-xl overflow-hidden cursor-pointer group border ${
                    idx === currentImageIndex ? 'border-[#8B5CF6]' : 'border-[#8B5CF6]/20'
                  } hover:border-[#8B5CF6]/60 transition-all`}
                >
                  <CarImage 
                    src={img} 
                    alt={`${car.nameAr} ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 left-2 w-7 h-7 bg-[#111315]/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3.5 h-3.5 text-[#F3F0EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الخدمات المجانية والتمويل */}
        {(car.financing || (car.freeServices && car.freeServices.length > 0)) && (
          <div className="mb-12 space-y-6">
            {car.freeServices && car.freeServices.length > 0 && (
              <div className="bg-[#1B1E20]/60 border border-[#8B5CF6]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#F3F0EA] mb-4 flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#8B5CF6] rounded-full"></div>
                  خدمات مجانية بعد الشراء
                </h3>
                <ul className="space-y-2">
                  {car.freeServices.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#B8B0A6]">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {car.financing && (
              <div className="bg-[#1B1E20]/60 border border-[#8B5CF6]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#F3F0EA] mb-4 flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#8B5CF6] rounded-full"></div>
                  خيارات التمويل
                </h3>
                <p className="text-[#B8B0A6] mb-4">متوفر إيجار منتهي بالتمليك عبر الجهات التالية:</p>
                <div className="flex flex-wrap gap-2">
                  {car.financing.banks?.map((bank, idx) => (
                    <span key={idx} className="px-4 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-full text-sm text-[#F3F0EA]">{bank}</span>
                  ))}
                </div>
                <p className="text-xs text-[#B8B0A6] mt-4">* للتفاصيل الدقيقة حول القسط والدفعة الأولى، يرجى التواصل مع المعرض.</p>
              </div>
            )}
          </div>
        )}

        {/* معلومات التواصل في نهاية الصفحة */}
        <div className="mb-12 bg-[#1B1E20]/60 border border-[#8B5CF6]/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#F3F0EA] mb-4 flex items-center gap-3">
            <div className="w-1 h-5 bg-[#8B5CF6] rounded-full"></div>
            تواصل مع المعرض
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="h-9 flex items-center text-sm text-[#B8B0A6]">الرياض، طريق خريص، المملكة العربية السعودية</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              <a href="tel:+966580537317" dir="ltr" className="h-9 flex items-center text-sm font-medium text-[#F3F0EA] hover:text-[#8B5CF6] transition-colors">+966 58 053 7317</a>
              <a href="https://wa.me/966580537317" target="_blank" rel="noopener noreferrer" className="h-9 flex items-center gap-1.5 px-4 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 rounded-full text-xs text-[#F3F0EA] hover:bg-[#8B5CF6]/25 transition-all">واتساب</a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="h-9 flex items-center text-sm text-[#B8B0A6]">السبت - الخميس: 9:00 صباحاً – 10:00 مساءً</span>
            </div>
          </div>
        </div>
      </main>

      {/* الفوتر بنفس نمط الصفحة الرئيسية */}
      <footer className="border-t border-[#8B5CF6]/20 py-10 px-6 mt-12 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto space-y-5 text-center">
          <p className="text-xs text-[#B8B0A6]">
            جميع الحقوق محفوظة © 2026 معرض راشد للسيارات — RAASHID CARS
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-[#8B5CF6]/25 bg-[#1B1E20]/60">
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

      {/* Lightbox محسّن */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D0F10]/98 flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={closeLightbox} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 border border-[#8B5CF6]/30 rounded-full text-[#F3F0EA] hover:bg-[#8B5CF6]/20 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex gap-2">
              <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 border border-[#8B5CF6]/30 rounded-full text-[#F3F0EA] hover:bg-[#8B5CF6]/20 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 border border-[#8B5CF6]/30 rounded-full text-[#F3F0EA] hover:bg-[#8B5CF6]/20 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>

          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {allImages[lightboxIndex] ? (
              <img
                src={allImages[lightboxIndex]}
                alt={car.nameAr}
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
                draggable={false}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#B8B0A6]">
                <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center">
                  <span className="text-base font-bold text-[#8B5CF6]">RC</span>
                </div>
                <span className="text-sm">لا توجد صور في هذا القسم</span>
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <>
              <button 
                onClick={() => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#8B5CF6]/80 backdrop-blur-md border border-[#8B5CF6]/60 text-[#F3F0EA] hover:bg-[#8B5CF6] transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button 
                onClick={() => setLightboxIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#8B5CF6]/80 backdrop-blur-md border border-[#8B5CF6]/60 text-[#F3F0EA] hover:bg-[#8B5CF6] transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md border border-[#8B5CF6]/30 rounded-full text-sm text-[#F3F0EA]" dir="ltr">
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  );
}
