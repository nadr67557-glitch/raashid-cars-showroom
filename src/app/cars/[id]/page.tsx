import { cars } from '@/data/cars';
import { notFound } from 'next/navigation';
import CarDetailView from '@/components/CarDetailView';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = cars.find(c => c.id === params.id);
  if (!car) return { title: 'سيارة غير موجودة' };
  
  return {
    title: `${car.nameAr} ${car.year} | معرض راشد كارز`,
    description: `${car.nameAr} ${car.year} - ${car.price.toLocaleString()} ريال. ${car.description || ''}`,
    openGraph: {
      title: `${car.nameAr} ${car.year}`,
      description: `${car.price.toLocaleString()} ريال`,
      images: [car.heroImage],
    },
  };
}

export default function CarPage({ params }: { params: { id: string } }) {
  const car = cars.find(c => c.id === params.id);
  
  if (!car) {
    notFound();
  }

  return <CarDetailView car={car} onBack={() => window.history.back()} />;
}
