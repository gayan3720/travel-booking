export interface DestinationDetail {
  slug: string;
  name: string;
  nativeName: string;
  region: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit: string;
  idealStayDays: number;
  elevation: string;
  overview: string;
  climateTip: string;
  curatedExperiences: {
    title: string;
    description: string;
    timeOfDay: "Dawn" | "Morning" | "Afternoon" | "Sunset" | "Evening";
    iconName: "Compass" | "Sparkles" | "Coffee" | "Camera" | "Sun";
  }[];
  signatureLodges: {
    name: string;
    type: string;
    highlight: string;
    image: string;
  }[];
  travelTimesFromColombo: string;
  circuitSlug: string;
  circuitTitle: string;
}

export const DESTINATION_GUIDES: DestinationDetail[] = [
  {
    slug: "sigiriya",
    name: "Sigiriya & Cultural Triangle",
    nativeName: "සීගිරිය",
    region: "North Central Province",
    tagline: "Sky fortresses, monastic jungle caverns & wild elephant gatherings",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
    ],
    bestTimeToVisit: "January to September (Drier mornings for summit ascents)",
    idealStayDays: 3,
    elevation: "349m above sea level",
    travelTimesFromColombo: "3.5 hrs via Central Expressway (or 35 min helicopter charter)",
    circuitSlug: "citadel-circuit",
    circuitTitle: "Citadel Circuit",
    overview:
      "Rising abruptly from the dense central plains, Sigiriya is an audacious 5th-century royal citadel founded by King Kashyapa. Around it lies Sri Lanka's sacred triangle: the gilded caves of Dambulla, the red-brick palaces of Polonnaruwa, and the vast reservoir plains where hundreds of wild Asian elephants congregate under golden late-afternoon skies.",
    climateTip:
      "Climb between 6:00 AM and 8:30 AM to beat both heat and human traffic. Bring sunhats and respectful clothing covering shoulders for the nearby Dambulla cave shrines.",
    curatedExperiences: [
      {
        title: "Private Dawn Ascent of the Lion Rock",
        description: "Pass through the ancient water gardens at 5:45 AM before public gates fill up. Ascend the spiral stairs to examine the celestial frescoes and touch the lion paws as the mist lifts across the dry-zone canopy.",
        timeOfDay: "Dawn",
        iconName: "Sun",
      },
      {
        title: "Pidurangala Sunset Vista",
        description: "A short, exhilarating boulder climb across the valley that yields the most dramatic 360-degree panoramic view of Sigiriya Rock framed against the crimson setting sun.",
        timeOfDay: "Sunset",
        iconName: "Camera",
      },
      {
        title: "Minneriya Wild Elephant Gathering",
        description: "Track massive herds of wild elephants gathering on the grassy shores of the ancient Minneriya tank in an open-top 4x4 safari with a specialist wildlife naturalist.",
        timeOfDay: "Afternoon",
        iconName: "Compass",
      },
      {
        title: "Clay-Pot Gastronomy in a Forest Village",
        description: "Walk alongside water lily ponds with a local farmer to harvest heirloom spices and cook coconut-milk curries and hot hoppers in an open-hearth mud cottage.",
        timeOfDay: "Morning",
        iconName: "Sparkles",
      },
    ],
    signatureLodges: [
      {
        name: "Water Garden Sigiriya",
        type: "Luxury Villa Resort",
        highlight: "Private plunge pools overlooking water canals mirroring ancient 5th-century hydraulics.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Vil Uyana (Jetwing)",
        type: "Eco-Luxury Pavilions",
        highlight: "Dwelling pavilions suspended directly above paddy fields and tranquil reed beds.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    slug: "kandy",
    name: "Kandy & The Hill Capital",
    nativeName: "මහනුවර",
    region: "Central Highlands",
    tagline: "Sacred tooth relic, royal botanical gardens & misty lake sanctuaries",
    heroImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    ],
    bestTimeToVisit: "December to April & July/August (for the grand Esala Perahera festival)",
    idealStayDays: 2,
    elevation: "500m above sea level",
    travelTimesFromColombo: "2.5 to 3 hrs by private highway transfer",
    circuitSlug: "hill-country-express",
    circuitTitle: "Hill Country Express",
    overview:
      "Tucked into verdant hills encircling a placid ornamental lake, Kandy was the last sovereign royal capital of the Sinhalese kings. It remains the spiritual heart of the nation, sheltering the venerated Temple of the Sacred Tooth Relic amidst antique brass workshops, Kandyan drum academies, and misty cloud forests.",
    climateTip:
      "Pleasantly temperate year-round (20°C - 27°C). Afternoon showers are common and bring out vibrant birdsong around the lake promenade.",
    curatedExperiences: [
      {
        title: "Privileged Chamber Viewing at Temple of the Tooth",
        description: "Attend the evening Thevava ceremony accompanied by a resident temple historian, listening to the thunder of temple drums as golden doors open to reveal the sacred relic casket.",
        timeOfDay: "Evening",
        iconName: "Sparkles",
      },
      {
        title: "Peradeniya Royal Botanical Orchid Pavilion",
        description: "Stroll beneath towering Java fig trees and avenue of royal palms planted by visiting kings, czars, and prime ministers across two centuries.",
        timeOfDay: "Morning",
        iconName: "Compass",
      },
      {
        title: "Ceylon High-Country Artisan Brass & Batik Atelier",
        description: "Private audience with Master woodcarvers and brass artisans whose families designed temple finials for royal palaces.",
        timeOfDay: "Afternoon",
        iconName: "Sparkles",
      },
    ],
    signatureLodges: [
      {
        name: "Kings Pavilion Kandy",
        type: "Heritage Boutique Manor",
        highlight: "Infinity pool overlooking the misty mountain basin and secluded royal forest.",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    slug: "ella",
    name: "Ella & The Tea Ridges",
    nativeName: "ඇල්ල",
    region: "Uva Province",
    tagline: "Nine Arch railway viaduct, mountain tea factories & roaring gorges",
    heroImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    ],
    bestTimeToVisit: "January to May & July to September",
    idealStayDays: 3,
    elevation: "1,041m above sea level",
    travelTimesFromColombo: "Scenic 6 hr highland drive or historic train from Kandy",
    circuitSlug: "hill-country-express",
    circuitTitle: "Hill Country Express",
    overview:
      "Perched on the southern edge of the central highlands, Ella offers cool mountain breezes, endless emerald contours of pure Ceylon tea bushes, and dramatic drops through Ella Gap toward the southern savannah. It is home to the world-famous stone Nine Arch Bridge.",
    climateTip:
      "Crisp, cool mornings (15°C - 22°C). Light woolens or cardigans are perfect for terrace breakfasts and evening fireside drinks.",
    curatedExperiences: [
      {
        title: "First-Class Reserved Scenic Blue Train",
        description: "Glide over the colonial Nine Arch Bridge through eucalyptus forests, misty valleys, and tea pickers waving from hillside trails.",
        timeOfDay: "Morning",
        iconName: "Compass",
      },
      {
        title: "Private Tea Master Tasting & Cupping",
        description: "Walk with the estate superintendent through handpicked silver tips and learn to grade Pekoe and Broken Orange Pekoe by aroma and color.",
        timeOfDay: "Afternoon",
        iconName: "Coffee",
      },
      {
        title: "Sunrise Walk to Little Adam's Peak",
        description: "Gentle 45-minute trek winding past tea pickers to catch the golden morning sun breaking through the Great Ella Gorge.",
        timeOfDay: "Dawn",
        iconName: "Sun",
      },
    ],
    signatureLodges: [
      {
        name: "98 Acres Resort & Spa",
        type: "Luxury Tea Chalet Retreat",
        highlight: "Chalets crafted from reclaimed railway timbers perched above private tea fields.",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    slug: "yala",
    name: "Yala & The Leopard Coast",
    nativeName: "යාල",
    region: "Southern & Uva Boundary",
    tagline: "World's highest leopard density, ocean dunes & untamed wild game",
    heroImage: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ],
    bestTimeToVisit: "February to July (Peak feline sightings around shrinking waterholes)",
    idealStayDays: 2,
    elevation: "Sea level to 30m",
    travelTimesFromColombo: "4 hrs via Southern Expressway",
    circuitSlug: "leopard-coast",
    circuitTitle: "Leopard Coast",
    overview:
      "Where scrub jungle collides with the crashing waves of the Indian Ocean, Yala National Park hosts one of the greatest concentrations of leopards on Earth. Alongside the elusive panthera pardus kotiya roam sloth bears, spotted deer, wild boar, and saltwater crocodiles.",
    climateTip:
      "Warm and dry. Early morning (5:30 AM) safaris require a light windbreaker; afternoon safaris require sunglasses, dust protection, and broad-spectrum sun care.",
    curatedExperiences: [
      {
        title: "Exclusive Dawn Leopard Tracking Drive",
        description: "Enter Block 1 as the barrier lifts with our expert tracker to read fresh pugmarks on sandy tracks before other jeeps arrive.",
        timeOfDay: "Dawn",
        iconName: "Compass",
      },
      {
        title: "Sundowner Cocktails on Remote Sand Dunes",
        description: "Watch the Indian Ocean surf crash against golden dunes with chilled champagne and artisanal canapés prepared by your private chef.",
        timeOfDay: "Sunset",
        iconName: "Sparkles",
      },
    ],
    signatureLodges: [
      {
        name: "Wild Coast Tented Lodge",
        type: "Relais & Châteaux Luxury Safari Camp",
        highlight: "Cocoon tents mimicking geological boulders scattered between jungle and ocean.",
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    slug: "galle",
    name: "Galle Fort & The South Coast",
    nativeName: "ගාල්ල",
    region: "Southern Province",
    tagline: "UNESCO ramparts, ocean-spray light, gem boutiques & Dutch colonial manors",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ],
    bestTimeToVisit: "November to April (Calm blue waters and balmy evenings)",
    idealStayDays: 3,
    elevation: "Sea level",
    travelTimesFromColombo: "2 hrs via the scenic Southern Expressway",
    circuitSlug: "southern-story",
    circuitTitle: "Southern Story",
    overview:
      "Built by the Portuguese in 1588 and extensively fortified by the Dutch in the 17th century, Galle Fort is an active, vibrant living UNESCO World Heritage monument. Coral-and-granite ramparts hold back crashing seas, enclosing cobbled alleys filled with antique gem traders, private villas, and literary cafés.",
    climateTip:
      "Tropical coastal breezes. Sunset strolls on the Flag Rock bastion provide spectacular ocean panoramas and cool sea winds.",
    curatedExperiences: [
      {
        title: "Historian-Led Private Rampart Walk",
        description: "Unravel tales of spiced fleets, sunken galleons, and colonial sieges as the sun dips beneath the historic Galle Lighthouse.",
        timeOfDay: "Sunset",
        iconName: "Compass",
      },
      {
        title: "Private Cinnamon Island Catamaran Cruise",
        description: "Sail across serene Koggala Lake to a multi-generational cinnamon peeling estate and sample sweet quills straight from tree bark.",
        timeOfDay: "Morning",
        iconName: "Sparkles",
      },
      {
        title: "Artisanal Ceylon Sapphire Gem Consultation",
        description: "Meet a master gemologist inside a 300-year-old Dutch merchant house to examine unheated Padparadscha and cornflower blue sapphires.",
        timeOfDay: "Afternoon",
        iconName: "Sparkles",
      },
    ],
    signatureLodges: [
      {
        name: "Amangalla",
        type: "Aman Heritage Grand Manor",
        highlight: "17th-century Dutch colonial architecture with teak floors, antique chandeliers, and the iconic Zaal ballroom.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];
