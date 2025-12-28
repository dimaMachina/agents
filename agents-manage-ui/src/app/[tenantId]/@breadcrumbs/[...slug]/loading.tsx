import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading: FC = () => {
  return <Skeleton className="h-5 w-14" />;
};

export default Loading;
