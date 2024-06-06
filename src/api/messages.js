import { apiUrl } from "../api";

export async function upsertMessage(message) {
  const requestBody = {
    ...message,
    name: message.name?.trim(),
    message: message.message?.trim(),
    after_jump: message.after_jump ?? null,
    gm_notes: message.gm_notes?.trim() ?? null,
    // Should only contain IDs, not the full object
    receivers: message.receivers?.map((receiver) => {
      if (typeof receiver === 'string') {
        return receiver;
      }
      if (typeof receiver === 'object' && receiver.id !== undefined) {
        return receiver.id;
      }
      throw new Error(`Invalid receiver: ${receiver}`);
    }) ?? [],
  };

  const response = await fetch(apiUrl("/story/messages"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  return response;
}

export async function sendMessage(message) {

  const messageSender = () => {
    if (message.sender_person_id) {
      return message.sender_person_id.toString();
    }
    throw new Error(`Invalid sender: ${message.sender_person_id}`);
  }

  const messageReceivers = message.receivers?.map((receiver) => {
    if (typeof receiver === 'string') {
      return receiver;
    }
    if (typeof receiver === 'object' && receiver.id !== undefined) {
      return receiver.id;
    }
    throw new Error(`Invalid receiver: ${receiver}`);
  });

  if (!messageReceivers || messageReceivers.length === 0) {
    throw new Error('No valid receivers found');
  }

  const sendSingleMessage = async (target) => {
    const requestBody = {
      sender: messageSender(),
      target: target,
      message: message.message?.trim(),
    };

    const response = await fetch(apiUrl("/messaging/send/"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message to receiver ${target}`);
    }

    return response; // Assuming the API returns JSON
  };

  const sendAllMessages = async () => {
    try {
      const responses = await Promise.all(messageReceivers.map(target => sendSingleMessage(target)));
      return responses;
    } catch (error) {
      console.error('Error sending messages:', error);
      throw error;
    }
  };

  return sendAllMessages();
}