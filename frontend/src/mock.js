// Mock data for pets website

export const articles = [
  {
    id: '1',
    title: 'Essential Nutrition Guide for Your Pet',
    category: 'nutrition',
    excerpt: 'Learn about balanced diets, portion control, and nutritional needs for different life stages of your pets.',
    content: 'Proper nutrition is the foundation of your pet\'s health. A balanced diet should include proteins, fats, carbohydrates, vitamins, and minerals...',
    author: 'Dr. Sarah Johnson',
    date: '2025-01-15',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Understanding Pet Behavior: Training Tips',
    category: 'training',
    excerpt: 'Discover effective training techniques and understand the psychology behind your pet\'s behavior.',
    content: 'Training your pet requires patience, consistency, and understanding. Positive reinforcement is the most effective method...',
    author: 'Mark Thompson',
    date: '2025-01-10',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Common Health Issues and Prevention',
    category: 'health',
    excerpt: 'Recognize early signs of health problems and learn preventive care measures to keep your pet healthy.',
    content: 'Regular veterinary check-ups, vaccinations, and preventive care are crucial for your pet\'s wellbeing...',
    author: 'Dr. Emily Chen',
    date: '2025-01-05',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Exercise and Physical Activity for Pets',
    category: 'health',
    excerpt: 'Discover the right amount and type of exercise for different breeds and ages.',
    content: 'Physical activity is essential for maintaining your pet\'s physical and mental health. Different breeds have varying exercise needs...',
    author: 'James Wilson',
    date: '2024-12-28',
    readTime: '5 min read'
  },
  {
    id: '5',
    title: 'Creating a Pet-Friendly Home Environment',
    category: 'care',
    excerpt: 'Tips for making your home safe and comfortable for your furry friends.',
    content: 'A pet-friendly home requires careful consideration of safety, comfort, and stimulation...',
    author: 'Lisa Martinez',
    date: '2024-12-20',
    readTime: '4 min read'
  },
  {
    id: '6',
    title: 'Grooming Essentials: A Complete Guide',
    category: 'care',
    excerpt: 'Master the basics of pet grooming from brushing to nail trimming.',
    content: 'Regular grooming keeps your pet looking good and helps you monitor their health...',
    author: 'Amanda Foster',
    date: '2024-12-15',
    readTime: '6 min read'
  }
];

export const dogBreeds = [
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    species: 'dog',
    size: 'Large',
    weight: '55-75 lbs',
    lifespan: '10-12 years',
    temperament: ['Friendly', 'Intelligent', 'Devoted', 'Trustworthy'],
    origin: 'Scotland',
    history: 'Developed in the Scottish Highlands in the late 1800s by Lord Tweedmouth, Golden Retrievers were bred as gun dogs to retrieve waterfowl during hunting. Their gentle mouth grip made them perfect for this task.',
    careRequirements: {
      exercise: 'High - requires 1-2 hours of daily exercise',
      grooming: 'Moderate - brush 2-3 times per week, more during shedding season',
      training: 'Easy - highly intelligent and eager to please',
      space: 'Needs a yard or regular outdoor access'
    },
    healthInfo: 'Generally healthy but prone to hip dysplasia, elbow dysplasia, and certain heart conditions. Regular vet check-ups and maintaining healthy weight are important.',
    idealFor: 'Families with children, active individuals, first-time dog owners'
  },
  {
    id: 'labrador-retriever',
    name: 'Labrador Retriever',
    species: 'dog',
    size: 'Large',
    weight: '55-80 lbs',
    lifespan: '10-12 years',
    temperament: ['Outgoing', 'Even-tempered', 'Gentle', 'Agile'],
    origin: 'Canada',
    history: 'Originally from Newfoundland, Canada, Labradors were bred to help fishermen retrieve nets and catch fish that escaped. They are excellent swimmers with water-resistant coats.',
    careRequirements: {
      exercise: 'Very High - needs 2+ hours of daily activity',
      grooming: 'Low to Moderate - weekly brushing, more during shedding',
      training: 'Easy - very trainable and food-motivated',
      space: 'Adaptable but needs regular outdoor exercise'
    },
    healthInfo: 'Watch for obesity, hip and elbow dysplasia, and eye conditions. Labs love food, so diet management is crucial.',
    idealFor: 'Active families, service dog work, hunting companions'
  },
  {
    id: 'german-shepherd',
    name: 'German Shepherd',
    species: 'dog',
    size: 'Large',
    weight: '50-90 lbs',
    lifespan: '9-13 years',
    temperament: ['Confident', 'Courageous', 'Smart', 'Loyal'],
    origin: 'Germany',
    history: 'Developed in Germany in the late 1800s for herding sheep. Their intelligence and versatility led to their use in police and military work worldwide.',
    careRequirements: {
      exercise: 'High - needs 1-2 hours daily with mental stimulation',
      grooming: 'Moderate - brush several times weekly, sheds heavily',
      training: 'Moderate - highly intelligent but needs consistent training',
      space: 'Needs space to move, preferably with a yard'
    },
    healthInfo: 'Prone to hip dysplasia, degenerative myelopathy, and bloat. Choose reputable breeders who health test.',
    idealFor: 'Experienced owners, active individuals, working roles'
  },
  {
    id: 'beagle',
    name: 'Beagle',
    species: 'dog',
    size: 'Small to Medium',
    weight: '20-30 lbs',
    lifespan: '12-15 years',
    temperament: ['Friendly', 'Curious', 'Merry', 'Determined'],
    origin: 'England',
    history: 'Beagles have existed for centuries in England, bred for hunting rabbits and hares. Their excellent sense of smell makes them popular for detection work.',
    careRequirements: {
      exercise: 'Moderate to High - 1 hour daily, loves following scents',
      grooming: 'Low - weekly brushing is sufficient',
      training: 'Moderate - can be stubborn, food rewards work well',
      space: 'Adaptable to apartments with adequate exercise'
    },
    healthInfo: 'Generally healthy but watch for obesity, epilepsy, and hypothyroidism. Their love of food requires portion control.',
    idealFor: 'Families, those who enjoy outdoor activities, multi-pet households'
  },
  {
    id: 'bulldog',
    name: 'Bulldog',
    species: 'dog',
    size: 'Medium',
    weight: '40-50 lbs',
    lifespan: '8-10 years',
    temperament: ['Docile', 'Willful', 'Friendly', 'Gregarious'],
    origin: 'England',
    history: 'Originally bred for bull-baiting in England in the 13th century. Modern Bulldogs are much gentler than their ancestors.',
    careRequirements: {
      exercise: 'Low to Moderate - short walks, avoid heat',
      grooming: 'Moderate - daily face fold cleaning, weekly brushing',
      training: 'Moderate - can be stubborn but eager to please',
      space: 'Excellent for apartments, not very active'
    },
    healthInfo: 'Brachycephalic breed with breathing issues. Prone to overheating, hip dysplasia, and skin problems. Requires special care.',
    idealFor: 'Apartment dwellers, less active individuals, companion seekers'
  },
  {
    id: 'poodle',
    name: 'Poodle',
    species: 'dog',
    size: 'Varies (Toy, Miniature, Standard)',
    weight: '6-70 lbs depending on variety',
    lifespan: '12-15 years',
    temperament: ['Intelligent', 'Active', 'Alert', 'Trainable'],
    origin: 'Germany/France',
    history: 'Despite associations with France, Poodles originated in Germany as water retrievers. The elaborate clips were designed to protect joints while swimming.',
    careRequirements: {
      exercise: 'Moderate to High - daily walks and play',
      grooming: 'High - professional grooming every 4-6 weeks',
      training: 'Easy - extremely intelligent and eager to learn',
      space: 'Adaptable to various living situations'
    },
    healthInfo: 'Generally healthy but can develop hip dysplasia, epilepsy, and eye disorders. Toy varieties prone to dental issues.',
    idealFor: 'Allergy sufferers, those seeking intelligent companions, various activity levels'
  },
  {
    id: 'rottweiler',
    name: 'Rottweiler',
    species: 'dog',
    size: 'Large',
    weight: '80-135 lbs',
    lifespan: '8-10 years',
    temperament: ['Loyal', 'Confident', 'Guardian', 'Loving'],
    origin: 'Germany',
    history: 'Descended from Roman drover dogs, Rottweilers were used to herd livestock and pull carts in the town of Rottweil, Germany.',
    careRequirements: {
      exercise: 'High - needs daily vigorous exercise',
      grooming: 'Low - weekly brushing sufficient',
      training: 'Moderate to Difficult - requires experienced, consistent handler',
      space: 'Needs space, best with a yard'
    },
    healthInfo: 'Prone to hip and elbow dysplasia, heart conditions, and certain cancers. Early socialization crucial.',
    idealFor: 'Experienced dog owners, those seeking a guardian, active individuals'
  },
  {
    id: 'yorkshire-terrier',
    name: 'Yorkshire Terrier',
    species: 'dog',
    size: 'Toy',
    weight: '4-7 lbs',
    lifespan: '13-16 years',
    temperament: ['Bold', 'Independent', 'Confident', 'Courageous'],
    origin: 'England',
    history: 'Developed in Yorkshire, England during the 19th century to catch rats in textile mills. Despite small size, they have a big personality.',
    careRequirements: {
      exercise: 'Low to Moderate - short daily walks',
      grooming: 'High - daily brushing, regular professional grooming',
      training: 'Moderate - intelligent but can be stubborn',
      space: 'Perfect for apartments'
    },
    healthInfo: 'Prone to dental issues, patellar luxation, and tracheal collapse. Fragile, requires gentle handling.',
    idealFor: 'Apartment living, seniors, those wanting a portable companion'
  }
];

export const catBreeds = [
  {
    id: 'persian',
    name: 'Persian',
    species: 'cat',
    size: 'Medium to Large',
    weight: '7-12 lbs',
    lifespan: '12-17 years',
    temperament: ['Gentle', 'Quiet', 'Sweet', 'Adaptable'],
    origin: 'Persia (Iran)',
    history: 'One of the oldest cat breeds, Persians have been treasured for their beautiful long coats and calm demeanor since the 1600s.',
    careRequirements: {
      exercise: 'Low - calm and sedentary, enjoys gentle play',
      grooming: 'Very High - daily brushing essential to prevent matting',
      training: 'Easy - gentle and adaptable',
      space: 'Perfect for indoor living, loves comfortable spots'
    },
    healthInfo: 'Flat faces can cause breathing and eye issues. Prone to polycystic kidney disease. Regular vet care and face cleaning needed.',
    idealFor: 'Quiet households, those who enjoy grooming, indoor cat lovers'
  },
  {
    id: 'maine-coon',
    name: 'Maine Coon',
    species: 'cat',
    size: 'Large',
    weight: '10-25 lbs',
    lifespan: '12-15 years',
    temperament: ['Friendly', 'Playful', 'Intelligent', 'Gentle'],
    origin: 'United States',
    history: 'Native to Maine, these "gentle giants" are one of the largest domestic cat breeds. They may have descended from ships\' cats.',
    careRequirements: {
      exercise: 'Moderate - enjoys play and climbing',
      grooming: 'Moderate - brush 2-3 times weekly',
      training: 'Easy - intelligent and can learn tricks',
      space: 'Needs space to explore and climb'
    },
    healthInfo: 'Generally healthy but watch for hip dysplasia, hypertrophic cardiomyopathy, and spinal muscular atrophy.',
    idealFor: 'Families with children, those wanting a dog-like cat, active households'
  },
  {
    id: 'siamese',
    name: 'Siamese',
    species: 'cat',
    size: 'Medium',
    weight: '8-12 lbs',
    lifespan: '15-20 years',
    temperament: ['Vocal', 'Social', 'Intelligent', 'Affectionate'],
    origin: 'Thailand',
    history: 'Ancient breed from Siam (now Thailand), Siamese cats were royal companions and temple guardians. They\'re known for their distinctive coloring and voice.',
    careRequirements: {
      exercise: 'High - very active and playful',
      grooming: 'Low - weekly brushing sufficient',
      training: 'Easy - highly intelligent, enjoys mental stimulation',
      space: 'Adaptable but needs interactive toys'
    },
    healthInfo: 'Generally healthy but can develop dental issues, asthma, and certain genetic conditions. Very social and shouldn\'t be left alone long.',
    idealFor: 'Those home often, interactive pet lovers, experienced cat owners'
  },
  {
    id: 'bengal',
    name: 'Bengal',
    species: 'cat',
    size: 'Medium to Large',
    weight: '8-15 lbs',
    lifespan: '12-16 years',
    temperament: ['Active', 'Playful', 'Intelligent', 'Athletic'],
    origin: 'United States',
    history: 'Created by crossing domestic cats with Asian leopard cats in the 1970s. Bengals have wild-looking spotted or marbled coats.',
    careRequirements: {
      exercise: 'Very High - extremely active, needs daily play',
      grooming: 'Low - weekly brushing',
      training: 'Moderate - intelligent but independent',
      space: 'Needs vertical space, climbing structures'
    },
    healthInfo: 'Generally healthy but can inherit progressive retinal atrophy and hypertrophic cardiomyopathy. High energy requires outlets.',
    idealFor: 'Active households, experienced cat owners, those seeking interactive pets'
  },
  {
    id: 'ragdoll',
    name: 'Ragdoll',
    species: 'cat',
    size: 'Large',
    weight: '10-20 lbs',
    lifespan: '13-18 years',
    temperament: ['Docile', 'Affectionate', 'Calm', 'Gentle'],
    origin: 'United States',
    history: 'Developed in California in the 1960s, Ragdolls are named for their tendency to go limp when picked up. They have striking blue eyes.',
    careRequirements: {
      exercise: 'Low to Moderate - calm but enjoys gentle play',
      grooming: 'Moderate - brush 2-3 times weekly',
      training: 'Easy - docile and eager to please',
      space: 'Indoor only, adaptable to smaller spaces'
    },
    healthInfo: 'Can develop hypertrophic cardiomyopathy and kidney issues. Very trusting, must be kept indoors for safety.',
    idealFor: 'Families with children, first-time cat owners, those seeking affectionate companions'
  },
  {
    id: 'british-shorthair',
    name: 'British Shorthair',
    species: 'cat',
    size: 'Medium to Large',
    weight: '9-18 lbs',
    lifespan: '12-17 years',
    temperament: ['Calm', 'Easygoing', 'Independent', 'Loyal'],
    origin: 'United Kingdom',
    history: 'One of Britain\'s oldest breeds, descended from cats brought by Romans. The famous "Cheshire Cat" was likely based on this breed.',
    careRequirements: {
      exercise: 'Low to Moderate - not overly active',
      grooming: 'Low - weekly brushing',
      training: 'Easy - calm and adaptable',
      space: 'Adaptable to various living situations'
    },
    healthInfo: 'Watch for obesity, hypertrophic cardiomyopathy, and dental issues. Calm nature means monitoring activity and weight.',
    idealFor: 'Working professionals, quieter households, first-time cat owners'
  },
  {
    id: 'abyssinian',
    name: 'Abyssinian',
    species: 'cat',
    size: 'Medium',
    weight: '8-12 lbs',
    lifespan: '12-15 years',
    temperament: ['Active', 'Playful', 'Curious', 'Social'],
    origin: 'Ethiopia (disputed)',
    history: 'One of the oldest known breeds, possibly descended from ancient Egyptian cats. Their ticked coat gives them a wild appearance.',
    careRequirements: {
      exercise: 'High - very active and curious',
      grooming: 'Low - weekly brushing',
      training: 'Moderate - intelligent but independent',
      space: 'Needs vertical space and stimulation'
    },
    healthInfo: 'Generally healthy but can develop progressive retinal atrophy, patellar luxation, and periodontal disease.',
    idealFor: 'Active households, experienced cat owners, those wanting interactive pets'
  },
  {
    id: 'scottish-fold',
    name: 'Scottish Fold',
    species: 'cat',
    size: 'Medium',
    weight: '6-13 lbs',
    lifespan: '11-14 years',
    temperament: ['Sweet', 'Calm', 'Adaptable', 'Affectionate'],
    origin: 'Scotland',
    history: 'Discovered in Scotland in 1961, Scottish Folds are known for their distinctive folded ears caused by a genetic mutation.',
    careRequirements: {
      exercise: 'Moderate - enjoys play but not hyperactive',
      grooming: 'Low to Moderate - depends on coat length',
      training: 'Easy - adaptable and gentle',
      space: 'Adaptable to apartments and houses'
    },
    healthInfo: 'The gene for folded ears can cause joint issues. Choose breeders carefully. Regular vet checks for arthritis symptoms.',
    idealFor: 'Families, apartment dwellers, those seeking gentle companions'
  }
];

export const allBreeds = [...dogBreeds, ...catBreeds];

export const categories = ['all', 'nutrition', 'training', 'health', 'care'];
