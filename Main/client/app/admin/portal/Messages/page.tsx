import { getAllContactMessages } from '@/actions/contact';
import MessagesClient from './MessagesClient';

export default async function MessagesPage() {
  const rawMessages = await getAllContactMessages();

  const messages = rawMessages.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
    replied: m.replied,
    repliedBy: m.repliedBy,
  }));

  return (
    <MessagesClient messages={messages} />
  );
}
