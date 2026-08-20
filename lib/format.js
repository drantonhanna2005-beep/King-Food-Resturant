// Renders a bullet list for the AI chat context, or `emptyText` when there is
// nothing to show.
function bulletList(items, emptyText, format) {
  const lines = (items || []).filter(Boolean).map(format).filter(Boolean);
  return lines.length ? lines.join('\n') : emptyText;
}

module.exports = { bulletList };
