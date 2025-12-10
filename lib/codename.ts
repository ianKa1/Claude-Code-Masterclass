const adjectives = [
  "Swift",
  "Bold",
  "Clever",
  "Silent",
  "Fierce",
  "Nimble",
  "Sly",
  "Daring",
  "Cunning",
  "Stealthy",
  "Quick",
  "Smooth",
  "Sharp",
  "Wise",
  "Slick",
  "Ghost",
  "Shadow",
  "Phantom",
  "Rogue",
  "Midnight",
];

const colors = [
  "Silver",
  "Golden",
  "Crimson",
  "Violet",
  "Azure",
  "Emerald",
  "Obsidian",
  "Ruby",
  "Sapphire",
  "Onyx",
  "Copper",
  "Bronze",
  "Jade",
  "Pearl",
  "Amber",
  "Scarlet",
  "Indigo",
  "Ivory",
  "Ebony",
  "Steel",
];

const objects = [
  "Phantom",
  "Viper",
  "Raven",
  "Fox",
  "Wolf",
  "Hawk",
  "Dragon",
  "Tiger",
  "Falcon",
  "Panther",
  "Cobra",
  "Eagle",
  "Lynx",
  "Jaguar",
  "Leopard",
  "Shadow",
  "Specter",
  "Whisper",
  "Echo",
  "Cipher",
];

/**
 * Generates a random codename by combining an adjective, color, and object in PascalCase.
 * @returns A randomly generated codename (e.g., "SwiftSilverPhantom")
 */
export function generateCodename(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const object = objects[Math.floor(Math.random() * objects.length)];

  return `${adjective}${color}${object}`;
}
