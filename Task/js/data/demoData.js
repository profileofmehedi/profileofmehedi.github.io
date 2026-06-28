// LifeOS Demo Mock Database (Globally Scoped)

const getRelativeDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

window.demoData = {
  profile: {
    name: "Mehedi",
    email: "mehedi@lifeos.io",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop",
    bio: "Passionate Senior Software Engineer crafting elegant UI/UX solutions."
  },
  
  settings: {
    themeColor: "blue",
    themeMode: "dark",
    language: "en",
    soundEnabled: true,
    soundVolume: 0.5,
    soundFile: "wave-synth",
    keyboardShortcuts: [
      { key: "Ctrl + K", desc: "Universal Search" },
      { key: "Alt + N", desc: "New Task Quick Add" },
      { key: "Alt + P", desc: "Start Pomodoro Timer" },
      { key: "Esc", desc: "Close Modals / Drawers" }
    ]
  },
  
  tasks: [
    {
      id: "t1",
      title: "Design the storage layer architecture",
      description: "Establish the StorageService interface to abstract LocalStorage operations. This allows clean swapping with ASP.NET Core REST APIs later.",
      priority: "high",
      status: "completed",
      category: "work",
      tags: ["architecture", "storage"],
      estimatedTime: "2h",
      dueDate: getRelativeDateString(-1),
      dueTime: "14:00",
      progress: 100,
      checklist: [
        { id: "tc1", text: "Define CRUD structure", checked: true },
        { id: "tc2", text: "Create localStorage wrapper", checked: true }
      ],
      subtasks: [],
      attachments: [{ name: "db_schema.png", size: "254 KB", type: "image/png" }],
      color: "#3b82f6",
      repeat: "none",
      notes: "Completed successfully. Solid decoupling established.",
      history: [{ timestamp: new Date(Date.now() - 86400000).toISOString(), text: "Created and marked completed." }]
    },
    {
      id: "t2",
      title: "Build Pomodoro timer component",
      description: "Implement interactive SVG progress circles, ticking countdown, and customized sessions (25/5, 50/10). Needs focus session tracking logs.",
      priority: "high",
      status: "in-progress",
      category: "work",
      tags: ["components", "pomodoro"],
      estimatedTime: "3h",
      dueDate: getRelativeDateString(0),
      dueTime: "17:00",
      progress: 60,
      checklist: [
        { id: "tc3", text: "Draw circular SVG loader", checked: true },
        { id: "tc4", text: "Connect audio synthesize alarms", checked: true },
        { id: "tc5", text: "Log session stats to analytics", checked: false }
      ],
      subtasks: [
        { id: "ts1", title: "Synthesize chime sound", checked: true },
        { id: "ts2", title: "Implement tab title countdown update", checked: false }
      ],
      attachments: [],
      color: "#8b5cf6",
      repeat: "none",
      notes: "Web Audio synth is functioning. Working on statistics logging next.",
      history: [{ timestamp: new Date().toISOString(), text: "Started execution" }]
    },
    {
      id: "t3",
      title: "Design main dashboard layout grid",
      description: "Structure layout grid columns, spacing, collapsible panels, and widget toggles.",
      priority: "medium",
      status: "todo",
      category: "work",
      tags: ["layout", "css"],
      estimatedTime: "4h",
      dueDate: getRelativeDateString(2),
      dueTime: "10:00",
      progress: 0,
      checklist: [],
      subtasks: [],
      attachments: [],
      color: "#f97316",
      repeat: "none",
      notes: "",
      history: []
    },
    {
      id: "t4",
      title: "Weekly Grocery Run",
      description: "Pick up fresh fruits, vegetables, oat milk, and cold brew pods.",
      priority: "low",
      status: "completed",
      category: "personal",
      tags: ["errands"],
      estimatedTime: "1h",
      dueDate: getRelativeDateString(-2),
      dueTime: "19:00",
      progress: 100,
      checklist: [],
      subtasks: [],
      attachments: [],
      color: "#64748b",
      repeat: "weekly",
      notes: "Done.",
      history: []
    }
  ],
  
  reminders: [
    {
      id: "r1",
      title: "Project Review Meeting",
      dateTime: `${getRelativeDateString(1)}T15:00:00`,
      type: "one-time",
      repeat: "none",
      category: "work",
      completed: false
    },
    {
      id: "r2",
      title: "Drink Water",
      dateTime: `${getRelativeDateString(0)}T14:00:00`,
      type: "recurring",
      repeat: "daily",
      category: "health",
      completed: false
    },
    {
      id: "r3",
      title: "Log Daily Expense Ledger",
      dateTime: `${getRelativeDateString(0)}T22:00:00`,
      type: "recurring",
      repeat: "daily",
      category: "finance",
      completed: false
    }
  ],
  
  notes: [
    {
      id: "n1",
      title: "🚀 SPA Architecture Concepts",
      content: "### Key Pillars\n- **No Bundler**: Running native script tags.\n- **Layouts**: Left menu panel, header dynamic content frame, drawers.\n- **State Coordinator**: Main controller manages view mount instances and universal listeners.",
      color: "#dbeafe", // pastel blue
      pinned: true,
      archived: false,
      updatedAt: new Date().toISOString()
    },
    {
      id: "n2",
      title: "🛒 Shopping Checklist",
      content: "- [x] Organic avocados\n- [x] Unsweetened almond milk\n- [ ] Whole wheat sourdough bread\n- [ ] Single-origin coffee beans\n- [ ] Fresh basil leaves",
      color: "#fef3c7", // pastel yellow
      pinned: false,
      archived: false,
      updatedAt: new Date().toISOString()
    },
    {
      id: "n3",
      title: "💡 SaaS Premium Ideas",
      content: "- **Vibrant themes**: Make gradients custom matching accents.\n- **Keyboard Nav**: Focus search instantly using Ctrl+K.\n- **Audio alarms**: Programmatic synth beep triggers when reminder counts hit zero.",
      color: "#d1fae5", // pastel green
      pinned: false,
      archived: false,
      updatedAt: new Date().toISOString()
    }
  ],
  
  habits: [
    {
      id: "h1",
      title: "Drink 3L Water",
      frequency: "daily",
      history: {
        [getRelativeDateString(-3)]: true,
        [getRelativeDateString(-2)]: true,
        [getRelativeDateString(-1)]: true,
        [getRelativeDateString(0)]: false
      },
      createdAt: getRelativeDateString(-10)
    },
    {
      id: "h2",
      title: "Gym Workout",
      frequency: "weekly",
      history: {
        [getRelativeDateString(-5)]: true,
        [getRelativeDateString(-2)]: true
      },
      createdAt: getRelativeDateString(-10)
    }
  ],
  
  expenses: [
    { id: "e1", type: "income", amount: 4800, category: "Salary", date: getRelativeDateString(-5), description: "Monthly SaaS project consulting fee" },
    { id: "e2", type: "expense", amount: 1500, category: "Housing", date: getRelativeDateString(-4), description: "Apartment Rental Payment" },
    { id: "e3", type: "expense", amount: 120, category: "Utilities", date: getRelativeDateString(-3), description: "AWS Developer Sandbox Bill" },
    { id: "e4", type: "expense", amount: 85, category: "Groceries", date: getRelativeDateString(-2), description: "Whole Foods Organic Groceries" },
    { id: "e5", type: "expense", amount: 45, category: "Transport", date: getRelativeDateString(-1), description: "Uber rides to meet clients" },
    { id: "e6", type: "income", amount: 350, category: "Investments", date: getRelativeDateString(0), description: "Dividend returns payout" }
  ],
  
  journal: [
    {
      id: "j1",
      date: getRelativeDateString(-2),
      mood: "productive",
      reflection: "Productive day. Resolved storage decoupling logic. Explored beautiful glassmorphism options for dark theme components.",
      achievements: ["Decoupled storage layers", "Seeded mock data database"],
      tomorrowPlan: "Create tasks timeline view and layout widgets re-ordering functions."
    },
    {
      id: "j2",
      date: getRelativeDateString(-1),
      mood: "happy",
      reflection: "Met targets ahead of schedule. Designed a highly interactive Pomodoro progress circle showing countdowns. Sound alarms work.",
      achievements: ["Pomodoro ring built", "Theme selectors connected"],
      tomorrowPlan: "Finalize visual pages design details and build PDF backup download export."
    },
    {
      id: "j3",
      date: getRelativeDateString(0),
      mood: "productive",
      reflection: "Writing core implementation blocks. Ready to build the views and bind universal search filters.",
      achievements: ["Integrated universal search overlay", "Created backup restore manager"],
      tomorrowPlan: "Perform responsiveness cross-browser layout tests."
    }
  ],
  
  screenshots: [
    {
      id: "s1",
      title: "UI Design Mockups",
      category: "UI Design",
      tags: ["design", "layout"],
      src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='16'>UI Layout Wireframes [Mock]</text></svg>",
      date: getRelativeDateString(-3)
    }
  ],
  
  activities: [
    { timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), text: "Completed task 'Design the storage layer architecture'" },
    { timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), text: "Added note 'SPA Architecture Concepts'" },
    { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), text: "Logged $85 Groceries expense" },
    { timestamp: new Date().toISOString(), text: "Started Pomodoro session #1" }
  ]
};
