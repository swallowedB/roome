import cdEmptyPlayer from '@assets/cd/cd-player.png';
import cd from '@assets/cd/cd.png';
import React, { useEffect } from 'react';

export const CdInfo = React.memo(
  ({ cdInfo, cdPlaying }: { cdInfo: CDInfo; cdPlaying: boolean }) => {
    if (!cdInfo) return null;

    const textLength = cdInfo.title?.length || 0;
    // // console.log('cdInfo'); props의 상태가 변할때만 리렌더링

    useEffect(() => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = cdEmptyPlayer;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }, []);
    return (
      <section
        className='flex flex-col w-full md:w-[70%] gap-8 mb-10
  items-center justify-center '>
        <article className='mt-8 text-white flex flex-col gap-1.5 text-center '>
          <span className='text-base sm:text-lg lg:text-xl 2xl:text-2xl font-semibold opacity-70'>
            {cdInfo?.artist}
          </span>
          <h1
            className={`${
              textLength > 14
                ? 'text-lg sm:text-xl lg:text-2xl 2xl:text-[30px]'
                : 'text-xl sm:text-2xl lg:text-3xl 2xl:text-[40px]'
            } font-bold`}>
            {cdInfo?.title}
          </h1>
        </article>

        <article
          className='
            relative 
            w-[90%] sm:w-3/5 md:w-1/3
            aspect-square 
            mx-auto
        '>
          <div className='w-full h-full'>
            <img
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[6] w-[70%] ${
                cdPlaying && 'animate-spin'
              }`}
              src={cdInfo.coverUrl || '/images/default-cd-cover.png'}
              alt='앨범 커버'
              style={{
                WebkitMaskImage: `url(${cd})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'cover',
                maskImage: `url(${cd})`,
                maskRepeat: 'no-repeat',
                maskSize: 'cover',
                animationDuration: '6s',
              }}
            />

            {/* CD 질감 */}
            <img
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[7] w-[70%] pointer-events-none ${
                cdPlaying && 'animate-spin'
              }`}
              src={cd}
              alt='CD 텍스처'
              style={{
                animationDuration: '6s',
                mixBlendMode: 'overlay',
                opacity: 0.9,
              }}
            />
            <img
              className='w-full h-full object-contain'
              src={cdEmptyPlayer}
              alt='빈 cd플레이어 이미지'
              loading='eager'
            />
          </div>
        </article>
      </section>
    );
  },
);

export default CdInfo;
