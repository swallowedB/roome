import cd from '@assets/cd/cd.png';
import Loading from '@components/Loading';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SearchModal } from '../../components/search-modal/SearchModal';
import TypingText from '../../components/TypingText';
import { useCdStore } from '../../store/useCdStore';
import { useUserStore } from '../../store/useUserStore';
import CdDeleteModal from './components/CdDeleteModal';
import CdDockMenu from './components/CdDockMenu';
import CdHoverLabel from './components/CdHoverLabel';
import CdRack from './components/CdRack';
import useCdRackData from './hooks/useCdRackData';

export default function CdRackPage() {
  const { userId: myUserId } = useUserStore().user;
  const { userId } = useParams();
  const targetUserId = Number(userId);
  const { items, initialLoading, isFetchingMore, hasMore, loadMore, deleteCd } =
    useCdRackData(targetUserId, 14);
  const [activeSettings, setActiveSettings] = useState<'add' | 'delete' | null>(
    null,
  );
  const [resetDockMenuState, setResetDockMenuState] = useState(false);
  const phase = useCdStore((set) => set.phase);
  const isModalOpen = activeSettings === 'add' || activeSettings === 'delete';

  useEffect(() => {
    if (phase > items.length - 3 && hasMore && !isFetchingMore) {
      loadMore();
    }
  }, [phase, items, hasMore, isFetchingMore, loadMore]);

  if (initialLoading) {
    return <Loading />;
  }

  const handleSettingsChange = (setting: 'add' | 'delete') => {
    setActiveSettings(activeSettings === setting ? null : setting);
  };

  const handleCloseSettings = () => {
    setActiveSettings(null);
    setResetDockMenuState(true);
    setTimeout(() => setResetDockMenuState(false), 0);
  };

  const isEmpty = !items || items.length === 0;

  return (
    <div className='w-full h-screen'>
      <div className=' w-full h-screen bg-[#2e3e68cc] backdrop-blur-[35px] '>
        {isEmpty ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <div className='mb-6 h-[40px] lg:h-[60px] flex items-center'>
              <TypingText
                text='꽂을 CD가 없네요...'
                className='text-base lg:text-[30px] font-bold text-white/70'
              />
            </div>
            <img
              className='w-48 lg:w-[472px] aspect-square drop-shadow-book hover:animate-slowSpin'
              src={cd}
              alt='빈 CD 이미지'
            />
          </div>
        ) : (
          <>
            <CdRack
              items={items}
              isModalOpen={isModalOpen}
            />
            <CdHoverLabel />
          </>
        )}
        {/* 독메뉴 */}
        {myUserId === targetUserId && (
          <CdDockMenu
            activeSettings={activeSettings}
            onSettingsChange={handleSettingsChange}
            resetState={resetDockMenuState}
          />
        )}

        {/* 서치모달 / 삭제 모달 */}
        {activeSettings === 'add' && (
          <SearchModal
            title='CD 랙에 담을 음악 찾기'
            onClose={handleCloseSettings}
            type='CD'
            onSelect={() => {}}
          />
        )}
        {activeSettings === 'delete' && (
          <CdDeleteModal
            items={items}
            onClose={handleCloseSettings}
            onDelete={(ids) => deleteCd(ids)}
          />
        )}
      </div>
    </div>
  );
}
