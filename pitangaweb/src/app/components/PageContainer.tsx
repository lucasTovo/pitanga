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
        'flex',
        'flex-col',
        'grow',
        lockScroll && 'h-screen overflow-hidden',
      )}
    >
      <div
        className={cn(
          'w-full mx-auto max-w-7xl flex flex-col grow p-3 sm:p-6 md:p-10 pb-8 sm:pb-10 md:pb-10',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
