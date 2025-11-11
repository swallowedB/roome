import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '@/apis/book';
import { addCdToMyRack, getYoutubeUrl, upgradeCdLevel } from '@/apis/cd';
import { mapToPostCDInfo, mapToRawCd } from '@/utils/cdMapper';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/store/useToastStore';
import { BookType } from '@/types/book';

interface UseSearchActionsProps {
  type: 'CD' | 'BOOK';
  userId?: string;
  onClose: () => void;
  onSelect: (item?: SearchItemType) => void;
  onSuccess?: (item: SearchItemType) => void;
}

export const useSearchActions = ({
  type,
  userId,
  onClose,
  onSelect,
  onSuccess,
}: UseSearchActionsProps) => {
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const { showToast } = useToastStore();

  const handleAdd = async (item: SearchItemType) => {
    try {
      if (type === 'BOOK') {
        const bookData: BookType = {
          isbn: item.id,
          title: item.title,
          author: item.author,
          publisher: item.publisher,
          publishedDate: new Date(item.date).toISOString().split('T')[0],
          imageUrl: item.imageUrl,
          genreNames: item.genres,
          page: 0,
        };
        const response = await bookAPI.addBookToMyBook(
          bookData,
          Number(userId),
        );
        onClose();
        showToast('책장에 책이 추가되었어요!', 'success');
        onSuccess?.({
          ...item,
          id: response.id.toString(),
          title: response.title,
          author: response.author,
          publisher: response.publisher,
          date: response.publishedDate,
          imageUrl: response.imageUrl,
          genres: response.genreNames,
        });
      } else {
        const { youtubeUrl, duration } = await getYoutubeUrl(
          item.title,
          item.artist,
        );

        const raw = { ...mapToRawCd(item), youtubeUrl, duration } as RawCDInfo;
        const payload = mapToPostCDInfo(raw);

        if (
          !payload.youtubeUrl ||
          !payload.duration ||
          !payload.title ||
          !payload.artist ||
          !payload.album ||
          !payload.releaseDate ||
          !payload.coverUrl
        ) {
          setIsAlertModalOpen(true);
          return;
        }

        const result = await addCdToMyRack(payload);
        const myCdId = (result && (result.myCdId ?? result.data?.myCdId)) as
          | number
          | undefined;

        onSelect({
          ...item,
          youtubeUrl: payload.youtubeUrl,
          duration: payload.duration,
          id: myCdId != null ? String(myCdId) : item.id,
        });
        showToast('랙에 cd가 추가되었어요!', 'success');
        onClose();
      }
    } catch (error) {
      if (
        error.response?.data?.message ===
          '책장에 더 이상 책을 추가할 수 없습니다. 책장을 업그레이드 해주세요.' ||
        error.response?.data?.message === 'CD 랙의 저장 용량을 초과하였습니다.'
      ) {
        setIsUpgradeModalOpen(true);
      } else {
        if (error.response?.status === 500) {
          showToast(
            'CD 추가 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            'error',
          );
          setTimeout(() => {
            navigate(-1);
          }, 600);
          return;
        }
        showToast(
          error.response?.data?.message || '오류가 발생했어요.',
          'error',
        );
      }
      onSelect(null);
      console.error(`${type} 추가 실패:`, error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const user = useUserStore.getState().user;
      if (!user) return;

      if (type === 'BOOK') {
        await bookAPI.upgradeBookLevel(String(user.roomId));
        showToast('책장이 업그레이드 되었어요!', 'success');
      } else {
        await upgradeCdLevel(user.roomId);
        showToast('CD랙이 업그레이드 되었어요!', 'success');
      }
      setIsUpgradeModalOpen(false);
    } catch (error) {
      console.error('업그레이드 실패:', error);
      showToast('업그레이드에 실패했어요.', 'error');
    }
  };

  return {
    handleAdd,
    handleUpgrade,
    isAlertModalOpen,
    setIsAlertModalOpen,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
  };
};
