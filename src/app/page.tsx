'use client';

import { useState } from 'react';
import ShowroomHero from '../components/ShowroomHero';
import CarDetailView from '../components/CarDetailView';
import QuickInventory from '../components/QuickInventory';
import { Car } from '../types';
import Link from 'next/link';

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
      <QuickInventory
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        onSelectCar={handleCarSelect}
      />
    </>
  );
}
