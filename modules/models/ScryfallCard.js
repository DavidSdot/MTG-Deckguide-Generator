// Card model for Scryfall API

// Handles card data fetching and conversion to ScryfallCard objects
export class ScryfallCard {
  constructor(data, sideboard = false) {
    this.id = data.id;
    this.oracleId = data.oracle_id;
    this.name = data.name;
    this.printed_name = data.printed_name;
    this.lang = data.lang;
    this.releasedAt = data.released_at;
    this.manaCost = data.mana_cost;
    this.cmc = data.cmc;
    this.type_line = data.type_line;
    this.printed_type_line = data.printed_type_line;
    this.oracleText = data.oracle_text;
    this.power = data.power;
    this.toughness = data.toughness;
    this.colors = data.colors;
    this.colorIdentity = data.color_identity;
    this.keywords = data.keywords;
    this.image_Uris = data.image_uris;
    this.legalities = data.legalities;
    this.prices = data.prices;
    this.purchaseUris = data.purchase_uris;
    this.relatedUris = data.related_uris;
    this.scryfall_uri = data.scryfall_uri;

    this.isSideboard = false;
    this.quantity = 0;
    this.set = data.set;
    this.setnum = data.setnum;
  }

  static fromJson(json) {
    return new ScryfallCard(json);
  }

  get Name() {
    return this.printed_name ? this.printed_name : this.name;
  }

  get TypeLine() {
    return this.printed_type_line ? this.printed_type_line : this.type_line;
  }

  getImageUrl(size = 'normal') {
    return this.image_Uris?.[size.toLowerCase()] || null;
  }

  isLegalIn(format) {
    return this.legalities?.[format.toLowerCase()] === 'legal';
  }

  getPrice(currency = 'eur') {
    return this.prices?.[currency.toLowerCase()] || null;
  }



}
