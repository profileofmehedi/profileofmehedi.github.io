// mockData.js
// Expanded Enterprise Data Model

const mockData = {
    // Current System Users
    users: [
        { id: 101, name: "Alice Johnson", email: "alice.j@nexus.com", role: "Admin", status: "Active", avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff" },
        { id: 102, name: "Bob Smith", email: "bob.s@nexus.com", role: "Sales Manager", status: "Active", avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=2c3e50&color=fff" },
        { id: 103, name: "Charlie Davis", email: "charlie.d@nexus.com", role: "Sales Rep", status: "Active", avatar: "https://ui-avatars.com/api/?name=Charlie+Davis&background=e67e22&color=fff" }
    ],
    
    // CRM Leads / Customers
    leads: [
        { id: 501, name: "TechStart Inc.", contact: "Sarah Connor", email: "sarah@techstart.io", phone: "+1 (555) 019-2834", status: "New", source: "Web Form", created: "2023-10-01", owner: "Bob Smith" },
        { id: 502, name: "Global Logistics", contact: "Mike Ross", email: "mike@glogistics.com", phone: "+1 (555) 091-8273", status: "Qualified", source: "LinkedIn", created: "2023-09-15", owner: "Charlie Davis" },
        { id: 503, name: "Apex Solutions", contact: "Jessica Pearson", email: "j.pearson@apex.net", phone: "+1 (555) 112-3344", status: "Contacted", source: "Referral", created: "2023-10-10", owner: "Bob Smith" },
        { id: 504, name: "Quantum Computing", contact: "Harvey Specter", email: "harvey@quantum.com", phone: "+1 (555) 998-8877", status: "New", source: "Conference", created: "2023-10-22", owner: "Charlie Davis" },
        { id: 505, name: "Blue Sky Retail", contact: "Louis Litt", email: "louis@bluesky.com", phone: "+1 (555) 445-5566", status: "Proposal", source: "Cold Call", created: "2023-08-05", owner: "Alice Johnson" }
    ],

    // Deals / Opportunities (for Kanban)
    deals: [
        { id: 1, title: "TechStart Enterprise License", amount: 25000, stage: "negotiation", leadId: 501, closeDate: "2023-11-15" },
        { id: 2, title: "Global Log. Fleet Tracking", amount: 150000, stage: "qualified", leadId: 502, closeDate: "2023-12-01" },
        { id: 3, title: "Apex Cloud Migration", amount: 85000, stage: "proposal", leadId: 503, closeDate: "2023-11-30" },
        { id: 4, title: "Quantum Qubit Research", amount: 500000, stage: "new", leadId: 504, closeDate: "2024-01-15" },
        { id: 5, title: "Blue Sky POS Upgrade", amount: 12000, stage: "won", leadId: 505, closeDate: "2023-10-10" }
    ],

    // Tasks & Activities
    tasks: [
        { id: 1, title: "Call Sarah regarding contract", due: "2023-10-26", priority: "High", status: "Pending", assignedTo: "Bob Smith" },
        { id: 2, title: "Prepare Q4 Presentation", due: "2023-10-28", priority: "Medium", status: "In Progress", assignedTo: "Alice Johnson" },
        { id: 3, title: "Follow up with Mike Ross", due: "2023-10-27", priority: "Low", status: "Pending", assignedTo: "Charlie Davis" }
    ],

    activityLog: [
        { id: 1, type: "call", note: "Called Sarah, discussed pricing tiers.", date: "2023-10-24 14:30", user: "Bob Smith" },
        { id: 2, type: "email", note: "Sent proposal V2 to Apex Solutions.", date: "2023-10-24 10:15", user: "Charlie Davis" },
        { id: 3, type: "meeting", note: "Lunch meeting with Global Logistics team.", date: "2023-10-23 12:00", user: "Bob Smith" },
        { id: 4, type: "status_change", note: "Moved Quantum Deal to 'Qualified'.", date: "2023-10-22 09:00", user: "Admin" }
    ],

    // Analytics Data
    chartData: {
        revenueByMonth: [12000, 19000, 3000, 5000, 20000, 30000, 45000, 25000, 35000, 40000, 60000, 55000],
        leadSources: [30, 15, 25, 20, 10], // Web, LinkedIn, Referral, Conference, Cold Call
        salesByRep: [45000, 38000, 32000, 28000, 25000] // Alice, Bob, Charlie, Diana, Evan
    }
};

window.MockData = mockData;