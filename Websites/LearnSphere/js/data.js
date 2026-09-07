const mockData = {
    stats: {
        courses: 145,
        students: 120500,
        instructors: 85,
        hours: 15000
    },
    categories: ['Programming', 'Design', 'Business', 'Marketing'],
    courses: [
        {
            id: 1,
            title: "Full-Stack Web Development Bootcamp",
            instructor: "Sarah Jenkins",
            rating: 4.8,
            reviews: 1250,
            students: 15400,
            duration: "45h 30m",
            price: 89.99,
            category: "Programming",
            level: "Beginner",
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
            featured: true,
            overview: "Learn web development from scratch. This comprehensive bootcamp covers HTML, CSS, JavaScript, React, Node.js, and MongoDB. By the end of this course, you will be able to build full-scale web applications and deploy them to the cloud.",
            outcomes: [
                "Build full-stack web applications",
                "Master React.js for frontend development",
                "Create RESTful APIs with Node & Express",
                "Work with MongoDB databases"
            ],
            requirements: [
                "No programming experience needed",
                "A computer with internet access",
                "Willingness to learn and practice"
            ],
            curriculum: [
                { title: "Introduction to HTML & CSS", lectures: 12 },
                { title: "JavaScript Fundamentals", lectures: 25 },
                { title: "React.js Mastery", lectures: 30 },
                { title: "Backend with Node.js", lectures: 20 }
            ],
            instructorBio: "Sarah is a Senior Software Engineer with 10 years of experience building scalable applications. She has taught over 50,000 students online."
        },
        {
            id: 2,
            title: "Advanced UI/UX Design Masterclass",
            instructor: "David Chen",
            rating: 4.9,
            reviews: 840,
            students: 8200,
            duration: "22h 15m",
            price: 65.00,
            category: "Design",
            level: "Advanced",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
            featured: true,
            overview: "Take your design skills to the next level. This masterclass dives deep into user psychology, advanced prototyping in Figma, and creating complex design systems for enterprise applications.",
            outcomes: [
                "Create comprehensive design systems",
                "Master advanced Figma prototyping",
                "Understand behavioral psychology in UX",
                "Conduct professional user testing"
            ],
            requirements: [
                "Basic understanding of UI design",
                "Figma installed",
                "Previous design portfolio (optional)"
            ],
            curriculum: [
                { title: "Design Systems & Components", lectures: 8 },
                { title: "Advanced Prototyping", lectures: 15 },
                { title: "UX Research Methods", lectures: 10 }
            ],
            instructorBio: "David is a Lead Product Designer who has worked with companies like Apple and Airbnb."
        },
        {
            id: 3,
            title: "Digital Marketing Strategy 2026",
            instructor: "Emma Roberts",
            rating: 4.7,
            reviews: 560,
            students: 12000,
            duration: "18h 00m",
            price: 45.99,
            category: "Marketing",
            level: "Intermediate",
            thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
            featured: false,
            overview: "Learn how to build a modern marketing engine. Covering SEO, Meta Ads, Google Ads, and conversion rate optimization to scale any business profitably.",
            outcomes: [
                "Run profitable ad campaigns",
                "Master technical SEO",
                "Build email marketing funnels",
                "Analyze data for growth"
            ],
            requirements: [
                "Basic understanding of marketing concepts"
            ],
            curriculum: [
                { title: "SEO Fundamentals", lectures: 10 },
                { title: "Paid Acquisition (Meta & Google)", lectures: 18 },
                { title: "Email Marketing Automation", lectures: 12 }
            ],
            instructorBio: "Emma is a Growth Marketer who has scaled 3 startups to 8-figure revenues."
        },
        {
            id: 4,
            title: "Python for Data Science",
            instructor: "Dr. Alan Turing",
            rating: 4.9,
            reviews: 2100,
            students: 25000,
            duration: "55h 00m",
            price: 0, // Free course
            category: "Programming",
            level: "Beginner",
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
            featured: true,
            overview: "Start your data science journey with Python. Learn Pandas, NumPy, Matplotlib, and Scikit-learn.",
            outcomes: [
                "Analyze complex datasets",
                "Build machine learning models",
                "Create data visualizations"
            ],
            requirements: [
                "Basic math skills"
            ],
            curriculum: [
                { title: "Python Basics", lectures: 15 },
                { title: "Data Analysis with Pandas", lectures: 20 },
                { title: "Machine Learning intro", lectures: 20 }
            ],
            instructorBio: "Dr. Turing is a Data Scientist and Professor."
        },
        {
            id: 5,
            title: "Business Leadership & Management",
            instructor: "Michael Scott",
            rating: 4.5,
            reviews: 320,
            students: 4500,
            duration: "12h 45m",
            price: 55.00,
            category: "Business",
            level: "Intermediate",
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
            featured: false,
            overview: "Learn how to manage teams effectively, handle conflicts, and drive business growth through strong leadership.",
            outcomes: [
                "Manage diverse teams",
                "Conflict resolution",
                "Strategic planning"
            ],
            requirements: [
                "Some management experience preferred"
            ],
            curriculum: [
                { title: "Leadership Styles", lectures: 5 },
                { title: "Team Dynamics", lectures: 8 }
            ],
            instructorBio: "Michael has 15 years of corporate management experience."
        }
    ],
    instructors: [
        { name: "Sarah Jenkins", role: "Senior Software Engineer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
        { name: "David Chen", role: "Lead Product Designer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
        { name: "Emma Roberts", role: "Growth Marketer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
        { name: "Dr. Alan Turing", role: "Data Scientist", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    testimonials: [
        { name: "James Wilson", role: "Frontend Developer", text: "LearnSphere completely changed my career trajectory. The Web Development bootcamp gave me the practical skills I needed to land my first job.", rating: 5 },
        { name: "Sophia Martinez", role: "UX Researcher", text: "The instructors here are actual industry professionals. The advanced UI/UX masterclass was incredibly detailed and up-to-date with current Figma trends.", rating: 5 },
        { name: "Liam Brown", role: "Marketing Manager", text: "Best platform for continuous learning. The quality of video production and curriculum structure is better than any other platform I've used.", rating: 4 }
    ],
    faqs: [
        { q: "How do I access the courses?", a: "Once you enroll, you get instant lifetime access to the course content via your dashboard. You can watch the videos on any device." },
        { q: "Do you offer certificates?", a: "Yes, upon completing 100% of the course modules, you will receive a verifiable digital certificate." },
        { q: "What is the refund policy?", a: "We offer a 30-day money-back guarantee. If you are not satisfied, you can request a full refund within 30 days of purchase." },
        { q: "Can I download the videos?", a: "Yes, our mobile app allows you to download videos for offline viewing." }
    ]
};
