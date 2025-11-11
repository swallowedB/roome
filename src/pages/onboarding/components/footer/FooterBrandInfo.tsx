import logo from '@/assets/header-logo.svg';

const FooterBrandInfo = () => {
  const scrollToTop = () => {
    const container = document.getElementById('onboarding-scroll');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='flex flex-col gap-4'>
      <button
        type='button'
        onClick={scrollToTop}>
        <img
          src={logo}
          alt='RoomE'
          className='opacity-80 hover:opacity-100 duration-300 w-60 max-sm:w-40'
        />
      </button>
      <p className='text-sm flex items-center gap-4'>
        <a
          href='https://occipital-latency-3e8.notion.site/RoomE-1dd413a1ee8180e8869be91aaea0b81c?pvs=4'
          className='opacity-60 hover:opacity-100 duration-300 link-hover'
          target='_blank'
          rel='noreferrer'>
          개인정보처리방침
        </a>
        <a
          href='https://occipital-latency-3e8.notion.site/RoomE-1dd413a1ee81807aaa21cfc6ebb5a6c2?pvs=4'
          className='opacity-60 hover:opacity-100 duration-300 link-hover'
          target='_blank'
          rel='noreferrer'>
          이용약관
        </a>
      </p>
      <span className='text-sm opacity-60'>
        © 2025 RoomE. All rights reserved.
      </span>
    </div>
  );
};

export default FooterBrandInfo;
