import { ReactNode } from "react";
import styles from "./carousel-skeleton.module.scss";

interface CarouselWrapperProps {
  children: ReactNode;
  index: number;
  totalItems: number;
}

/**
 * Responsive carousel item wrapper for skeleton loading states
 * Matches the responsive widths from mobile-carousel.module.scss
 */
export function CarouselSkeletonItem({ children, index, totalItems }: CarouselWrapperProps) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  return (
    <div className={`${styles.carouselItem} ${isFirst ? "ml-4 sm:ml-6" : ""} ${isLast ? "mr-4 sm:mr-6" : ""}`}>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
}
