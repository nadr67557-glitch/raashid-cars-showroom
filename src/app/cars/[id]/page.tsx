'use client';

import { useEffect } from 'react';
import { cars } from '@/data/cars';
import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';

export default function CarPage({ params }: { params: { id: string } }) {
  const car = cars.find(c => c.id === params.id);

  useEffect(() => {
    if (car) {
      document.title = `${car.nameAr} ${car.year} | معرض راشد كارز`;
    }
  }, [car]);

  if (!car) {
    notFound();
  }

  return <CarDetailView car={car} onBack={() => window.history.back()} />;
}
