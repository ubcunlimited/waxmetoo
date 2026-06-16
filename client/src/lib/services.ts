export type ServiceItem = {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  whoItsFor?: string;
  prep?: string;
  aftercare?: string;
  price: number;
  duration?: string;
  popular?: boolean;
  note?: string;
};

export type SubCategory = {
  id: string;
  title: string;
  items: ServiceItem[];
};

// ─── NEW! Lamination & Brow Henna ───────────────────────────────────────────
export const laminationItems: ServiceItem[] = [
  {
    id: "brow-lamination",
    name: "Brow Lamination",
    tagline: "Perfectly groomed brows that last for weeks.",
    description: "Transform your brows into works of art with The London Brow Company's revolutionary lamination treatment. This expertly crafted, vegan and cruelty-free formula will leave your brows looking perfectly groomed and flawlessly smooth. Experience the ultimate brow transformation and reveal a new level of beauty with our lamination service.",
    price: 75,
    duration: "45–60 min",
    popular: true,
  },
  {
    id: "brow-lamination-tint",
    name: "Brow Lamination and Tint",
    tagline: "The ultimate brow transformation — groomed, defined, and darkened.",
    description: "Transform your brows into works of art with The London Brow Company's revolutionary lamination treatment. This expertly crafted, vegan and cruelty-free formula will leave your brows looking perfectly groomed and flawlessly smooth. Take it one step further and add a brow tint to your treatment and enjoy darkened tinted perfect brows. It's the ultimate brow transformation service and lasts for weeks!",
    price: 95,
    duration: "60–75 min",
    popular: true,
  },
];

export const mostPopular: ServiceItem[] = [
  {
    id: "brazilian",
    name: "Brazilian Wax",
    tagline: "Our signature service. Completely bare. Completely confident.",
    description: "The Brazilian wax removes all or nearly all hair from the bikini area — front, back, and everything in between. Our estheticians are trained to make this service as comfortable as possible, using premium hard wax that grips the hair, not the skin.",
    whoItsFor: "Anyone who wants a clean, smooth result with long-lasting confidence. First-timers are always welcome — we'll walk you through every step.",
    prep: "Let hair grow to at least ¼ inch (about 3–4 weeks of growth). Exfoliate 24 hours before. Avoid scheduling during your period if possible.",
    aftercare: "Avoid heat, friction, and tight clothing for 24–48 hours. Exfoliate gently after 48 hours to prevent ingrown hairs.",
    price: 65,
    duration: "30–45 min",
    popular: true,
  },
  {
    id: "deep-bikini",
    name: "Deep Bikini Wax",
    tagline: "More than a bikini, less than a Brazilian.",
    description: "The deep bikini wax goes further than a standard bikini — removing more hair from the front and sides while leaving a small strip or triangle. The perfect middle ground between bikini and Brazilian.",
    whoItsFor: "Great for those who want more coverage removed than a standard bikini but aren't ready for a full Brazilian.",
    prep: "Same as Brazilian — ¼ inch minimum hair growth.",
    aftercare: "Avoid heat and friction for 24 hours. Moisturize daily.",
    price: 55,
    duration: "25–35 min",
    popular: true,
  },
  {
    id: "bikini",
    name: "Bikini Wax",
    tagline: "Perfectly tidy. Clean and classic.",
    description: "A classic bikini wax removes hair along the bikini line — everything that would show in a swimsuit. Removes anything outside the bikini line. Clean, precise, and quick.",
    whoItsFor: "Perfect for those who prefer a natural look with clean edges, or as a starting point before trying a Brazilian.",
    prep: "Hair should be at least ¼ inch long. Avoid sun exposure on the area for 24 hours before.",
    aftercare: "Keep the area clean and moisturized. Avoid tight underwear for 24 hours.",
    price: 45,
    duration: "20–30 min",
    popular: true,
  },
  {
    id: "eyebrow-design",
    name: "Eyebrow Wax & Design",
    tagline: "We don't just wax your eyebrows, we design them.",
    description: "Precision eyebrow shaping and design — we sculpt your brows to complement your face shape and natural arch. Clean, defined, and polished every time.",
    whoItsFor: "Anyone who wants beautifully shaped, defined brows that frame their face.",
    prep: "Come with clean, makeup-free brows if possible.",
    aftercare: "Avoid touching the area for a few hours. Skip heavy makeup on the brows for 24 hours.",
    price: 20,
    duration: "20 min",
    popular: true,
  },
];

export const ladiesSections: SubCategory[] = [
  {
    id: "bikini-area",
    title: "Bikini Area",
    items: [
      { id: "l-brazilian", name: "Brazilian Wax", tagline: "Our signature service. Complete, clean, confident.", description: "Removes all or nearly all hair from the bikini area — front, back, and everything in between.", price: 65, duration: "30–45 min", popular: true },
      { id: "l-deep-bikini", name: "Deep Bikini Wax", tagline: "More coverage, more confidence.", description: "Goes further than a standard bikini — removing more hair from the front and sides.", price: 55, duration: "25–35 min" },
      { id: "l-bikini", name: "Bikini Wax", tagline: "Clean lines, effortless confidence.", description: "Removes hair along the bikini line — everything that would show in a swimsuit.", price: 45, duration: "20–30 min" },
    ],
  },
  {
    id: "combos",
    title: "Combos",
    items: [
      { id: "l-combo-bz-brow", name: "Brazilian + Brow", tagline: "Two essentials, one appointment.", description: "Brazilian wax plus eyebrow wax in a single visit.", price: 85, duration: "45–60 min" },
      { id: "l-combo-bz-ua", name: "Brazilian + Underarm", tagline: "Smooth all over.", description: "Brazilian wax plus underarm wax.", price: 85, duration: "45–60 min" },
      { id: "l-combo-bz-leg", name: "Brazilian + Lower Leg", tagline: "Head to toe smooth.", description: "Brazilian wax plus lower leg wax.", price: 105, duration: "60–75 min" },
      { id: "l-combo-db-brow", name: "Deep Bikini + Brow", tagline: "Coverage and definition.", description: "Deep bikini wax plus eyebrow wax.", price: 85, duration: "40–55 min" },
      { id: "l-combo-db-ua", name: "Deep Bikini + Underarm", tagline: "Smooth where it counts.", description: "Deep bikini wax plus underarm wax.", price: 75, duration: "35–50 min" },
      { id: "l-combo-db-leg", name: "Deep Bikini + Lower Leg", tagline: "More coverage, more smooth.", description: "Deep bikini wax plus lower leg wax.", price: 90, duration: "50–65 min" },
    ],
  },
  {
    id: "arms-legs",
    title: "Arms & Legs",
    items: [
      { id: "l-half-arm", name: "1/2 Arm (Elbow to Knuckles)", tagline: "Smooth lower arms.", description: "Waxing from elbow to knuckles for clean, smooth lower arms.", price: 45, duration: "20–25 min" },
      { id: "l-full-arm", name: "Full Arm", tagline: "Smooth arms, effortlessly.", description: "Full arm wax from wrist to shoulder.", price: 55, duration: "30–40 min" },
      { id: "l-underarms", name: "Underarms", tagline: "Smooth underarms that last for weeks.", description: "Quick, effective underarm wax.", price: 25, duration: "15 min" },
      { id: "l-lower-leg", name: "Lower Leg / 1/2 Leg", tagline: "Silky smooth from knee to ankle.", description: "Waxing from the knee down to the ankle.", price: 55, duration: "25–35 min" },
      { id: "l-full-leg", name: "Full Leg", tagline: "Silky smooth from hip to toe.", description: "Full leg wax from upper thigh to ankle.", price: 90, duration: "45–60 min" },
      { id: "l-thighs", name: "Thighs", tagline: "Upper leg smoothness.", description: "Waxing the upper thigh area.", price: 55, duration: "25–35 min" },
      { id: "l-bike-shorts", name: "Bike Shorts Area (Legs only)", tagline: "Upper leg coverage.", description: "Waxing the bike shorts area — legs only.", price: 45, duration: "25–30 min" },
    ],
  },
  {
    id: "face-waxing",
    title: "Face Waxing",
    items: [
      { id: "l-brow", name: "Brow", tagline: "Your best brows. Every time.", description: "Shapes and defines your brows for a polished, natural look.", price: 20, duration: "15–20 min", popular: true },
      { id: "l-nose", name: "Nose", tagline: "Quick and clean.", description: "Safe, quick nose wax removing visible nasal hair.", price: 20, duration: "10 min" },
      { id: "l-ears", name: "Ears", tagline: "Discreet and effective.", description: "Removes unwanted ear hair quickly and cleanly.", price: 20, duration: "10 min" },
      { id: "l-brow-nose-ears", name: "Brow, Nose & Ears", tagline: "Complete facial grooming.", description: "Brow, nose, and ear wax in one visit.", price: 47, duration: "30 min" },
      { id: "l-nose-ears", name: "Nose & Ears", tagline: "Double clean.", description: "Nose and ear wax together.", price: 36, duration: "20 min" },
      { id: "l-nose-addon", name: "Nose (add-on)", tagline: "Add to any service.", description: "Nose wax added onto another service.", price: 18, duration: "10 min" },
      { id: "l-ears-addon", name: "Ears (add-on)", tagline: "Add to any service.", description: "Ear wax added onto another service.", price: 18, duration: "10 min" },
      { id: "l-full-face-brow", name: "Full Face & Brow", tagline: "Complete facial waxing.", description: "Full face wax including brow shaping.", price: 58, duration: "40–50 min" },
      { id: "l-full-face", name: "Full Face (Lip, Chin, Cheeks)", tagline: "Smooth all over.", description: "Lip, chin, and cheeks waxed in one appointment.", price: 48, duration: "35–45 min" },
      { id: "l-brow-design", name: "Eyebrow Design", tagline: "Sculpted, defined brows.", description: "Precision eyebrow shaping and design.", price: 20, duration: "20 min" },
      { id: "l-lip", name: "Lip", tagline: "Quick, clean, effective.", description: "Upper lip wax for smooth, clean skin.", price: 20, duration: "10 min" },
      { id: "l-chin", name: "Chin", tagline: "Clean chin, smooth confidence.", description: "Removes unwanted chin hair.", price: 20, duration: "10 min" },
      { id: "l-cheeks", name: "Cheeks (Face)", tagline: "Smooth cheeks.", description: "Removes peach fuzz and unwanted hair from the cheeks.", price: 20, duration: "15 min" },
    ],
  },
  {
    id: "other-body",
    title: "Other Body Parts",
    items: [
      { id: "l-cheeks-body", name: "Cheeks (Derriere)", tagline: "Smooth and clean.", description: "Waxing of the derriere cheeks.", price: 20, duration: "15 min" },
      { id: "l-stomach", name: "Stomach", tagline: "Clean lines for a smooth midsection.", description: "Removes hair from the stomach area.", price: 20, duration: "20 min" },
      { id: "l-happy-trails", name: "Happy Trails", tagline: "The finishing touch.", description: "Removes the happy trail hair below the navel.", price: 10, duration: "10 min" },
      { id: "l-full-back", name: "Full Back", tagline: "Full back, clean results.", description: "Complete back waxing for a smooth, clean finish.", price: 60, duration: "30–40 min" },
      { id: "l-chest", name: "Chest", tagline: "Smooth chest.", description: "Full chest waxing.", price: 50, duration: "30–40 min" },
      { id: "l-stomach-neck", name: "Stomach (Neck to Stomach)", tagline: "Upper body smooth.", description: "Stomach wax as part of the neck-to-stomach area.", price: 25, duration: "20 min" },
      { id: "l-chest-stomach", name: "Chest/Stomach Combined", tagline: "Complete front torso.", description: "Chest and stomach waxed together.", price: 60, duration: "40–50 min" },
      { id: "l-neckline", name: "Neckline", tagline: "Clean neckline.", description: "Waxing the neckline for a clean, defined edge.", price: 10, duration: "10 min" },
    ],
  },
  {
    id: "tinting",
    title: "Tinting",
    items: [
      { id: "l-lash-tint", name: "Lash Tint", tagline: "Defined lashes without the mascara.", description: "Professional lash tinting adds depth and definition.", price: 20, duration: "20–25 min" },
      { id: "l-brow-tint", name: "Brow Tint", tagline: "Fuller, defined brows.", description: "Professional brow tinting for color, depth, and definition.", price: 20, duration: "15–20 min" },
      { id: "l-brow-wax-tint", name: "Brow Wax & Tint", tagline: "Shape and color in one appointment.", description: "Brow wax combined with professional tint.", price: 35, duration: "30 min", popular: true },
    ],
  },
];

export const menSections: SubCategory[] = [
  {
    id: "m-below-belt",
    title: "Below the Belt",
    items: [
      { id: "m-manzilian", name: "Manzilian (Male Brazilian)", tagline: "The male Brazilian. Clean, confident, professional.", description: "Full male Brazilian wax performed by experienced, discreet estheticians in a private room.", price: 90, duration: "45–60 min", popular: true },
      { id: "m-derriere", name: "Derriere Cheeks", tagline: "Smooth and clean.", description: "Waxing of the derriere cheeks.", price: 35, duration: "20 min" },
    ],
  },
  {
    id: "m-combos",
    title: "Combos",
    items: [
      { id: "m-combo-bz-brow", name: "Manzilian + Brow", tagline: "Two essentials, one appointment.", description: "Manzilian plus eyebrow wax in a single visit.", price: 85, duration: "60–75 min" },
      { id: "m-combo-bz-ua", name: "Manzilian + Underarm", tagline: "Smooth all over.", description: "Manzilian plus underarm wax.", price: 85, duration: "60–75 min" },
    ],
  },
  {
    id: "m-arms-legs",
    title: "Arms & Legs",
    items: [
      { id: "m-half-arm", name: "1/2 Arm", tagline: "Smooth lower arms.", description: "Half arm wax.", price: 40, duration: "20 min" },
      { id: "m-full-arm", name: "Full Arm", tagline: "Smooth arms, effortlessly.", description: "Full arm wax from wrist to shoulder.", price: 50, duration: "30–40 min" },
      { id: "m-shoulders", name: "Shoulders", tagline: "Clean shoulders.", description: "Waxing the shoulder area.", price: 25, duration: "15 min" },
      { id: "m-underarms", name: "Underarms", tagline: "Smooth underarms.", description: "Quick, effective underarm wax.", price: 20, duration: "15 min" },
      { id: "m-half-leg", name: "1/2 Leg", tagline: "Lower or upper leg.", description: "Half leg wax — knee down or above knee.", price: 55, duration: "25–35 min" },
      { id: "m-full-leg", name: "Full Leg", tagline: "Silky smooth from hip to toe.", description: "Full leg wax for men.", price: 100, duration: "45–60 min" },
      { id: "m-toes", name: "Toes", tagline: "The finishing touch.", description: "Toe hair waxing.", price: 5, duration: "5 min" },
    ],
  },
  {
    id: "m-neck-stomach",
    title: "Neck to Stomach",
    items: [
      { id: "m-full-back", name: "Full Back", tagline: "Clean back, confident you.", description: "Professional back waxing for men.", price: 65, duration: "30–40 min" },
      { id: "m-chest", name: "Chest", tagline: "Smooth chest, lasting results.", description: "Full chest waxing for a clean, defined look.", price: 55, duration: "30–40 min" },
      { id: "m-chest-stomach", name: "Chest/Stomach Combined", tagline: "The complete package.", description: "Chest and stomach waxed together.", price: 65, duration: "40–50 min" },
    ],
  },
  {
    id: "m-face",
    title: "Face Waxing",
    items: [
      { id: "m-brow", name: "Brow", tagline: "Groomed brows, clean look.", description: "Clean up the brow line and remove unwanted hair between the brows.", price: 20, duration: "15 min" },
      { id: "m-nose", name: "Nose", tagline: "Quick, clean, effective.", description: "Safe, quick nose wax that removes visible nasal hair.", price: 20, duration: "10 min" },
      { id: "m-ears", name: "Ears", tagline: "Discreet and effective.", description: "Removes unwanted ear hair quickly and cleanly.", price: 20, duration: "10 min" },
      { id: "m-brow-nose-ears", name: "Brow, Nose & Ears", tagline: "Complete facial grooming.", description: "Brow, nose, and ear wax in one visit.", price: 47, duration: "30 min" },
      { id: "m-nose-ears", name: "Nose & Ears", tagline: "Double clean.", description: "Nose and ear wax together.", price: 36, duration: "20 min" },
      { id: "m-nose-addon", name: "Nose (add-on)", tagline: "Add to any service.", description: "Nose wax added onto another service.", price: 18, duration: "10 min" },
      { id: "m-ears-addon", name: "Ears (add-on)", tagline: "Add to any service.", description: "Ear wax added onto another service.", price: 18, duration: "10 min" },
      { id: "m-full-face-brow", name: "Full Face & Brow", tagline: "Complete facial waxing.", description: "Full face wax including brow shaping.", price: 58, duration: "40–50 min" },
      { id: "m-full-face", name: "Full Face (Lip, Chin, Cheeks)", tagline: "Smooth all over.", description: "Lip, chin, and cheeks waxed in one appointment.", price: 48, duration: "35–45 min" },
      { id: "m-brow-design", name: "Eyebrow Design", tagline: "Sculpted, defined brows.", description: "Precision eyebrow shaping and design.", price: 20, duration: "20 min" },
      { id: "m-lip", name: "Lip", tagline: "Quick, clean, effective.", description: "Upper lip wax.", price: 20, duration: "10 min" },
      { id: "m-chin", name: "Chin", tagline: "Clean chin.", description: "Removes unwanted chin hair.", price: 20, duration: "10 min" },
      { id: "m-cheeks", name: "Cheeks (Face)", tagline: "Smooth cheeks.", description: "Removes peach fuzz and unwanted hair from the cheeks.", price: 20, duration: "15 min" },
    ],
  },
];


