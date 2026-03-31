export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountDetails?: number; // percentage
    rating: number;
    image: string;
    images?: string[]; // For carousel support
    category: string;
}


export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Experience world-class noise cancellation with these premium wireless headphones. Perfect for travel or work.',
        price: 299.99,
        discountDetails: 10,
        rating: 4.8,
        image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/9/e/4/-original-imahhtr3zyy6arhg.jpeg?q=70&crop=false',
        images: [
            'https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/9/e/4/-original-imahhtr3zyy6arhg.jpeg?q=70&crop=false',
            'https://placehold.co/400x400?text=Side+View',
            'https://placehold.co/400x400?text=Back+View',
            'https://placehold.co/400x400?text=In+Use'
        ],
        category: 'Electronics'
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with this advanced smartwatch. Features heart rate monitoring and GPS.',
        price: 199.50,
        rating: 4.5,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/e/o/m/-original-imahghmjmftemu54.jpeg?q=70',
        category: 'Electronics'
    },
    {
        id: '3',
        name: 'Premium Leather Backpack',
        description: 'Handcrafted from genuine leather, this backpack offers style and durability for your daily commute.',
        price: 149.00,
        rating: 4.7,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/t/x/8/-original-imahfskbyhmzu4hk.jpeg?q=70',
        category: 'Bags'
    },
    {
        id: '4',
        name: 'Ergonomic Office Chair',
        description: 'Designed for comfort and support, this ergonomic chair improves posture and productivity.',
        price: 350.00,
        discountDetails: 15,
        rating: 4.6,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/office-study-chair/i/o/a/pp-polypropylene-dgc301-drogo-original-imah93czj5hgdhvs.jpeg?q=70',
        category: 'Home & Office'
    },
    {
        id: '5',
        name: 'Minimalist Desk Lamp',
        description: 'Sleek and modern desk lamp with adjustable brightness and color temperature.',
        price: 45.00,
        rating: 4.3,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/table-lamp/d/7/l/3-colour-mode-led-table-desk-tl008-rudefox-35-original-imahgmprgrddxhk5.jpeg?q=70',
        category: 'Home & Office'
    },
    {
        id: '6',
        name: 'Mechanical Keyboard',
        description: 'High-performance mechanical keyboard with RGB backlighting and customizable switches.',
        price: 120.00,
        rating: 4.9,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/keyboard/gaming-keyboard/c/g/x/k1-mechanical-gaming-keyboard-with-blue-switches-20-rgb-original-imagxqkqyxxgbbtt.jpeg?q=70',
        category: 'Electronics'
    },
    {
        id: '7',
        name: 'Cotton T-Shirt',
        description: 'Soft and breathable cotton t-shirt available in various colors. A wardrobe essential.',
        price: 25.00,
        rating: 4.2,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/s/c/3/l-polo-8061-kajaru-original-imahhcxf9muvgpmf.jpeg?q=70',
        category: 'Fashion'
    },
    {
        id: '8',
        name: 'Running Shoes',
        description: 'Lightweight and durable running shoes designed for speed and comfort.',
        price: 89.99,
        discountDetails: 5,
        rating: 4.6,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/9/t/t/8-kia-602-8-action-mint-pista-original-imahgnjvxeyzhfhh.jpeg?q=70',
        category: 'Fashion'
    },

    // 🐶 Pet Food
    {
        id: '9',
        name: 'Premium Dog Food',
        description: 'Nutritious dry dog food enriched with vitamins and minerals for healthy growth.',
        price: 59.99,
        rating: 4.5,
        image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/pet-food/r/f/3/-original-imagpehy3zr8unu3.jpeg?q=70',
        category: 'Pet Food'
    },

    // 👗 Fashion
    {
        id: '10',
        name: 'Denim Jacket',
        description: 'Classic denim jacket with a modern fit. Perfect for casual outings.',
        price: 79.99,
        rating: 4.4,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/jacket/a/o/k/s-1-no-udjck1442-u-s-polo-assn-denim-co-original-imagvakj8jz9qa74.jpeg?q=70',
        category: 'Fashion'
    },

    // 💇 Hair
    {
        id: '11',
        name: 'Hair Dryer',
        description: 'Professional hair dryer with heat control and ionic technology.',
        price: 65.00,
        discountDetails: 10,
        rating: 4.3,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/hair-dryer/z/q/c/-original-imahe24x3hzwdzhk.jpeg?q=70',
        category: 'Hair'
    },

    // 💍 Jewellery
    {
        id: '12',
        name: 'Gold Plated Necklace',
        description: 'Elegant gold plated necklace suitable for both casual and formal occasions.',
        price: 129.99,
        rating: 4.7,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/pendant-locket/p/r/b/na-na-heart-locket-chain-lady-raiment-original-imahgxpbe5ymd3yd.jpeg?q=70',
        category: 'Jewellery'
    },

    // 👜 Bags
    {
        id: '13',
        name: 'Stylish Handbag',
        description: 'Spacious and stylish handbag made with premium materials.',
        price: 99.00,
        rating: 4.6,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/hand-messenger-bag/d/h/d/hand-bags-9-5-ns-shoulder-bag-non-braned-25-original-imahgw8grzp63jyt.jpeg?q=70',
        category: 'Bags'
    },

    // 💎 Earrings
    {
        id: '14',
        name: 'Silver Stud Earrings',
        description: 'Minimalist silver stud earrings with a timeless design.',
        price: 39.99,
        rating: 4.8,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/earring/k/u/x/na-100-shreeji-original-imahg9pj2dfqqfgf.jpeg?q=70',
        category: 'Earrings'
    },
    // --- ELECTRONICS ---
    {
        id: 'e1',
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Experience world-class noise cancellation with these premium wireless headphones. Perfect for travel or work.',
        price: 299.99,
        discountDetails: 10,
        rating: 4.8,
        image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/9/e/4/-original-imahhtr3zyy6arhg.jpeg',
        category: 'Electronics'
    },
    {
        id: 'e2',
        name: 'Smart 4K Ultra HD Projector',
        description: 'Turn your living room into a cinema with stunning 4K resolution and built-in streaming apps.',
        price: 499.00,
        discountDetails: 15,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=4K+Projector',
        category: 'Electronics'
    },
    {
        id: 'e3',
        name: 'Mechanical Backlit Keyboard',
        description: 'Tactile switches and customizable RGB lighting for the ultimate gaming or typing experience.',
        price: 89.99,
        discountDetails: 5,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Keyboard',
        category: 'Electronics'
    },
    {
        id: 'e4',
        name: 'Portable Power Bank 20000mAh',
        description: 'High-capacity external battery with fast charging ports for smartphones and tablets.',
        price: 45.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Power+Bank',
        category: 'Electronics'
    },
    {
        id: 'e5',
        name: 'Noise-Isolating In-Ear Monitors',
        description: 'Professional-grade audio quality with a secure fit for musicians and audiophiles.',
        price: 120.00,
        discountDetails: 20,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=In-Ear+Monitors',
        category: 'Electronics'
    },
    {
        id: 'e6',
        name: 'Smartwatch with Heart Rate Monitor',
        description: 'Track your fitness, sleep, and notifications with this sleek, waterproof smartwatch.',
        price: 199.00,
        discountDetails: 12,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Smartwatch',
        category: 'Electronics'
    },
    {
        id: 'e7',
        name: 'High-Speed External SSD 1TB',
        description: 'Ultra-fast data transfer speeds in a compact, shock-resistant portable drive.',
        price: 110.00,
        discountDetails: 8,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=SSD+Drive',
        category: 'Electronics'
    },
    {
        id: 'e8',
        name: 'Ergonomic Wireless Mouse',
        description: 'Designed to reduce wrist strain during long hours of office work or browsing.',
        price: 55.00,
        discountDetails: 0,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Wireless+Mouse',
        category: 'Electronics'
    },
    {
        id: 'e9',
        name: 'Compact Bluetooth Speaker',
        description: 'Powerful sound in a pocket-sized design. Waterproof and perfect for outdoor use.',
        price: 39.99,
        discountDetails: 10,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=BT+Speaker',
        category: 'Electronics'
    },
    {
        id: 'e10',
        name: 'Dual-Lens Dash Camera',
        description: 'Record front and interior views in 1080p for maximum safety and security while driving.',
        price: 135.00,
        discountDetails: 15,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Dash+Cam',
        category: 'Electronics'
    },

    // --- BAGS ---
    {
        id: 'b11',
        name: 'Leather Commuter Backpack',
        description: 'Handcrafted genuine leather backpack with a padded sleeve for 15-inch laptops.',
        price: 120.00,
        discountDetails: 10,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Leather+Backpack',
        category: 'Bags'
    },
    {
        id: 'b12',
        name: 'Waterproof Canvas Duffel',
        description: 'Spacious and durable bag for weekend getaways or gym sessions.',
        price: 65.00,
        discountDetails: 5,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Duffel+Bag',
        category: 'Bags'
    },
    {
        id: 'b13',
        name: 'Slim Anti-Theft Laptop Bag',
        description: 'Hidden zippers and RFID protection to keep your electronics and data safe.',
        price: 75.00,
        discountDetails: 20,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Laptop+Bag',
        category: 'Bags'
    },
    {
        id: 'b14',
        name: 'Vintage Crossbody Satchel',
        description: 'A timeless classic made from distressed leather for a stylish everyday look.',
        price: 50.00,
        discountDetails: 0,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Satchel',
        category: 'Bags'
    },
    {
        id: 'b15',
        name: 'Hard-Shell Carry-On Luggage',
        description: 'Lightweight polycarbonate shell with 360-degree spinner wheels for easy travel.',
        price: 160.00,
        discountDetails: 15,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Suitcase',
        category: 'Bags'
    },
    {
        id: 'b16',
        name: 'Foldable Gym String Bag',
        description: 'Convenient and ultra-lightweight bag for carrying your workout essentials.',
        price: 15.00,
        discountDetails: 0,
        rating: 4.2,
        image: 'https://placehold.co/400x400?text=String+Bag',
        category: 'Bags'
    },
    {
        id: 'b17',
        name: 'Luxury Suede Tote Bag',
        description: 'Sophisticated design with a soft suede finish, ideal for shopping or work.',
        price: 110.00,
        discountDetails: 10,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Tote+Bag',
        category: 'Bags'
    },
    {
        id: 'b18',
        name: 'Professional Leather Briefcase',
        description: 'Polished look for the modern professional with organized internal pockets.',
        price: 185.00,
        discountDetails: 12,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Briefcase',
        category: 'Bags'
    },
    {
        id: 'b19',
        name: 'Ultralight Hiking Pack',
        description: 'Ergonomic design with breathable mesh straps for long-distance comfort.',
        price: 95.00,
        discountDetails: 5,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Hiking+Pack',
        category: 'Bags'
    },
    {
        id: 'b20',
        name: 'Designer Clutch Purse',
        description: 'Elegant evening clutch with a detachable chain strap for versatile styling.',
        price: 85.00,
        discountDetails: 25,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=Clutch',
        category: 'Bags'
    },

    // --- HOME & OFFICE ---
    {
        id: 'h21',
        name: 'Ergonomic Mesh Office Chair',
        description: 'Breathable mesh back and adjustable lumbar support for all-day comfort.',
        price: 210.00,
        discountDetails: 15,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Office+Chair',
        category: 'Home & Office'
    },
    {
        id: 'h22',
        name: 'Smart LED Desk Lamp',
        description: 'Adjustable brightness and color temperature with a built-in USB charging port.',
        price: 45.00,
        discountDetails: 0,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Desk+Lamp',
        category: 'Home & Office'
    },
    {
        id: 'h23',
        name: 'Bamboo Standing Desk Converter',
        description: 'Easily switch between sitting and standing with this eco-friendly desk riser.',
        price: 150.00,
        discountDetails: 10,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Desk+Converter',
        category: 'Home & Office'
    },
    {
        id: 'h24',
        name: 'Air Purifying Indoor Planter',
        description: 'Self-watering planter designed to house air-purifying plants for a cleaner office.',
        price: 35.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Planter',
        category: 'Home & Office'
    },
    {
        id: 'h25',
        name: 'Essential Oil Diffuser',
        description: 'Ultrasonic cool mist diffuser to create a relaxing atmosphere in your workspace.',
        price: 29.99,
        discountDetails: 5,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Diffuser',
        category: 'Home & Office'
    },
    {
        id: 'h26',
        name: 'Noise-Cancelling Desk Divider',
        description: 'Acoustic felt panel that reduces ambient noise and provides privacy.',
        price: 60.00,
        discountDetails: 0,
        rating: 4.2,
        image: 'https://placehold.co/400x400?text=Desk+Divider',
        category: 'Home & Office'
    },
    {
        id: 'h27',
        name: 'Magnetic Whiteboard Planner',
        description: 'Keep track of your weekly tasks and deadlines with this sleek wall-mounted board.',
        price: 25.00,
        discountDetails: 10,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Whiteboard',
        category: 'Home & Office'
    },
    {
        id: 'h28',
        name: 'Memory Foam Seat Cushion',
        description: 'Orthopedic design helps relieve tailbone pressure and improves posture.',
        price: 40.00,
        discountDetails: 0,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Cushion',
        category: 'Home & Office'
    },
    {
        id: 'h29',
        name: 'Electric Adjustable Footrest',
        description: 'Massage-textured surface with height adjustment for better leg circulation.',
        price: 55.00,
        discountDetails: 8,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=Footrest',
        category: 'Home & Office'
    },
    {
        id: 'h30',
        name: 'Coffee Pod Organizer Drawer',
        description: 'Space-saving storage drawer that sits directly under your coffee machine.',
        price: 32.00,
        discountDetails: 0,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Coffee+Organizer',
        category: 'Home & Office'
    },

    // --- FASHION ---
    {
        id: 'f31',
        name: 'Classic Denim Trucker Jacket',
        description: 'A versatile staple made from high-quality rigid denim. Gets better with age.',
        price: 75.00,
        discountDetails: 15,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Denim+Jacket',
        category: 'Fashion'
    },
    {
        id: 'f32',
        name: 'Organic Cotton Crewneck Tee',
        description: 'Soft, breathable, and sustainably sourced. Available in multiple colors.',
        price: 25.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Cotton+Tee',
        category: 'Fashion'
    },
    {
        id: 'f33',
        name: 'Slim Fit Chino Trousers',
        description: 'Stretch cotton chinos that offer a polished look without sacrificing comfort.',
        price: 55.00,
        discountDetails: 10,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Chinos',
        category: 'Fashion'
    },
    {
        id: 'f34',
        name: 'Lightweight Puffer Vest',
        description: 'Water-resistant outer shell with synthetic down fill for seasonal layering.',
        price: 85.00,
        discountDetails: 20,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Puffer+Vest',
        category: 'Fashion'
    },
    {
        id: 'f35',
        name: 'Merino Wool Turtleneck',
        description: 'Fine-knit sweater that provides exceptional warmth and a sleek silhouette.',
        price: 95.00,
        discountDetails: 5,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Wool+Sweater',
        category: 'Fashion'
    },
    {
        id: 'f36',
        name: 'Water-Resistant Trench Coat',
        description: 'Classic double-breasted design with a removable belt for a tailored fit.',
        price: 140.00,
        discountDetails: 12,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Trench+Coat',
        category: 'Fashion'
    },
    {
        id: 'f37',
        name: 'Athletic Compression Leggings',
        description: 'High-waisted leggings with moisture-wicking technology for intense workouts.',
        price: 45.00,
        discountDetails: 0,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Leggings',
        category: 'Fashion'
    },
    {
        id: 'f38',
        name: 'Linen Summer Button-Down',
        description: 'Cool and airy shirt perfect for beach days or casual outdoor events.',
        price: 50.00,
        discountDetails: 10,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Linen+Shirt',
        category: 'Fashion'
    },
    {
        id: 'f39',
        name: 'High-Waist Pleated Skirt',
        description: 'Elegant midi-length skirt with a flattering silhouette and smooth finish.',
        price: 60.00,
        discountDetails: 15,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=Pleated+Skirt',
        category: 'Fashion'
    },
    {
        id: 'f40',
        name: 'Reversible Leather Belt',
        description: 'Two-in-one belt with a rotating buckle, featuring black and brown leather sides.',
        price: 35.00,
        discountDetails: 0,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Leather+Belt',
        category: 'Fashion'
    },

    // --- PET FOOD ---
    {
        id: 'p41',
        name: 'Grain-Free Salmon Dog Food',
        description: 'Premium kibble rich in Omega-3 fatty acids for a healthy coat and joints.',
        price: 65.00,
        discountDetails: 10,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Dog+Food',
        category: 'Pet Food'
    },
    {
        id: 'p42',
        name: 'High-Protein Chicken Cat Kibble',
        description: 'Balanced nutrition specifically formulated for active adult indoor cats.',
        price: 45.00,
        discountDetails: 5,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Cat+Food',
        category: 'Pet Food'
    },
    {
        id: 'p43',
        name: 'Organic Freeze-Dried Beef Treats',
        description: 'Single-ingredient treats with no additives, perfect for training.',
        price: 18.00,
        discountDetails: 0,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Beef+Treats',
        category: 'Pet Food'
    },
    {
        id: 'p44',
        name: 'Senior Formula Wet Dog Food',
        description: 'Easy-to-digest canned food with added glucosamine for older dogs.',
        price: 35.00,
        discountDetails: 12,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Wet+Dog+Food',
        category: 'Pet Food'
    },
    {
        id: 'p45',
        name: 'Indoor Hairball Control Cat Food',
        description: 'Special fiber blend to help minimize hairball formation in long-haired cats.',
        price: 42.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Hairball+Control',
        category: 'Pet Food'
    },
    {
        id: 'p46',
        name: 'Puppy Growth Support Formula',
        description: 'DHA-enriched kibble to support brain development and healthy growth.',
        price: 50.00,
        discountDetails: 8,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Puppy+Food',
        category: 'Pet Food'
    },
    {
        id: 'p47',
        name: 'Wild-Caught Tuna Cat Treats',
        description: 'Savory tuna flakes that even the pickiest cats will love.',
        price: 12.00,
        discountDetails: 0,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Cat+Treats',
        category: 'Pet Food'
    },
    {
        id: 'p48',
        name: 'Vegetarian Dental Chews',
        description: 'Plant-based chews that help clean teeth and freshen breath.',
        price: 22.00,
        discountDetails: 15,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Dental+Chews',
        category: 'Pet Food'
    },
    {
        id: 'p49',
        name: 'Raw Coated Rabbit Kibble',
        description: 'High-end protein source coated in freeze-dried raw for amazing taste.',
        price: 75.00,
        discountDetails: 5,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Rabbit+Kibble',
        category: 'Pet Food'
    },
    {
        id: 'p50',
        name: 'Weight Management Small Breed Food',
        description: 'Lower calorie formula designed to keep small dogs at their ideal weight.',
        price: 40.00,
        discountDetails: 10,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Weight+Food',
        category: 'Pet Food'
    },

    // --- HAIR ---
    {
        id: 'hr51',
        name: 'Ionic Hair Dryer with Diffuser',
        description: 'Fast-drying technology that reduces frizz and protects hair from heat damage.',
        price: 150.00,
        discountDetails: 20,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Hair+Dryer',
        category: 'Hair'
    },
    {
        id: 'hr52',
        name: 'Ceramic Flat Iron Straightener',
        description: 'Floating ceramic plates that glide smoothly for a sleek, straight finish.',
        price: 90.00,
        discountDetails: 10,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Flat+Iron',
        category: 'Hair'
    },
    {
        id: 'hr53',
        name: 'Nourishing Argan Oil Serum',
        description: 'Lightweight oil that adds shine and tames flyaways without being greasy.',
        price: 25.00,
        discountDetails: 0,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Argan+Oil',
        category: 'Hair'
    },
    {
        id: 'hr54',
        name: 'Volumizing Biotin Shampoo',
        description: 'Strengthens thin hair and adds noticeable volume from the roots.',
        price: 18.00,
        discountDetails: 5,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Shampoo',
        category: 'Hair'
    },
    {
        id: 'hr55',
        name: 'Professional Barber Scissors',
        description: 'Ultra-sharp stainless steel shears for precise DIY trims and styling.',
        price: 45.00,
        discountDetails: 0,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Scissors',
        category: 'Hair'
    },
    {
        id: 'hr56',
        name: 'Heat Protectant Styling Spray',
        description: 'Essential barrier spray to prevent breakage when using hot tools.',
        price: 22.00,
        discountDetails: 10,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Heat+Spray',
        category: 'Hair'
    },
    {
        id: 'hr57',
        name: 'Deep Conditioning Mask',
        description: 'Intensive weekly treatment for dry or color-treated hair.',
        price: 30.00,
        discountDetails: 15,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Hair+Mask',
        category: 'Hair'
    },
    {
        id: 'hr58',
        name: 'Scalp Massaging Brush',
        description: 'Soft silicone bristles that stimulate the scalp and improve circulation.',
        price: 12.00,
        discountDetails: 0,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Scalp+Brush',
        category: 'Hair'
    },
    {
        id: 'hr59',
        name: 'Cordless Beard Trimmer Kit',
        description: 'Precision blades and multiple attachments for all facial hair lengths.',
        price: 65.00,
        discountDetails: 12,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Trimmer',
        category: 'Hair'
    },
    {
        id: 'hr60',
        name: 'Boar Bristle Paddle Brush',
        description: 'Natural bristles that distribute oils evenly for a healthy, natural shine.',
        price: 28.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Paddle+Brush',
        category: 'Hair'
    },

    // --- JEWELLERY ---
    {
        id: 'j61',
        name: '14K Gold Pendant Necklace',
        description: 'Dainty gold chain with a minimalist circular pendant. Perfect for layering.',
        price: 250.00,
        discountDetails: 5,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Gold+Necklace',
        category: 'Jewellery'
    },
    {
        id: 'j62',
        name: 'Sterling Silver Cuff Bracelet',
        description: 'Hand-polished silver cuff with an adjustable open-back design.',
        price: 85.00,
        discountDetails: 10,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Silver+Cuff',
        category: 'Jewellery'
    },
    {
        id: 'j63',
        name: 'Custom Name Engraved Ring',
        description: 'Personalized band available in gold, silver, or rose gold finishes.',
        price: 110.00,
        discountDetails: 0,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Name+Ring',
        category: 'Jewellery'
    },
    {
        id: 'j64',
        name: 'Minimalist Geometric Choker',
        description: 'Modern wire choker featuring a subtle triangle accent.',
        price: 45.00,
        discountDetails: 15,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Choker',
        category: 'Jewellery'
    },
    {
        id: 'j65',
        name: 'Freshwater Pearl Bracelet',
        description: 'Elegant strand of genuine cultured pearls with a silver lobster clasp.',
        price: 135.00,
        discountDetails: 8,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Pearl+Bracelet',
        category: 'Jewellery'
    },
    {
        id: 'j66',
        name: 'Vintage Locket Pendant',
        description: 'Antique-style heart locket that opens to hold two small photographs.',
        price: 75.00,
        discountDetails: 20,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Locket',
        category: 'Jewellery'
    },
    {
        id: 'j67',
        name: 'Diamond Accent Tennis Bracelet',
        description: 'Sparkling line of small ethically sourced diamonds in a silver setting.',
        price: 450.00,
        discountDetails: 10,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Tennis+Bracelet',
        category: 'Jewellery'
    },
    {
        id: 'j68',
        name: 'Rose Gold Layering Chain',
        description: 'Thin, flat snake chain designed to complement any outfit.',
        price: 95.00,
        discountDetails: 0,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Rose+Gold+Chain',
        category: 'Jewellery'
    },
    {
        id: 'j69',
        name: 'Bohemian Stone Arm Cuff',
        description: 'Statement upper-arm jewellery featuring raw turquoise stone.',
        price: 40.00,
        discountDetails: 12,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=Arm+Cuff',
        category: 'Jewellery'
    },
    {
        id: 'j70',
        name: 'Solid Silver Link Chain',
        description: 'Heavy-duty cuban link chain for a bold, masculine look.',
        price: 120.00,
        discountDetails: 5,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Link+Chain',
        category: 'Jewellery'
    },

    // --- EARRINGS ---
    {
        id: 'er71',
        name: 'Classic Diamond Stud Earrings',
        description: 'Timeless round-cut diamonds in a secure 4-prong white gold setting.',
        price: 550.00,
        discountDetails: 10,
        rating: 4.9,
        image: 'https://placehold.co/400x400?text=Diamond+Studs',
        category: 'Earrings'
    },
    {
        id: 'er72',
        name: 'Large 18K Gold Hoop Earrings',
        description: 'Lightweight hollow hoops that provide a bold statement without the weight.',
        price: 180.00,
        discountDetails: 5,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Gold+Hoops',
        category: 'Earrings'
    },
    {
        id: 'er73',
        name: 'Blue Topaz Drop Earrings',
        description: 'Stunning teardrop stones that catch the light beautifully.',
        price: 125.00,
        discountDetails: 15,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Topaz+Drops',
        category: 'Earrings'
    },
    {
        id: 'er74',
        name: 'Magnetic Non-Piercing Studs',
        description: 'Stylish black studs for those without ear piercings.',
        price: 20.00,
        discountDetails: 0,
        rating: 4.3,
        image: 'https://placehold.co/400x400?text=Magnetic+Studs',
        category: 'Earrings'
    },
    {
        id: 'er75',
        name: 'Handcrafted Clay Dangle Earrings',
        description: 'Unique, lightweight abstract art pieces for your ears.',
        price: 35.00,
        discountDetails: 10,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Clay+Earrings',
        category: 'Earrings'
    },
    {
        id: 'er76',
        name: 'Sterling Silver Knot Studs',
        description: 'Intricate love-knot design, symbolizing eternal connection.',
        price: 45.00,
        discountDetails: 0,
        rating: 4.5,
        image: 'https://placehold.co/400x400?text=Knot+Studs',
        category: 'Earrings'
    },
    {
        id: 'er77',
        name: 'Tassel Statement Earrings',
        description: 'Vibrant silk tassels that add a pop of color to any summer dress.',
        price: 25.00,
        discountDetails: 20,
        rating: 4.4,
        image: 'https://placehold.co/400x400?text=Tassel+Earrings',
        category: 'Earrings'
    },
    {
        id: 'er78',
        name: 'Earcuff with Chain Detail',
        description: 'Edgy cuff that clips onto the cartilage with a connecting chain to a stud.',
        price: 30.00,
        discountDetails: 0,
        rating: 4.6,
        image: 'https://placehold.co/400x400?text=Earcuff',
        category: 'Earrings'
    },
    {
        id: 'er79',
        name: 'Emerald Green Crystal Drops',
        description: 'Deep green crystals that mimic the look of luxury emeralds.',
        price: 90.00,
        discountDetails: 12,
        rating: 4.7,
        image: 'https://placehold.co/400x400?text=Crystal+Drops',
        category: 'Earrings'
    },
    {
        id: 'er80',
        name: 'Minimalist Bar Stud Earrings',
        description: 'Sleek horizontal bars for a clean, professional aesthetic.',
        price: 35.00,
        discountDetails: 5,
        rating: 4.8,
        image: 'https://placehold.co/400x400?text=Bar+Studs',
        category: 'Earrings'
    }
];
