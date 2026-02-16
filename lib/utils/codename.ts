const ADJECTIVES = [
  "Swift",
  "Clever",
  "Bold",
  "Silent",
  "Rogue",
  "Iron",
  "Ghost",
  "Lunar",
  "Neon",
  "Velvet",
  "Crimson",
  "Phantom",
];

const COLOURS = [
  "Amber",
  "Cobalt",
  "Jade",
  "Onyx",
  "Scarlet",
  "Ivory",
  "Teal",
  "Violet",
  "Silver",
  "Indigo",
  "Azure",
  "Obsidian",
];

const ANIMALS = [
  "Fox",
  "Raven",
  "Wolf",
  "Lynx",
  "Cobra",
  "Hawk",
  "Viper",
  "Jaguar",
  "Falcon",
  "Mantis",
  "Panther",
  "Osprey",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCodename(): string {
  return pick(ADJECTIVES) + pick(COLOURS) + pick(ANIMALS);
}
