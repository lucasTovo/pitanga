import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  lockScroll?: boolean;
  className?: string;
}

export const PageContainer = ({
  children,
  lockScroll = false,
  className = '',
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        'w-full',
        lockScroll && 'h-screen overflow-hidden',
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-7xl h-full p-3 sm:p-6 md:p-10',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
