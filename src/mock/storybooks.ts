export interface VocabWord {
  word: string;
  phonetic: string;
}

export interface StoryPage {
  image: string;
  text: string;
  audio?: string;
}

export interface StoryBook {
  id: number;
  slug: string;
  title: string;
  cover: string;
  vocabulary: VocabWord[];
  pages: StoryPage[];
}

export const storyBooks: StoryBook[] = [
  {
    id: 1,
    slug: "first-day-at-school",
    title: "First day at school",
    cover: "/grade1_school.png",
    vocabulary: [
      { word: "Hi", phonetic: "/haɪ/" },
      { word: "Bye", phonetic: "/baɪ/" },
    ],
    pages: [
      {
        image: "/grade1_school.png",
        text: "It is the first day at school. The children are very excited.",
      },
      {
        image: "/grade1_colors.png",
        text: "\"Hi! My name is Lan,\" says the girl. \"Hi Lan! I am Nam,\" says the boy.",
      },
      {
        image: "/grade1_animals.png",
        text: "They learn new words together. Hi means hello. Bye means goodbye.",
      },
      {
        image: "/grade2_family.png",
        text: "At the end of the day, they say \"Bye! See you tomorrow!\"",
      },
    ],
  },
  {
    id: 2,
    slug: "a-sad-cat",
    title: "A sad cat",
    cover: "/grade1_animals.png",
    vocabulary: [
      { word: "Cat", phonetic: "/kæt/" },
      { word: "Sad", phonetic: "/sæd/" },
      { word: "Happy", phonetic: "/ˈhæpi/" },
    ],
    pages: [
      {
        image: "/grade1_animals.png",
        text: "There is a little cat. The cat is very sad.",
      },
      {
        image: "/grade2_family.png",
        text: "The cat has no friends. It sits alone every day.",
      },
      {
        image: "/grade1_school.png",
        text: "One day, a kind girl finds the cat. She takes it home.",
      },
      {
        image: "/grade1_colors.png",
        text: "Now the cat is happy! It has a loving home and a best friend.",
      },
    ],
  },
  {
    id: 3,
    slug: "at-the-street-market",
    title: "At the street market",
    cover: "/grade2_family.png",
    vocabulary: [
      { word: "Market", phonetic: "/ˈmɑːrkɪt/" },
      { word: "Buy", phonetic: "/baɪ/" },
      { word: "Fruit", phonetic: "/fruːt/" },
    ],
    pages: [
      {
        image: "/grade2_family.png",
        text: "Today, Lan goes to the street market with her mom.",
      },
      {
        image: "/grade4_food.png",
        text: "There are many fruits at the market. Apples, bananas, and oranges!",
      },
      {
        image: "/grade2_house_rooms.png",
        text: "\"Can I buy some apples, please?\" asks Lan.",
      },
      {
        image: "/grade1_colors.png",
        text: "They buy many things and go home happy.",
      },
    ],
  },
];
