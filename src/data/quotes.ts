export interface MotivationalQuote {
  quote: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "You don't have to be extreme, just consistent.",
    author: "HomeFit Philosophy"
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Napoleon Hill"
  },
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    quote: "No gym? No problem. Your body is your greatest gym.",
    author: "Calisthenics Proverb"
  },
  {
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    quote: "Energy flows where focus goes.",
    author: "Tony Robbins"
  },
  {
    quote: "A 20-minute workout is only 1.4% of your entire day.",
    author: "Daily Reminder"
  }
];

export function getRandomQuote(): MotivationalQuote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}
