import { createCardLink } from '../components/CardLink.js';

/**
 * Replaces all matching card names inside text nodes with hoverable links.
 */
export function linkCardNames(domRoot, cards) {
  if (!domRoot || !cards || cards.length === 0) {
    console.warn("[linkCardNames] Missing target or cards");
    return;
  }

  const walker = document.createTreeWalker(domRoot, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];

  const nameMap = new Map();
  cards.forEach(card => {
    const names = [card.name, card.Name].filter(Boolean);
    names.forEach(n => nameMap.set(n.toLowerCase(), card));
  });
  const allNamesPattern = Array.from(nameMap.keys())
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join("|");

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('.cardlink, a')) continue;
    if (node.textContent.length < 3) continue;
    textNodes.push(node);
  }

  for (const node of textNodes) {
    let text = node.textContent;
    const parent = node.parentElement;
    const fragment = document.createDocumentFragment();
    const regex = new RegExp(`\\b(${allNamesPattern})\\b`, "gi");
    const parts = text.split(regex);
    parts.forEach(part => {
      const matchedCard = nameMap.get(part.toLowerCase());
      if (matchedCard) {
        fragment.appendChild(createCardLink(matchedCard));
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    parent.replaceChild(fragment, node);
  }
}
