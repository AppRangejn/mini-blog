import { Post } from '../database/models/Post';

const POSTS_DATA = [
  {
    title: 'Slow Mornings: Why I Stopped Checking My Phone Before 8 AM',
    excerpt:
      'Trading doomscrolling for black filter coffee, ten minutes of stretching, and actual silence.',
    content:
      'For years, my mornings started with notifications, unread messages, and half-awake scrolling before my feet even hit the floor. A month ago, I left my phone charging in the hallway overnight.\n\nThe difference was immediate. Making pour-over coffee without a screen nearby turned into a small daily ritual, and my focus during the first two hours of the day doubled.',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000',
  },
  {
    title: 'A Weekend Train Trip to the Carpathian Mountains',
    excerpt:
      'Foggy pine trails, wooden guesthouses, and zero mobile signal for forty-eight hours.',
    content:
      'Sometimes the best reset button is an overnight train ticket and a backpack with only the essentials. We arrived just as the morning mist was lifting over the ridges.\n\nAfter six hours of hiking along muddy forest paths, nothing tasted better than hot mushroom soup and herbal tea by a wood-burning stove.',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000',
  },
  {
    title: 'How I Learned to Bake Sourdough Bread in a Tiny Kitchen',
    excerpt:
      'Three failed loaves, one stubborn starter, and the smell of toasted crust on a Sunday.',
    content:
      'Sourdough baking looks intimidating until you realize it is mostly patience. My first two loaves came out dense enough to use as doorstops because I rushed the fermentation.\n\nOnce I stopped watching the clock and started watching the dough, everything clicked. Warm bread with salted butter straight out of the oven beats anything from a store.',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000',
  },
  {
    title: 'Walking 10,000 Steps Every Evening Without Headphones',
    excerpt:
      'What happens when you let your brain wander after a long day at the desk.',
    content:
      'When you spend eight hours staring at a monitor, your head feels crowded by evening. I started going for a 45-minute walk around the neighborhood right after dinner—no podcasts, no music.\n\nAt first it felt boring, then it became the part of the day where my best ideas and clearest thoughts naturally showed up.',
    imageUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1000',
  },
  {
    title: 'Five Books That Actually Changed How I Think About Habits',
    excerpt: 'Practical takeaways from books I keep coming back to every year.',
    content:
      'Most self-improvement books repeat the same ten pages of advice over three hundred pages. However, a few rare ones genuinely reshaped how I structure my environment and energy.\n\nThe biggest lesson across all of them: rely less on willpower and more on making good choices the easiest default option in your room.',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000',
  },
  {
    title: 'Rainy Sunday Cooking: Creamy Mushroom Pasta from Scratch',
    excerpt:
      'A 25-minute comfort dinner using simple ingredients already sitting in the fridge.',
    content:
      'When it rains all afternoon, cooking something warm feels like the best therapy. Slice brown mushrooms thin, sear them until golden with garlic and thyme, and deglaze the pan with a splash of pasta water.\n\nToss in al dente tagliatelle, a spoonful of parmesan, and freshly cracked black pepper—simple, fast, and deeply comforting.',
    imageUrl:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000',
  },
  {
    title: 'Decluttering My Workspace: Less Gear, More Focus',
    excerpt:
      'Why removing half the items from my desk made working from home feel lighter.',
    content:
      'Over time, cables, notebooks, mugs, and random gadgets quietly take over every square centimeter of a desk. Last weekend I cleared everything off and put back only what I use daily.\n\nA clean surface, warm desk lamp, and one notebook completely changed how calm my workspace feels during late-evening sessions.',
    imageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000',
  },
  {
    title: 'Shooting Street Photos on an Old 35mm Film Camera',
    excerpt: 'Why having only 36 frames makes you slow down and notice light.',
    content:
      'Digital cameras let you take five hundred photos in an afternoon without thinking twice. Shooting on a roll of 36-exposure film forces you to pause, compose carefully, and wait for the right shadow.\n\nPicking up the developed scans a week later feels like opening a small time capsule from days you had already forgotten.',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
  },
  {
    title: 'Notes from a Solo Autumn Walk Through Old Lviv',
    excerpt:
      'Cobblestone alleys, hidden courtyards, and cinnamon pastries on a crisp October morning.',
    content:
      'Waking up early in an unfamiliar city gives you a quiet window before the tour groups and traffic arrive. Stepping out at 7 AM, the wet cobblestones reflected the warm glow of streetlamps.\n\nI spent three hours wandering without a map, stopping wherever the smell of fresh pastry drifted out of a doorway.',
    imageUrl:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000',
  },
  {
    title: 'What I Learned Keeping a One-Line Journal for 365 Days',
    excerpt:
      'A two-minute nightly habit that turns ordinary weeks into memories you actually keep.',
    content:
      'Every time I tried keeping a long diary, I quit after two weeks. Switching to a single sentence before bed—just one moment worth remembering from that day—made it effortless.\n\nReading back through an entire year of ordinary Tuesdays and small wins is easily the most rewarding thing on my bookshelf.',
    imageUrl:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000',
  },
];

export const seedPosts = async (authorId: number): Promise<void> => {
  const existingCount = await Post.count();
  if (existingCount > 0) {
    console.log(`Posts already exist (${existingCount}), skipping post seed.`);
    return;
  }

  await Post.bulkCreate(
    POSTS_DATA.map((post) => ({
      ...post,
      authorId,
    })),
  );

  console.log(`Seeded ${POSTS_DATA.length} posts.`);
};
