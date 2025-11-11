import Loading from '@components/Loading';
import { useFetchCdInfo } from '@hooks/cd/useFetchCdInfo';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ModalBackground from '../../components/ModalBackground';
import DataList from '../../components/datalist/DataList';
import { useFetchSearchCdLists } from '../../hooks/cd/useFetchSearchCdLists';
import CdControlBar from './components/CdControlBar';
import CdInfo from './components/CdInfo';
import CdComment from './components/comments/CdComment';
import CdPlayer from './components/player/CdPlayer';
import CdTemplate from './components/template/CdTemplate';
import backgroundIMG from '/images/roome-background-img.webp';

const MemoCdComment = React.memo(CdComment);

export default function CdPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [openModals, setOpenModals] = useState<string[]>([]);
  const {
    cdInfo,
    isCdPlaying,
    isLoading: cdLoading,
    error: cdError,
    userId,
    setIsCdPlaying,
  } = useFetchCdInfo();
  const {
    cdRackInfo,
    isLoading: rackLoading,
    lastMyCdId,
    setCursor,
    setSearchInput,
  } = useFetchSearchCdLists(userId);

  // 뒤로가기시 cd 렉페이지로 이동
  useEffect(() => {
    if (!userId) return;
    const handleBackButton = () => {
      navigate(`/cdrack/${userId}`, { replace: true });
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, userId]);

  const onSetCdPlaying = useMemo(() => setIsCdPlaying, [setIsCdPlaying]);

  const handleFetchMoreDatas = useCallback(() => {
    setCursor(cdRackInfo.nextCursor);
  }, [cdRackInfo, setCursor]);

  if (cdLoading || rackLoading) return <Loading />;

  // 에러 발생 시 풀백 화면
  if (cdError) {
    return (
      <div className='w-full h-screen main-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4'>
            <ExclamationTriangleIcon className='w-24 h-24 mx-auto text-[#3E507D]/50' />
          </div>
          <h2 className='text-xl font-bold text-[#3E507D] mb-2'>
            CD를 불러올 수 없어요
          </h2>
          <p className='text-sm text-[#3E507D]/70 mb-6'>
            {cdError || 'CD 정보를 찾을 수 없습니다.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 bg-[#4983EF] text-white rounded-lg hover:bg-[#3A6BC7] transition-colors'>
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  const hasData = Boolean(cdInfo);

  // cdInfo가 없는 경우 처리
  if (!cdInfo && !cdLoading) {
    return (
      <div className='w-full h-screen main-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4'>
            <ExclamationTriangleIcon className='w-24 h-24 mx-auto text-[#3E507D]/50' />
          </div>
          <h2 className='text-xl font-bold text-[#3E507D] mb-2'>
            CD를 찾을 수 없어요
          </h2>
          <p className='text-sm text-[#3E507D]/70 mb-6'>
            해당 CD가 존재하지 않거나 삭제되었습니다.
          </p>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 bg-[#4983EF] text-white rounded-lg hover:bg-[#3A6BC7] transition-colors'>
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  const handleTabClick = (key: string) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setOpenModals([key]);
    } else {
      setOpenModals((prev) =>
        prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key],
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModals([]);
  };

  return (
    <div
      className={`relative w-full h-screen bg-center bg-no-repeat bg-cover overflow-x-hidden 
      `}
      style={{ backgroundImage: `url(${backgroundIMG})` }}>
      <section
        className='flex flex-col items-center justify-center gap-10 md:gap-1
                        min-h-[100vh] px-4 py-10 '>
        {/* Control Bar  */}
        <div className='w-full sm:w-[80%] lg:w-[70%] max-w-md h-10'>
          <CdControlBar
            onTabClick={handleTabClick}
            openModals={openModals}
          />
        </div>

        {/* CD Info  */}
        <div className='flex items-center justify-center w-full'>
          {hasData ? (
            <CdInfo
              cdInfo={cdInfo!}
              cdPlaying={isCdPlaying}
            />
          ) : (
            <div className='rounded-xl bg-black/30 p-6 text-center text-white'>
              CD 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </div>
          )}
        </div>

        {/* 재생바 */}

        <div className='w-full sm:w-[70%] md:w-[40%] '>
          <CdPlayer
            cdInfo={cdInfo}
            setCdPlaying={onSetCdPlaying}
            setCurrentTime={setCurrentTime}
          />
        </div>
      </section>

      {/* 모달 */}
      <div className=' w-full'>
        {openModals.includes('review') && (
          <div
            className='w-[95%] sm:w-[70%] lg:w-[400px] h-[75%] md:h-[80%] 
            pointer-events-auto'>
            <CdTemplate
              onClose={() =>
                setOpenModals((prev) => prev.filter((m) => m !== 'review'))
              }
            />
          </div>
        )}
        {openModals.includes('timeline') && (
          <div
            className='absolute right-4 top-1/2 -translate-y-1/2 
            w-[95%] sm:w-[70%] lg:w-[400px] h-[75%] md:h-[80%] 
            pointer-events-auto'>
            <MemoCdComment
              currentTime={currentTime}
              onClose={() =>
                setOpenModals((prev) => prev.filter((m) => m !== 'timeline'))
              }
            />
          </div>
        )}
        {openModals.includes('playlist') && (
          <ModalBackground onClose={handleCloseModal}>
            <DataList
              setSearchInput={setSearchInput}
              totalCount={cdRackInfo.totalCount}
              datas={cdRackInfo.data}
              type='cd'
              hasMore={cdRackInfo.nextCursor <= lastMyCdId.current}
              isLoading={rackLoading}
              fetchMore={handleFetchMoreDatas}
              userId={userId}
              onClose={handleCloseModal}
            />
          </ModalBackground>
        )}
      </div>
    </div>
  );
}
