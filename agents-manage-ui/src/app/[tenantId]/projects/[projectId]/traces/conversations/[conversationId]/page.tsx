'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ConversationDetail } from '@/components/traces/conversation-detail';

export default function ConversationPage({
  params,
}: PageProps<'/[tenantId]/projects/[projectId]/traces/conversations/[conversationId]'>) {
  const router = useRouter();
  const { conversationId, tenantId, projectId } = use(params);

  const handleBackToTraces = () => {
    router.push(`/${tenantId}/projects/${projectId}/traces`);
  };

  return <ConversationDetail conversationId={conversationId} onBack={handleBackToTraces} />;
}
