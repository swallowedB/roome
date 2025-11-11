import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface FeatureCardsProps {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  withAnimation?: boolean;
}

const FeatureCards = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  withAnimation = false,
}: FeatureCardsProps) => {
  const baseClassName = twMerge(
    'flex flex-col items-center gap-6 px-8 py-14 bg-gradient-to-r text-white from-white/20 to-white/5 backdrop-blur-xl border border-white rounded-4xl',
    className,
  );

  if (withAnimation) {
    return (
      <motion.div
        className={baseClassName}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          duration: 0.6,
        }}>
        <h3
          className={twMerge(
            'text-xl sm:text-2xl md:text-3xl font-medium relative',
            titleClassName,
          )}>
          {title}
        </h3>
        <p
          className={twMerge(
            'text-base sm:text-lg text-center',
            descriptionClassName,
          )}>
          {description}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={baseClassName}>
      <h3
        className={twMerge(
          'text-xl sm:text-2xl md:text-3xl font-medium relative text-[#0d1f61]',
          titleClassName,
        )}>
        {title}
      </h3>
      <p
        className={twMerge(
          'text-base sm:text-lg text-center text-[#0d1f61]',
          descriptionClassName,
        )}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCards;
