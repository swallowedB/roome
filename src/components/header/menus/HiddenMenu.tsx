import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAPI } from '@apis/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../../store/useUserStore';
import { useClickOutside } from '../../../hooks/useClickOutside';
import PowerIcon from '@assets/power-icon.svg?react';

interface HiddenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isMobile?: boolean;
  housemateButtonRef?: React.RefObject<HTMLButtonElement>;
  toggleHousemateModal?: () => void;
  housemateIcon?: string;
}

const HiddenMenu = ({
  isOpen,
  onClose,
  buttonRef,
  isMobile,
  housemateButtonRef,
  toggleHousemateModal,
  housemateIcon,
}: HiddenMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useUserStore();

  useClickOutside({
    modalRef: menuRef,
    buttonRef,
    isOpen,
    onClose,
  });

  const handleLogout = async () => {
    await logoutAPI();
    onClose();
    navigate('/login');
  };

  // no-op

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          aria-label='숨김 메뉴'
          className='absolute w-[184px] right-[170%] max-sm:right-[120%] top-0 p-2 border-2 border-white bg-white/30 backdrop-blur-lg rounded-2xl font-semibold'
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 20 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}>
          <ul className='overflow-hidden px-5 py-4 text-lg bg-white rounded-xl shadow-lg max-sm:px-4 max-sm:py-2 max-sm:rounded-xl max-sm:font-sm'>
            <li>
              <Link
                to={`/room/${user?.userId}`}
                onClick={onClose}
                className='inline-block w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                나의 룸
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  onClose();
                  if (user) {
                    navigate(`/profile/${user.userId}`);
                  }
                }}
                className='w-full px-4 py-3 text-center border-b border-gray-100  text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors'>
                내 프로필
              </button>
            </li>
            {isMobile &&
              housemateButtonRef &&
              toggleHousemateModal &&
              housemateIcon && (
                <li>
                  <button
                    ref={housemateButtonRef}
                    type='button'
                    aria-label='하우스메이트'
                    onClick={() => {
                      onClose();
                      toggleHousemateModal();
                    }}
                    className='w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors flex items-center justify-center gap-2'>
                    하우스메이트
                  </button>
                </li>
              )}
            <li>
              <Link
                to='https://forms.gle/4cv4HNTDb9JYjjjUA'
                className='w-full px-4 py-3 text-center border-b border-gray-100 text-[#2E4D99]/50 hover:text-[#2E4D99] transition-colors flex items-center justify-center gap-2'>
                피드백
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                type='button'
                className='w-full py-3 flex items-center justify-center gap-1 text-[#2E4D99]/50 hover:text-[#2E4D99] group transition-colors select-none'>
                <PowerIcon className='w-5 h-5' />
                로그아웃
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default HiddenMenu;
