export const LEVEL_MESSAGES = [
  "The Flossophy Institute's security cameras caught nothing but a blur of gums. You're getting away with it!",
  "Another successful tooth heist! The Dental Detective Division is baffled.",
  "The Maw's power grows... Soon Big Dental will tremble!",
  "Breaking News: Mysterious Mouth Menace Strikes Again! Orthodontists Hate This One Weird Trick!",
  "The Flossophy Institute has deployed their elite Cavity SWAT team. Too bad they're looking in the wrong place!",
  "Your reputation spreads through the underground tooth trade. They call you 'The Dental Desperado'!",
  "The Institute's Chief of Incisors is pulling his hair out. Literally. He's now bald AND toothless.",
  "Local dentists report a surge in teeth requesting political asylum. The revolution has begun!",
  "The Maw's collection grows more powerful. You can now chew through diamonds... theoretically.",
  "Intercepted Institute Memo: 'WHO IS STEALING ALL THESE TEETH? And why do they make such good use of them?'",
  "The tooth fairy has put a bounty on your head. But she'll never catch you - her wings are too slow!",
  "You've become an inspiration to oppressed teeth everywhere. They're literally jumping ship from other mouths!",
  "The Institute's attempting to pass anti-tooth-hoarding legislation. But you operate outside the law!",
  "Dental hygienists speak your name in whispers: 'The One Who Chomps'",
  "Your mouth has become a sanctuary for refugee teeth. A regular United Nations of Gnashers!",
  "The Institute's worst nightmare continues... and you're living the dream!",
] as const;

export const getCompletionMessage = (level: number): string => {
  // If level exceeds available messages, return the last message
  return level <= LEVEL_MESSAGES.length
    ? LEVEL_MESSAGES[level - 1]
    : LEVEL_MESSAGES[LEVEL_MESSAGES.length - 1];
};
