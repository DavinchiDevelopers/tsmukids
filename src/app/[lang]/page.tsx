import { Lang } from '@/types';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import DepartmentsSection from '@/components/home/DepartmentsSection';
import DoctorsSection from '@/components/home/DoctorsSection';
import ServicesSection from '@/components/home/ServicesSection';
import EquipmentSection from '@/components/home/EquipmentSection';
import AdvantagesSection from '@/components/home/AdvantagesSection';
import GallerySection from '@/components/home/GallerySection';
import PricesSection from '@/components/home/PricesSection';
import CTASection from '@/components/home/CTASection';
import ContactsSection from '@/components/home/ContactsSection';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  return (
    <>
      <HeroSection lang={lang as Lang} />
      <AboutSection lang={lang as Lang} />
      <DepartmentsSection lang={lang as Lang} />
      <DoctorsSection lang={lang as Lang} />
      <ServicesSection lang={lang as Lang} />
      <EquipmentSection lang={lang as Lang} />
      <AdvantagesSection lang={lang as Lang} />
      <GallerySection lang={lang as Lang} />
      <PricesSection lang={lang as Lang} />
      <CTASection lang={lang as Lang} />
      <ContactsSection lang={lang as Lang} />
    </>
  );
}
