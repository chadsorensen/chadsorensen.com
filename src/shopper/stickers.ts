/**
 * Guess a produce-sticker emoji + aisle color for an item from its name.
 * First match wins, so more specific words come before general ones.
 */

export type Aisle = 'produce' | 'dairy' | 'meat' | 'bakery' | 'pantry' | 'frozen' | 'drinks' | 'home'

export interface Sticker {
  emoji: string
  aisle: Aisle
}

const RULES: [RegExp, string, Aisle][] = [
  // produce
  [/\bavo(cado)?s?\b|guac/, '🥑', 'produce'],
  [/garlic/, '🧄', 'produce'],
  [/onion|shallot|scallion|leek/, '🧅', 'produce'],
  [/\btom(ato(es)?|s)?\b|tomatillo/, '🍅', 'produce'],
  [/\blimes?\b|\blemons?\b|citrus/, '🍋', 'produce'],
  [/cabbage|lettuce|spinach|kale|greens|chard|arugula|bok choy/, '🥬', 'produce'],
  [/cilantro|parsley|basil|herb|mint|dill/, '🌿', 'produce'],
  [/jalape|serrano|habanero|chile|chili|pepper/, '🌶️', 'produce'],
  [/carrot/, '🥕', 'produce'],
  [/potato|yam/, '🥔', 'produce'],
  [/\bcorn\b(?!.*tortilla)|elote/, '🌽', 'produce'],
  [/broccoli|cauliflower/, '🥦', 'produce'],
  [/cucumber|pickle/, '🥒', 'produce'],
  [/mushroom/, '🍄', 'produce'],
  [/banana/, '🍌', 'produce'],
  [/apple/, '🍎', 'produce'],
  [/orange|clementine|mandarin/, '🍊', 'produce'],
  [/berr(y|ies)/, '🍓', 'produce'],
  [/grape/, '🍇', 'produce'],
  [/peach|nectarine/, '🍑', 'produce'],
  [/pear\b/, '🍐', 'produce'],
  [/pineapple/, '🍍', 'produce'],
  [/melon/, '🍉', 'produce'],
  [/ginger/, '🫚', 'produce'],
  // bakery & tortillas
  [/tortilla|taco shell/, '🫓', 'bakery'],
  [/bagel/, '🥯', 'bakery'],
  [/croissant/, '🥐', 'bakery'],
  [/bread|bun|roll|loaf|baguette|sourdough/, '🍞', 'bakery'],
  // frozen
  [/ice cream|popsicle|frozen/, '🍦', 'frozen'],
  // dairy & eggs
  [/\beggs?\b/, '🥚', 'dairy'],
  [/milk|cream|half and half/, '🥛', 'dairy'],
  [/cheese|queso|cotija/, '🧀', 'dairy'],
  [/peanut butter/, '🥜', 'pantry'],
  [/butter/, '🧈', 'dairy'],
  [/yogh?urt/, '🥛', 'dairy'],
  // meat & fish
  [/bacon/, '🥓', 'meat'],
  [/chicken|turkey/, '🍗', 'meat'],
  [/beef|steak|carne|burger|chorizo|pork|sausage|ham\b/, '🥩', 'meat'],
  [/fish|salmon|tuna|shrimp|prawn|cod/, '🐟', 'meat'],
  // drinks
  [/coffee/, '☕', 'drinks'],
  [/\btea\b/, '🍵', 'drinks'],
  [/beer|ipa|lager/, '🍺', 'drinks'],
  [/wine/, '🍷', 'drinks'],
  [/juice|soda|seltzer|la croix|kombucha|water/, '🧃', 'drinks'],
  // pantry
  [/hot sauce|salsa|sriracha|valentina|tapat/, '🌶️', 'pantry'],
  [/rice/, '🍚', 'pantry'],
  [/beans/, '🫘', 'pantry'],
  [/pasta|noodle|spaghetti|ramen/, '🍝', 'pantry'],
  [/cereal|oats|granola/, '🥣', 'pantry'],
  [/honey/, '🍯', 'pantry'],
  [/salt/, '🧂', 'pantry'],
  [/oil|vinegar/, '🫒', 'pantry'],
  [/chips|crackers|pretzel|popcorn/, '🥨', 'pantry'],
  [/cookie|chocolate|candy/, '🍪', 'pantry'],
  [/peanut|nuts|almond/, '🥜', 'pantry'],
  [/can\b|canned|soup|broth|stock/, '🥫', 'pantry'],
  // household
  [/batter(y|ies)|\b9v\b|\baa+\b/, '🔋', 'home'],
  [/paper towel|toilet paper|\btp\b|tissue|napkin/, '🧻', 'home'],
  [/soap|detergent|dish|sponge|cleaner|bleach/, '🧽', 'home'],
  [/toothpaste|toothbrush|shampoo|deodorant|lotion/, '🪥', 'home'],
  [/trash bag|garbage|foil|plastic wrap|ziploc/, '🗑️', 'home'],
  [/dog|cat|pet/, '🐾', 'home'],
  [/bulb|light/, '💡', 'home'],
  [/flower/, '💐', 'home'],
]

const FALLBACK: Sticker = { emoji: '🛒', aisle: 'pantry' }

export function stickerFor(title: string): Sticker {
  const text = title.toLowerCase()
  for (const [pattern, emoji, aisle] of RULES) {
    if (pattern.test(text)) return { emoji, aisle }
  }
  return FALLBACK
}
