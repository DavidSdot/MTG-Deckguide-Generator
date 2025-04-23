// Handles card data fetching and conversion to ScryfallCard objects

import { fetchCardData } from './services/cardService.js';
import { ScryfallCard } from './models/ScryfallCard.js';

const cardCache = new Map();
const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const storagePrefix = "scryfallCard_";

/**
 * Retrieves a Scryfall card by name and language, with caching (max age: 24h).
 * @param {string} name - Exact card name
 * @param {string} lang - Language code (e.g. "en", "de")
 * @param {boolean} sideboard - Whether to fetch sideboard data
 * @returns {Promise<ScryfallCard|null>}
 */
export async function getCard(name, lang = "en", set, setnum) {
  const cacheKey = `${name.toLowerCase()}_${lang}_${set}_${setnum}`;
  const storageKey = `${storagePrefix}${cacheKey}`;

  const cached = cardCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cacheTTL) {
    return cached.card;
  }

  const stored = loadFromLocalStorage(storageKey);
  if (stored) {
    const card = ScryfallCard.fromJson(stored);
    cardCache.set(cacheKey, { card, timestamp: Date.now() });
    return card;
  }

  const json = await fetchCardData(name, lang, set, setnum);
  if (!json) return null;


  const card = ScryfallCard.fromJson(json);
  card.set = set;
  card.setnum = setnum;
  cardCache.set(cacheKey, { card, timestamp: Date.now() });
  saveToLocalStorage(storageKey, json);

  return card;
}

function loadFromLocalStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < cacheTTL) {
      return parsed.card;
    }
  } catch {
    localStorage.removeItem(key); // corrupted
  }
  return null;
}

function saveToLocalStorage(key, card) {
  localStorage.setItem(key, JSON.stringify({
    timestamp: Date.now(),
    card
  }));
}
