const primeData = {
    properties: [
        {
            id: 1,
            title: "Modern Glass Villa in Beverly Hills",
            location: "Beverly Hills, CA",
            price: 4500000,
            status: "buy",
            type: "villa",
            beds: 5,
            baths: 6,
            area: 6500,
            year: 2024,
            image: "https://images.unsplash.com/photo-1613490900233-a51c5a3fa3dc?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1613490900233-a51c5a3fa3dc?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            ],
            featured: true,
            agentId: "agent1",
            overview: "An architectural masterpiece featuring floor-to-ceiling glass walls that perfectly frame the panoramic city views. This brand new construction offers an open-concept living space seamlessly integrating indoor and outdoor living. The chef's kitchen boasts top-of-the-line appliances and custom Italian cabinetry. Step outside to an infinity edge pool and a sunken fire pit.",
            amenities: ["Infinity Pool", "Smart Home System", "Wine Cellar", "Home Theater", "Outdoor Kitchen", "4-Car Garage"]
        },
        {
            id: 2,
            title: "Luxury Penthouse with Skyline Views",
            location: "Manhattan, NY",
            price: 12500, // Monthly rent
            status: "rent",
            type: "apartment",
            beds: 3,
            baths: 3,
            area: 2800,
            year: 2021,
            image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1e650d07bc?auto=format&fit=crop&w=800&q=80"
            ],
            featured: true,
            agentId: "agent2",
            overview: "Experience the pinnacle of urban living in this sprawling penthouse. Featuring soaring 14-foot ceilings, wide-plank oak flooring, and a private wraparound terrace offering unobstructed views of the Manhattan skyline. The building provides white-glove service including a 24-hour concierge and a private wellness club.",
            amenities: ["Private Terrace", "24/7 Concierge", "Fitness Center", "Spa", "Valet Parking"]
        },
        {
            id: 3,
            title: "Historic Renovated Townhouse",
            location: "Brooklyn, NY",
            price: 2800000,
            status: "buy",
            type: "house",
            beds: 4,
            baths: 3,
            area: 3200,
            year: 1910,
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
            ],
            featured: false,
            agentId: "agent2",
            overview: "A meticulous gut renovation of a classic brownstone. The historic facade has been lovingly restored, while the interior was transformed for modern luxury living. Features include original exposed brick, high-end marble finishes in the kitchen and baths, and a beautifully landscaped private backyard.",
            amenities: ["Private Garden", "Exposed Brick", "Chef's Kitchen", "Finished Basement", "Central Air"]
        },
        {
            id: 4,
            title: "Waterfront Estate",
            location: "Miami, FL",
            price: 8900000,
            status: "buy",
            type: "villa",
            beds: 6,
            baths: 8,
            area: 9500,
            year: 2023,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            ],
            featured: true,
            agentId: "agent3",
            overview: "A spectacular waterfront property situated on a private peninsula. This estate offers 200 feet of water frontage with a private dock capable of accommodating a large yacht. The Mediterranean-inspired architecture features imported stone, vaulted ceilings, and resort-style grounds.",
            amenities: ["Private Dock", "Resort Pool", "Guest House", "Tennis Court", "Gated Security"]
        },
        {
            id: 5,
            title: "Downtown Loft Studio",
            location: "Austin, TX",
            price: 2500, // Monthly
            status: "rent",
            type: "apartment",
            beds: 1,
            baths: 1,
            area: 950,
            year: 2018,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80"
            ],
            featured: false,
            agentId: "agent1",
            overview: "A trendy industrial loft in the heart of downtown. Open floor plan with polished concrete floors, 15-foot ceilings, and massive industrial windows flooding the space with natural light. Walkable to the city's best restaurants and entertainment venues.",
            amenities: ["In-unit W/D", "Rooftop Access", "Covered Parking", "Gym"]
        },
        {
            id: 6,
            title: "Suburban Family Home",
            location: "Seattle, WA",
            price: 950000,
            status: "buy",
            type: "house",
            beds: 4,
            baths: 3,
            area: 2600,
            year: 2015,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
            ],
            featured: false,
            agentId: "agent3",
            overview: "A charming craftsman home in a highly sought-after school district. Features a welcoming front porch, an updated kitchen with a large island, and a cozy living room with a gas fireplace. The fenced backyard is perfect for family gatherings.",
            amenities: ["Fenced Yard", "Two-car Garage", "Fireplace", "Updated Kitchen"]
        },
        {
            id: 7,
            title: "Premium Commercial Office Space",
            location: "Chicago, IL",
            price: 15000, // Monthly
            status: "rent",
            type: "commercial",
            beds: 0,
            baths: 4,
            area: 5000,
            year: 2020,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            gallery: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            ],
            featured: false,
            agentId: "agent1",
            overview: "State-of-the-art office space in the Loop. Features an open collaborative area, several private glass-walled offices, and a fully equipped boardroom. Includes a modern kitchenette and break area.",
            amenities: ["High-speed Fiber", "Security System", "Boardroom", "Kitchenette"]
        }
    ],

    agents: [
        {
            id: "agent1",
            name: "Sarah Jenkins",
            role: "Luxury Property Specialist",
            phone: "+1 (310) 555-0123",
            email: "sarah@primeestate.com",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: "agent2",
            name: "Michael Chen",
            role: "Urban & High-Rise Expert",
            phone: "+1 (212) 555-0899",
            email: "michael@primeestate.com",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: "agent3",
            name: "Elena Rodriguez",
            role: "Waterfront & Estates Director",
            phone: "+1 (305) 555-0456",
            email: "elena@primeestate.com",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
        }
    ]
};
