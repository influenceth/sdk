export function followError (cells, history, origin, source, lot, depth, tooFar) {
  if (cells.some((c) => c[0] && c[1] === lot && c[2] === depth)) return 'duplicate section';
  if (!cells.some((c) => c[0])) return lot === origin ? null : 'first sample off origin';
  if (!source?.[0] || Math.abs(source[2] - depth) > 1 || tooFar) return 'invalid approach';
  const collapsed = history.some((h) => h.event === 2 && (
    (h.sourceLot === source[1] && h.sourceDepth === source[2] && h.lot === lot && h.depth === depth) ||
    (h.sourceLot === lot && h.sourceDepth === depth && h.lot === source[1] && h.depth === source[2])
  ));
  return collapsed ? 'collapsed route' : null;
}
