import { FC } from 'react';

// import InfoWidgets from '../components/home/InfoWidgets';
// import PromotionBanner from '../components/home/PromotionBanner';
// import JoinUsBanner from '../components/home/JoinUsBanner';
import Hero from '@/components/home/Hero';
import TimelineSection from '@/components/home/TimelineSection';
import GovernmentSection from '@/components/home/GovernmentSection';
import NewsSection from '@/components/home/NewsSection';
import OpenLGUSection from '@/components/home/OpenLGUSection';
import AboutPortalSection from '@/components/home/AboutPortalSection';
import PublicDataSection from '@/components/home/PublicDataSection';
// import NewsSection from '@/components/home/NewsSection';
// import JoinUsStrip from '../components/home/JoinUsStrip';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const Home: FC = () => {
  return (
    <main className='grow'>
      {/* Documented animation pattern: animate-in fade-in */}
      <div className='animate-in fade-in duration-700'>
        <ErrorBoundary name='Hero'>
          <Hero />
        </ErrorBoundary>

        <div>
          <ErrorBoundary name='CityNews'>
            <NewsSection />
          </ErrorBoundary>

          <ErrorBoundary name='GovernmentDirectory'>
            <GovernmentSection />
          </ErrorBoundary>

          <ErrorBoundary name='PublicData'>
            <PublicDataSection />
          </ErrorBoundary>

          <ErrorBoundary name='OpenLGU'>
            <OpenLGUSection />
          </ErrorBoundary>

          <ErrorBoundary name='CityHistory'>
            <TimelineSection />
          </ErrorBoundary>

          <ErrorBoundary name='AboutPortal'>
            <AboutPortalSection />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
};

export default Home;
