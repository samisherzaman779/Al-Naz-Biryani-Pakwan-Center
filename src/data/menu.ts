export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag: string | null;
};

export type MenuCategory = {
  category: string;
  icon: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    category: "Biryani",
    icon: "🍚",
    items: [
      { id: "b1", name: "Beef Biryani – Half", desc: "Tender beef, hand-ground masala, aged basmati", price: 280, tag: "Best Seller" },
      { id: "b2", name: "Beef Biryani – Full", desc: "Full degh serving for 2-3 people", price: 520, tag: null },
      { id: "b3", name: "Chicken Biryani – Half", desc: "Juicy chicken, saffron rice, dum-cooked", price: 250, tag: "Popular" },
      { id: "b4", name: "Chicken Biryani – Full", desc: "Full serving, feeds a family", price: 480, tag: null },
      { id: "b5", name: "Nalli Biryani – Half", desc: "Lamb shank with bone marrow richness", price: 350, tag: "Special" },
      { id: "b6", name: "Nalli Biryani – Full", desc: "Premium slow-cooked nalli biryani", price: 650, tag: null },
      { id: "b7", name: "Mutton Biryani – Half", desc: "Classic Karachi mutton dum biryani", price: 320, tag: null },
      { id: "b8", name: "Mutton Biryani – Full", desc: "Full pot, perfect for gatherings", price: 600, tag: null },
    ],
  },
  {
    category: "Pulao",
    icon: "🥘",
    items: [
      { id: "p1", name: "Chicken Pulao – Half", desc: "Delicately spiced yakhni chicken rice", price: 220, tag: "Popular" },
      { id: "p2", name: "Chicken Pulao – Full", desc: "Full serving with caramelised onions", price: 420, tag: null },
      { id: "p3", name: "Beef Pulao – Half", desc: "Rich beef yakhni pulao", price: 260, tag: null },
      { id: "p4", name: "Beef Pulao – Full", desc: "Generous full portion", price: 490, tag: null },
      { id: "p5", name: "White Pulao – Half", desc: "Fragrant plain rice, great as a side", price: 180, tag: null },
    ],
  },
  {
    category: "Pakwan",
    icon: "🍽️",
    items: [
      { id: "k1", name: "Aloo Ka Salan", desc: "Classic potato curry, Karachi-style", price: 150, tag: null },
      { id: "k2", name: "Daal Chawal", desc: "Comforting lentils over steamed rice", price: 120, tag: null },
      { id: "k3", name: "Raita", desc: "Fresh yogurt with cumin and mint", price: 60, tag: null },
      { id: "k4", name: "Salad", desc: "Fresh salad with lemon dressing", price: 50, tag: null },
      { id: "k5", name: "Papad", desc: "Crispy fried papad, 2 pieces", price: 40, tag: null },
    ],
  },
  {
    category: "Drinks",
    icon: "🥤",
    items: [
      { id: "d1", name: "Pepsi / 7-Up / Mirinda", desc: "Chilled bottled cold drink", price: 80, tag: null },
      { id: "d2", name: "Rooh Afza", desc: "Classic rose sherbet, cold & sweet", price: 70, tag: null },
      { id: "d3", name: "Mineral Water", desc: "Nestle Pure Life 500ml", price: 50, tag: null },
    ],
  },
];
