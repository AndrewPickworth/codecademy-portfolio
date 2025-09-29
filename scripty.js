// Unwrap previous highlights
function unhighlight(root = document.body) {
  const marks = root.querySelectorAll('mark[data-search-highlight]');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    // move children out, then remove the mark
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize(); // merge adjacent text nodes
  });
}

// Escape user input for regex
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Highlight all occurrences (case-insensitive) within text nodes
function highlightAll(term, root = document.body) {
  if (!term) return 0;
  const re = new RegExp(escapeRegExp(term), 'gi');

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentNode;
        // skip scripts/styles/noscript and already-highlighted areas
        if (p && (p.closest('script,style,noscript') || p.closest('mark[data-search-highlight]'))) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let total = 0;
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(textNode => {
    const text = textNode.nodeValue;
    let last = 0;
    let match;
    re.lastIndex = 0;

    const frag = document.createDocumentFragment();

    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (start > last) {
        frag.appendChild(document.createTextNode(text.slice(last, start)));
      }
      const mark = document.createElement('mark');
      mark.setAttribute('data-search-highlight', '');
      mark.textContent = text.slice(start, end);
      frag.appendChild(mark);

      last = end;
      total++;
    }

    if (total > 0 && last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }

    if (frag.childNodes.length) {
      textNode.parentNode.replaceChild(frag, textNode);
    }
  });

  return total;
}

// Wire it up after DOM is parsed
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pageSearch');
  const input = document.getElementById('searchInput');
  if (!form || !input) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const term = input.value.trim();

    unhighlight();
    if (!term) return;

    const total = highlightAll(term);

    const first = document.querySelector('mark[data-search-highlight]');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Optional: console info or UI feedback
    // console.info(`Found ${total} match(es) for "${term}"`);
  });
});