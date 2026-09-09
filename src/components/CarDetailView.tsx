'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Car } from '../types';

interface CarDetailViewProps {
  car: Car;
  onBack: () => void;
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
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
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

  const renderSpecs = () => {
    const specsList: { label: string; value: string }[] = [];
    
    if (car.specs && car.specs.length > 0) {
      car.specs.forEach(spec => specsList.push({ label: spec.label, value: spec.value }));
    }
    
    if (car.features && typeof car.features === 'object') {
      Object.entries(car.features).forEach(([key, value]) => {
        if (value) {
          const labelMap: Record<string, string> = {
            engineSize: 'سعة المحرك', turbo: 'نوع الشحن', transmissionSpeeds: 'ناقل الحركة',
            dualMode: 'نظام الدفع', differential: 'نظام الدفرنس', sunroof: 'فتحة السقف',
            wheels: 'الجنوط', ledLights: 'الإضاءة', leatherSeats: 'المقاعد',
            powerSeats: 'تعديل المقاعد', fridge: 'الثلاجة', radar: 'الرادار',
            audioSystem: 'النظام الصوتي', warranty: 'الضمان', agent: 'الوكيل'
          };
          specsList.push({ 
            label: labelMap[key] || key, 
            value: typeof value === 'string' ? value : String(value) 
          });
        }
      });
    }

    if (car.color) specsList.unshift({ label: 'اللون الخارجي', value: car.color });
    if (car.interiorColor) specsList.unshift({ label: 'اللون الداخلي', value: car.interiorColor });
    if (car.fuelType) specsList.unshift({ label: 'الوقود', value: car.fuelType });

    return specsList;
  };

  const specsData = renderSpecs();

  return (
    <div className="min-h-screen bg-[#111315] text-[#F3F0EA] pb-20">
      <header className="sticky top-0 z-40 bg-[#111315]/95 backdrop-blur-md border-b border-[#3A3E40]/60">
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
            <div className="w-8 h-8 bg-[#1B1E20] border border-[#3A3E40] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#F3F0EA]">RC</span>
            </div>
          </div>
        </div>
      </header>

      <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-[#111315]">
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            <img
              src={tabImages[currentImageIndex] || car.heroImage}
              alt={car.nameAr}
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0.95) contrast(1.05)' }}
            />
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: '80%', height: '30px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
                filter: 'blur(15px)'
              }}
            />
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(17,19,21,1) 0%, rgba(17,19,21,0.6) 50%, transparent 100%)' }}
        />

        {tabImages.length > 1 && (
          <>
            <button onClick={goToPrevImage} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#1B1E20]/60 backdrop-blur-md border border-[#3A3E40] rounded-full text-[#F3F0EA] hover:bg-[#1B1E20] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={goToNextImage} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#1B1E20]/60 backdrop-blur-md border border-[#3A3E40] rounded-full text-[#F3F0EA] hover:bg-[#1B1E20] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </>
        )}

        <div className="absolute bottom-24 right-4 md:right-12 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#111315]/80 backdrop-blur-md border border-[#3A3E40]/60 rounded-full" dir="ltr">
          <span className="text-sm font-bold text-[#F3F0EA]">{String(currentImageIndex + 1).padStart(2, '0')}</span>
          <span className="text-xs text-[#B8B0A6]">/</span>
          <span className="text-xs text-[#B8B0A6]">{String(tabImages.length).padStart(2, '0')}</span>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="mb-8">
          <p className="text-sm font-medium tracking-widest text-[#B8B0A6] uppercase mb-2">{car.brand} • {car.year}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F3F0EA] mb-4">{car.nameAr}</h1>
          {car.category && <p className="text-lg text-[#C8CDD0] mb-4">{car.category}</p>}
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl md:text-5xl font-bold text-[#F3F0EA]">{formatPrice(car.price)}</span>
            <span className="text-xl text-[#B8B0A6]">ريال</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>واتساب</span>
            </button>
            <button onClick={handleCall} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1B1E20] border border-[#3A3E40] text-[#F3F0EA] font-semibold rounded-lg hover:bg-[#2C3032] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>اتصال</span>
            </button>
            <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1B1E20] border border-[#3A3E40] text-[#F3F0EA] font-semibold rounded-lg hover:bg-[#2C3032] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              <span>مشاركة</span>
            </button>
            <button onClick={handleHaraj} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1B1E20] border border-[#3A3E40] text-[#F3F0EA] font-semibold rounded-lg hover:bg-[#2C3032] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              <span>حراج</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[#3A3E40]/60">
          {(['exterior', 'interior', 'details'] as const).map((tab) => {
            const count = car.gallery[tab]?.length || 0;
            if (count === 0) return null;
            const labels = { exterior: 'الخارجية', interior: 'الداخلية', details: 'التفاصيل' };
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentImageIndex(0); }}
                className={`px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#1B1E20] text-[#F3F0EA] border-b-2 border-[#C8CDD0]' : 'text-[#B8B0A6] hover:text-[#F3F0EA]'
                }`}
              >
                {labels[tab]} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tabImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => { setCurrentImageIndex(idx); openLightbox(allImages.indexOf(img)); }}
              className={`relative aspect-[4/3] bg-[#1B1E20] rounded-lg overflow-hidden cursor-pointer group border ${
                idx === currentImageIndex ? 'border-[#C8CDD0]' : 'border-[#3A3E40]/60'
              }`}
            >
              <img src={img} alt={`${car.nameAr} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#F3F0EA] mb-6">المواصفات والتجهيزات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specsData.map((spec, idx) => (
              <div key={idx} className="bg-[#1B1E20] border border-[#3A3E40]/60 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm text-[#B8B0A6]">{spec.label}</span>
                <span className="text-base font-semibold text-[#F3F0EA] text-left">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {(car.financing || car.freeServices) && (
          <div className="mb-12 space-y-6">
            {car.freeServices && car.freeServices.length > 0 && (
              <div className="bg-[#1B1E20] border border-[#3A3E40]/60 rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#F3F0EA] mb-4">خدمات مجانية بعد الشراء</h3>
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
              <div className="bg-[#1B1E20] border border-[#3A3E40]/60 rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#F3F0EA] mb-4">خيارات التمويل</h3>
                <p className="text-[#B8B0A6] mb-4">متوفر إيجار منتهي بالتمليك عبر الجهات التالية:</p>
                <div className="flex flex-wrap gap-2">
                  {car.financing.banks?.map((bank, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#111315] border border-[#3A3E40] rounded-full text-sm text-[#C8CDD0]">{bank}</span>
                  ))}
                </div>
                <p className="text-xs text-[#B8B0A6] mt-4">* للتفاصيل الدقيقة حول القسط والدفعة الأولى، يرجى التواصل مع المعرض.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[#3A3E40]/60 py-8 px-6 text-center mt-12">
        <p className="text-xs text-[#B8B0A6] mb-2">تصميم وتنفيذ</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-[#1B1E20] border border-[#3A3E40] rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#F3F0EA]">KJ</span>
          </div>
          <span className="text-xs font-medium text-[#F3F0EA]">خالد الجراش</span>
        </div>
      </footer>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D0F10]/98 flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={closeLightbox} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex gap-2">
              <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center bg-[#1B1E20]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]">
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
            <img
              src={allImages[lightboxIndex]}
              alt={car.nameAr}
              className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
              draggable={false}
            />
          </div>

          {allImages.length > 1 && (
            <>
              <button 
                onClick={() => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[#1B1E20]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button 
                onClick={() => setLightboxIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[#1B1E20]/80 rounded-full text-[#F3F0EA] hover:bg-[#1B1E20]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1B1E20]/80 backdrop-blur-md rounded-full text-sm text-[#F3F0EA]" dir="ltr">
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  );
}
