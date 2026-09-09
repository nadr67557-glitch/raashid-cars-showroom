import { cars } from '@/data/cars';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BrandCarsClient from '@/components/BrandCarsClient';

const formatBrandName = (brand: string) => {
  const map: Record<string, string> = { 
    nissan: 'Nissan', 
    toyota: 'Toyota', 
    lexus: 'Lexus', 
    cadillac: 'Cadillac' 
  };
  return map[brand.toLowerCase()] || brand;
};

export async function generateMetadata({ params }: { params: { brand: string } }) {
  const brandName = formatBrandName(params.brand);
  return {
    title: `سيارات ${brandName} | معرض راشد كارز للسيارات – الرياض`,
    description: `اكتشف تشكيلة سيارات ${brandName} الجديدة والمتوفرة لدى معرض راشد كارز في الرياض بأسعار تنافسية وخدمات تمويلية مميزة.`,
  };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brandName = formatBrandName(params.brand);
  const brandCars = cars.filter(car => car.brand.toLowerCase() === params.brand.toLowerCase());

  if (brandCars.length === 0) {
    notFound();
  }

  const uniqueModels = Array.from(new Set(brandCars.map(car => car.model || car.category || 'الكل'))).filter(Boolean);

  return (
    <BrandCarsClient 
      brandName={brandName} 
      cars={brandCars} 
      models={uniqueModels} 
    />
  );
}
