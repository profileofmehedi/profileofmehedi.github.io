const urbanData = {
    menu: [
        {
            category: "Starters",
            items: [
                { id: "s1", name: "Truffle Arancini", desc: "Crispy risotto balls, wild mushrooms, black truffle aioli", price: 18, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=200&q=80", tags: ["v"] },
                { id: "s2", name: "Wagyu Beef Carpaccio", desc: "Thinly sliced wagyu, capers, parmesan emulsion, micro arugula", price: 24, image: "https://images.unsplash.com/photo-1544025162-8111f42289c0?auto=format&fit=crop&w=200&q=80", tags: [] },
                { id: "s3", name: "Charred Octopus", desc: "Spanish octopus, fingerling potatoes, smoked paprika, romesco", price: 22, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&q=80", tags: ["gf"] }
            ]
        },
        {
            category: "Main Course",
            items: [
                { id: "m1", name: "Duck Breast a l'Orange", desc: "Pan-seared duck breast, sweet potato purée, grand marnier reduction", price: 42, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=200&q=80", tags: [] },
                { id: "m2", name: "Wild Mushroom Risotto", desc: "Carnaroli rice, porcini dust, aged parmigiano reggiano", price: 34, image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7cf?auto=format&fit=crop&w=200&q=80", tags: ["v", "gf"] },
                { id: "m3", name: "Bone-in Ribeye", desc: "Dry-aged 16oz ribeye, roasted bone marrow, chimichurri", price: 65, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80", tags: ["gf"] }
            ]
        },
        {
            category: "Seafood",
            items: [
                { id: "sf1", name: "Miso Glazed Black Cod", desc: "Sustainably sourced cod, baby bok choy, dashi broth", price: 46, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=80", tags: [] },
                { id: "sf2", name: "Pan-Seared Scallops", desc: "Diver scallops, cauliflower purée, crispy pancetta", price: 38, image: "https://images.unsplash.com/photo-1626776876729-abdf8b29ff07?auto=format&fit=crop&w=200&q=80", tags: ["gf"] }
            ]
        },
        {
            category: "Desserts",
            items: [
                { id: "d1", name: "Valrhona Chocolate Tart", desc: "Dark chocolate ganache, sea salt, gold leaf, raspberry coulis", price: 16, image: "https://images.unsplash.com/photo-1620589125156-fd5028c5e05b?auto=format&fit=crop&w=200&q=80", tags: ["v"] },
                { id: "d2", name: "Pistachio Soufflé", desc: "Baked to order, served with Madagascar vanilla bean ice cream", price: 18, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=200&q=80", tags: ["v"] }
            ]
        },
        {
            category: "Beverages",
            items: [
                { id: "b1", name: "Smoked Old Fashioned", desc: "Bourbon, angostura bitters, hickory smoke, orange peel", price: 20, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=200&q=80", tags: [] },
                { id: "b2", name: "Lavender Gimlet", desc: "Gin, fresh lime, lavender syrup, botanical spray", price: 18, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=200&q=80", tags: [] }
            ]
        }
    ],

    featuredDishes: [
        {
            title: "Miso Glazed Black Cod",
            desc: "Our signature seafood dish, sustainably sourced and perfectly balanced with umami flavors.",
            image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Dry-Aged Bone-in Ribeye",
            desc: "Aged for 45 days in-house, served with roasted bone marrow.",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
        }
    ],

    offers: [
        {
            title: "Tasting Menu Experience",
            subtitle: "7-Course Journey",
            desc: "Let our Chef take you on a culinary journey through our finest creations, paired with sommelier-selected wines.",
            price: "$150 / person",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Weekend Brunch",
            subtitle: "Saturday & Sunday",
            desc: "Elevate your weekend with our unlimited mimosa brunch featuring elevated breakfast classics and live jazz.",
            price: "$65 / person",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
        }
    ],

    reviews: [
        {
            text: "Absolutely phenomenal. The attention to detail in both the presentation and the flavor profiles is world-class.",
            author: "Eleanor R.",
            role: "Food Critic"
        },
        {
            text: "The best dining experience I've had in the city. The Wagyu Carpaccio is a must-try.",
            author: "James M.",
            role: "Local Guide"
        }
    ]
};
