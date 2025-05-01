import { Recipient } from '@/contexts/template/template.types';

export const generateClientPreview = (
    recipients: Recipient[],
    recipientId: number
): any | null => {
    const recipient = recipients.find(r => r.id === recipientId);
    if (!recipient) {
        throw new Error('Recipient not found');
    }
    return recipient.data;
};
