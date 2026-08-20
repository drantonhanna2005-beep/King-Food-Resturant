// Filter matching the notifications visible to a user: broadcasts plus the ones
// addressed to them.
function visibleToUser(userId) {
  return { $or: [{ user: null }, { user: userId }] };
}

module.exports = { visibleToUser };
