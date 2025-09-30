// Brand-specific mock data for demonstrating customization
// Each brand has industry-relevant content instead of generic Storyblok content

interface BrandSearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'documentation' | 'tutorial' | 'guide';
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  relevanceScore: number;
}

// Healthcare Brand Mock Data
export const healthTechMockData: BrandSearchResult[] = [
  {
    id: 'ht-1',
    title: 'Managing Type 2 Diabetes: Clinical Guidelines',
    content: 'Comprehensive evidence-based guidelines for managing Type 2 Diabetes, including medication protocols, lifestyle interventions, and patient monitoring strategies. Updated with latest ADA recommendations for optimal glycemic control and complication prevention.',
    type: 'guide',
    url: '/clinical-guides/diabetes-management',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
    tags: ['diabetes', 'clinical-guidelines', 'chronic-disease', 'medication', 'patient-care'],
    createdAt: '2024-03-15',
    relevanceScore: 0.95
  },
  {
    id: 'ht-2',
    title: 'Cardiovascular Risk Assessment Protocols',
    content: 'Step-by-step protocols for assessing cardiovascular risk in primary care settings. Includes ASCVD risk calculator usage, lipid management guidelines, and hypertension treatment algorithms aligned with ACC/AHA standards.',
    type: 'documentation',
    url: '/docs/cardiovascular-assessment',
    thumbnail: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=200&fit=crop',
    tags: ['cardiology', 'risk-assessment', 'prevention', 'hypertension', 'protocols'],
    createdAt: '2024-03-10',
    relevanceScore: 0.92
  },
  {
    id: 'ht-3',
    title: 'Patient Education: Understanding Chronic Kidney Disease',
    content: 'Easy-to-understand patient education materials about chronic kidney disease (CKD). Covers stages of CKD, dietary recommendations, medication adherence, and when to see a nephrologist. Written at 8th-grade reading level.',
    type: 'article',
    url: '/patient-education/chronic-kidney-disease',
    thumbnail: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&h=200&fit=crop',
    tags: ['patient-education', 'ckd', 'nephrology', 'diet', 'self-care'],
    createdAt: '2024-03-12',
    relevanceScore: 0.88
  },
  {
    id: 'ht-4',
    title: 'HIPAA Compliance: Electronic Health Records Best Practices',
    content: 'Complete guide to maintaining HIPAA compliance when managing electronic health records. Covers encryption requirements, access controls, audit logging, breach notification procedures, and staff training protocols.',
    type: 'guide',
    url: '/compliance/hipaa-ehr-best-practices',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop',
    tags: ['hipaa', 'compliance', 'ehr', 'security', 'privacy', 'regulations'],
    createdAt: '2024-03-08',
    relevanceScore: 0.90
  },
  {
    id: 'ht-5',
    title: 'COVID-19 Treatment Protocol Updates',
    content: 'Latest updates to COVID-19 treatment protocols including antiviral medications, monoclonal antibodies, and supportive care strategies. Includes variant-specific considerations and immunocompromised patient management.',
    type: 'documentation',
    url: '/docs/covid-treatment-protocols',
    thumbnail: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=200&fit=crop',
    tags: ['covid-19', 'infectious-disease', 'treatment', 'protocols', 'urgent'],
    createdAt: '2024-03-18',
    relevanceScore: 0.94
  }
];

// Education Brand Mock Data
export const eduLearnMockData: BrandSearchResult[] = [
  {
    id: 'edu-1',
    title: 'Python Programming for Absolute Beginners',
    content: 'Start your coding journey with Python! This beginner-friendly course covers variables, data types, loops, functions, and basic problem-solving. Includes 50+ interactive exercises and real-world projects. No prior experience needed!',
    type: 'tutorial',
    url: '/courses/python-beginners',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop',
    tags: ['python', 'programming', 'beginner', 'coding', 'interactive'],
    createdAt: '2024-03-01',
    relevanceScore: 0.96
  },
  {
    id: 'edu-2',
    title: 'Data Structures & Algorithms Masterclass',
    content: 'Master essential data structures and algorithms with visual explanations and hands-on coding challenges. Covers arrays, linked lists, trees, graphs, sorting algorithms, and dynamic programming. Perfect for technical interviews!',
    type: 'guide',
    url: '/courses/data-structures-algorithms',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop',
    tags: ['algorithms', 'data-structures', 'intermediate', 'computer-science', 'interview-prep'],
    createdAt: '2024-02-28',
    relevanceScore: 0.91
  },
  {
    id: 'edu-3',
    title: 'Web Development Bootcamp: HTML, CSS, JavaScript',
    content: 'Build beautiful, responsive websites from scratch! Learn HTML5, CSS3, Flexbox, Grid, JavaScript ES6+, and modern web design principles. Includes 10 real-world projects you can add to your portfolio.',
    type: 'tutorial',
    url: '/courses/web-development-bootcamp',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop',
    tags: ['web-development', 'html', 'css', 'javascript', 'beginner', 'projects'],
    createdAt: '2024-03-05',
    relevanceScore: 0.93
  },
  {
    id: 'edu-4',
    title: 'Machine Learning Fundamentals with Python',
    content: 'Introduction to machine learning concepts using Python and scikit-learn. Covers supervised learning, unsupervised learning, model evaluation, and practical ML projects. Perfect for transitioning from programming to AI!',
    type: 'guide',
    url: '/courses/machine-learning-fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=200&fit=crop',
    tags: ['machine-learning', 'ai', 'python', 'advanced', 'data-science'],
    createdAt: '2024-03-10',
    relevanceScore: 0.89
  },
  {
    id: 'edu-5',
    title: 'Study Skills: Effective Note-Taking Strategies',
    content: 'Transform your learning with proven note-taking methods! Learn Cornell Notes, Mind Mapping, the Feynman Technique, and digital note-taking tools. Boost retention and ace your exams with these scientifically-backed strategies.',
    type: 'article',
    url: '/study-skills/note-taking-strategies',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop',
    tags: ['study-skills', 'note-taking', 'learning', 'productivity', 'beginner'],
    createdAt: '2024-03-12',
    relevanceScore: 0.85
  }
];

// Fashion Brand Mock Data
export const fashionForwardMockData: BrandSearchResult[] = [
  {
    id: 'ff-1',
    title: 'Spring 2024 Collection: Floral Renaissance',
    content: 'Discover our enchanting Spring 2024 collection featuring romantic florals, ethereal silhouettes, and sustainable fabrics. From garden party dresses to office-ready blazers, embrace the season of renewal with timeless elegance.',
    type: 'article',
    url: '/collections/spring-2024-floral-renaissance',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=200&fit=crop',
    tags: ['spring-collection', 'floral', 'new-arrivals', 'dresses', 'sustainable'],
    createdAt: '2024-03-15',
    relevanceScore: 0.97
  },
  {
    id: 'ff-2',
    title: 'Styling Guide: Casual Chic for Weekend Brunch',
    content: 'Master the art of effortless elegance with our weekend styling guide. Discover how to pair relaxed denim with statement accessories, choose the perfect brunch outfit, and transition from day to evening with simple swaps.',
    type: 'guide',
    url: '/style-guides/casual-chic-weekend',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop',
    tags: ['styling', 'casual', 'weekend', 'brunch', 'outfit-ideas'],
    createdAt: '2024-03-10',
    relevanceScore: 0.93
  },
  {
    id: 'ff-3',
    title: 'Summer Wedding Guest: The Ultimate Lookbook',
    content: 'Be the best-dressed guest at every summer celebration! Explore 20+ curated looks for garden weddings, beach ceremonies, and formal receptions. Includes dress codes decoded, accessory pairings, and seasonal color palettes.',
    type: 'guide',
    url: '/lookbooks/summer-wedding-guest',
    thumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=200&fit=crop',
    tags: ['wedding-guest', 'summer', 'formal', 'dresses', 'occasion-wear'],
    createdAt: '2024-03-12',
    relevanceScore: 0.95
  },
  {
    id: 'ff-4',
    title: 'Sustainable Fashion: Our Eco-Conscious Commitment',
    content: 'Explore our journey towards sustainable fashion. Learn about our eco-friendly materials, ethical manufacturing practices, circular fashion initiatives, and how you can build a more sustainable wardrobe without compromising style.',
    type: 'article',
    url: '/sustainability/eco-conscious-fashion',
    thumbnail: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&h=200&fit=crop',
    tags: ['sustainability', 'eco-friendly', 'ethical-fashion', 'conscious', 'environment'],
    createdAt: '2024-03-08',
    relevanceScore: 0.88
  },
  {
    id: 'ff-5',
    title: 'Capsule Wardrobe Essentials: 15 Pieces, Endless Outfits',
    content: 'Build a versatile capsule wardrobe with our curated essentials. Quality over quantity! Discover timeless pieces that mix, match, and transcend seasons. Includes styling formulas and shopping recommendations.',
    type: 'guide',
    url: '/style-guides/capsule-wardrobe-essentials',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=200&fit=crop',
    tags: ['capsule-wardrobe', 'essentials', 'minimalist', 'styling', 'wardrobe-basics'],
    createdAt: '2024-03-05',
    relevanceScore: 0.90
  }
];

// Finance Brand Mock Data
export const financeFlowMockData: BrandSearchResult[] = [
  {
    id: 'fin-1',
    title: '2024 Tax Planning Strategies for High-Income Earners',
    content: 'Comprehensive tax planning guide for individuals earning $250K+. Covers tax-loss harvesting, retirement account optimization, charitable giving strategies, and state tax considerations. Updated with 2024 tax law changes.',
    type: 'guide',
    url: '/tax-planning/high-income-strategies-2024',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
    tags: ['tax-planning', 'high-income', 'strategies', '2024', 'optimization'],
    createdAt: '2024-03-18',
    relevanceScore: 0.96
  },
  {
    id: 'fin-2',
    title: 'Understanding 401(k) Contribution Limits and Strategies',
    content: 'Complete guide to 401(k) retirement savings. Learn about contribution limits, employer matching, Roth vs Traditional options, catch-up contributions, and rollover strategies. Includes 2024 IRS limits and calculator tools.',
    type: 'documentation',
    url: '/retirement/401k-contribution-guide',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop',
    tags: ['401k', 'retirement', 'contribution-limits', 'irs', 'planning'],
    createdAt: '2024-03-15',
    relevanceScore: 0.95
  },
  {
    id: 'fin-3',
    title: 'Market Analysis: Q1 2024 Economic Outlook',
    content: 'In-depth analysis of Q1 2024 market trends, Federal Reserve policy impacts, inflation indicators, and sector performance. Includes investment implications and risk assessment for various asset classes.',
    type: 'article',
    url: '/market-analysis/q1-2024-economic-outlook',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
    tags: ['market-analysis', 'economy', 'q1-2024', 'investment', 'trends'],
    createdAt: '2024-03-20',
    relevanceScore: 0.93
  },
  {
    id: 'fin-4',
    title: 'Estate Planning Essentials: Wills, Trusts, and Beyond',
    content: 'Protect your legacy with proper estate planning. Understand the differences between wills and trusts, learn about power of attorney, healthcare directives, beneficiary designations, and strategies to minimize estate taxes.',
    type: 'guide',
    url: '/estate-planning/wills-trusts-essentials',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop',
    tags: ['estate-planning', 'wills', 'trusts', 'legacy', 'legal'],
    createdAt: '2024-03-10',
    relevanceScore: 0.89
  },
  {
    id: 'fin-5',
    title: 'Investment Portfolio Diversification Strategies',
    content: 'Build a resilient investment portfolio through strategic diversification. Learn about asset allocation, risk management, international exposure, alternative investments, and rebalancing strategies for long-term wealth growth.',
    type: 'guide',
    url: '/investing/portfolio-diversification-strategies',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop',
    tags: ['investing', 'diversification', 'portfolio', 'risk-management', 'wealth'],
    createdAt: '2024-03-12',
    relevanceScore: 0.91
  }
];

// Gaming Brand Mock Data
export const gamersHubMockData: BrandSearchResult[] = [
  {
    id: 'game-1',
    title: 'Elden Ring: Best Beginner Builds for New Players',
    content: 'Start your Tarnished journey right! Comprehensive guide to the most forgiving beginner builds including the Vagabond Tank, Magic Knight, and Quality Dex builds. Includes stat allocation, weapon recommendations, and boss strategies.',
    type: 'guide',
    url: '/guides/elden-ring-beginner-builds',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop',
    tags: ['elden-ring', 'builds', 'beginner', 'rpg', 'souls-like'],
    createdAt: '2024-03-18',
    relevanceScore: 0.97
  },
  {
    id: 'game-2',
    title: 'Valorant Agent Tier List: Episode 8 Meta Update',
    content: 'Complete agent tier list for Valorant Episode 8! Analyzes pick rates, win rates, and pro play meta. Covers all agents from S to C tier with detailed explanations for each rank and map-specific recommendations.',
    type: 'article',
    url: '/tier-lists/valorant-episode-8-agents',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
    tags: ['valorant', 'tier-list', 'agents', 'competitive', 'fps'],
    createdAt: '2024-03-20',
    relevanceScore: 0.95
  },
  {
    id: 'game-3',
    title: 'Minecraft Redstone Engineering: From Basics to Farms',
    content: 'Master Minecraft redstone mechanics! Learn circuits, logic gates, and automation. Build automatic farms, hidden doors, and complex contraptions. Includes video tutorials and world downloads for practice.',
    type: 'tutorial',
    url: '/tutorials/minecraft-redstone-engineering',
    thumbnail: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&h=200&fit=crop',
    tags: ['minecraft', 'redstone', 'automation', 'tutorial', 'engineering'],
    createdAt: '2024-03-15',
    relevanceScore: 0.92
  },
  {
    id: 'game-4',
    title: 'League of Legends: Season 14 Jungle Guide',
    content: 'Dominate the jungle in Season 14! Complete guide covering pathing, ganking, objective control, champion pool recommendations, and meta shifts. Includes VOD reviews from challenger junglers and matchup guides.',
    type: 'guide',
    url: '/guides/league-season-14-jungle',
    thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=200&fit=crop',
    tags: ['league-of-legends', 'jungle', 'season-14', 'moba', 'competitive'],
    createdAt: '2024-03-17',
    relevanceScore: 0.94
  },
  {
    id: 'game-5',
    title: 'Speedrunning Techniques: Breaking World Records',
    content: 'Enter the world of speedrunning! Learn frame-perfect inputs, glitch exploitation, routing optimization, and mental preparation. Features interviews with record holders and game-specific strategy breakdowns.',
    type: 'article',
    url: '/features/speedrunning-techniques-guide',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
    tags: ['speedrunning', 'techniques', 'world-records', 'competitive', 'strategy'],
    createdAt: '2024-03-12',
    relevanceScore: 0.88
  }
];

// Brand data mapper
export const brandMockDataMap = {
  'healthtech': healthTechMockData,
  'edulearn': eduLearnMockData,
  'fashionforward': fashionForwardMockData,
  'financeflow': financeFlowMockData,
  'gamershub': gamersHubMockData,
  'default': [] // Will use original Storyblok data
};

// Export type for consistency
export type BrandKey = keyof typeof brandMockDataMap;

