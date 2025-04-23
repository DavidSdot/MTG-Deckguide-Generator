// Fetch card data from Scryfall API

export async function fetchCardData(name, lang = "en", set = "", setnum = "") {

  if (set != "" && setnum != "") {
    var setRes = await fetch(`https://api.scryfall.com/cards/${set}/${setnum}/${lang}`);
    if (!setRes.ok) {
      setRes = await fetch(`https://api.scryfall.com/cards/${set}/${setnum}`);
    }
    if (setRes.ok) {
      const setData = await setRes.json();
      return setData;
    }
  }

  const bySet = set = "" ? "" : `&set=${set}`;
  const baseRes = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}${bySet}`);
  if (!baseRes.ok) return null;

  const baseCard = await baseRes.json();
  if (lang === "en") return baseCard;

  const printsRes = await fetch(`${baseCard.prints_search_uri}&include_multilingual=true`);
  if (printsRes.ok) {
    const data = await printsRes.json();
    const localized = data.data.find(card => card.lang === lang);
    if (localized) {
      return {
        ...baseCard,
        ...localized,
        image_uris: localized.image_uris || baseCard.image_uris
      };
    }
  }

  return baseCard;
}