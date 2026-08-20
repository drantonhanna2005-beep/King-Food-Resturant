// Helpers shared by the support-chat REST routes and the socket.io handlers.

// Normalises a message payload (REST body or socket payload) into the fields
// stored on a Conversation document.
function conversationPayload(source, senderRole, userId) {
  return {
    user: userId,
    senderRole,
    message: source.message || '',
    imageUrl: source.imageUrl || '',
    fileUrl: source.fileUrl || '',
    fileName: source.fileName || '',
    fileType: source.fileType || '',
    replyTo: source.replyTo || null
  };
}

// Adds the reaction for the given user, or removes it when it already exists.
// Returns the saved message.
async function toggleReaction(message, userId, emoji) {
  const existingIdx = message.reactions.findIndex(r => String(r.by) === String(userId) && r.type === emoji);
  if (existingIdx >= 0) message.reactions.splice(existingIdx, 1);
  else message.reactions.push({ type: emoji, by: userId });
  await message.save();
  return message;
}

module.exports = { conversationPayload, toggleReaction };
