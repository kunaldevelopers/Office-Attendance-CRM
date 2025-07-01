export const demoData = {
  users: [
    { 
      id: 1, 
      name: "John Doe", 
      email: "admin@enegix.com", 
      role: "Admin", 
      status: "Active",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      department: "Management",
      lastLogin: "2025-01-15T10:30:00Z",
      createdAt: "2024-01-15T08:00:00Z"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "employee@enegix.com", 
      role: "Employee", 
      status: "Active",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      department: "Sales",
      lastLogin: "2025-01-15T09:15:00Z",
      createdAt: "2024-02-10T09:00:00Z"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike@enegix.com", 
      role: "Employee", 
      status: "Active",
      avatar: "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      department: "Support",
      lastLogin: "2025-01-14T16:45:00Z",
      createdAt: "2024-03-05T10:00:00Z"
    }
  ],
  departments: [
    { 
      id: 1, 
      name: "Sales", 
      head: "Jane Smith", 
      budget: 50000, 
      employees: 5,
      goals: { revenue: 100000, customers: 50 },
      performance: 85
    },
    { 
      id: 2, 
      name: "Support", 
      head: "Mike Johnson", 
      budget: 30000, 
      employees: 3,
      goals: { tickets: 500, satisfaction: 90 },
      performance: 92
    },
    { 
      id: 3, 
      name: "Management", 
      head: "John Doe", 
      budget: 75000, 
      employees: 2,
      goals: { efficiency: 95, growth: 20 },
      performance: 88
    }
  ],
  customers: [
    { 
      id: 1, 
      name: "Acme Corporation", 
      email: "contact@acme.com", 
      phone: "+1-555-0123",
      assignedTo: "Jane Smith",
      status: "Active",
      value: 25000,
      lastContact: "2025-01-14T14:30:00Z",
      industry: "Technology"
    },
    { 
      id: 2, 
      name: "Global Industries", 
      email: "info@global.com", 
      phone: "+1-555-0456",
      assignedTo: "Jane Smith",
      status: "Lead",
      value: 50000,
      lastContact: "2025-01-13T11:15:00Z",
      industry: "Manufacturing"
    },
    { 
      id: 3, 
      name: "Tech Innovations", 
      email: "hello@techinno.com", 
      phone: "+1-555-0789",
      assignedTo: "Mike Johnson",
      status: "Active",
      value: 15000,
      lastContact: "2025-01-15T08:45:00Z",
      industry: "Software"
    }
  ],
  tasks: [
    { 
      id: 1, 
      title: "Follow up with Acme Corporation", 
      description: "Schedule quarterly review meeting",
      priority: "High", 
      progress: 75, 
      assignedTo: "Jane Smith",
      dueDate: "2025-01-20T17:00:00Z",
      status: "In Progress",
      category: "Sales"
    },
    { 
      id: 2, 
      title: "Prepare Q1 sales report", 
      description: "Compile sales data and analysis",
      priority: "Medium", 
      progress: 40, 
      assignedTo: "Jane Smith",
      dueDate: "2025-01-25T17:00:00Z",
      status: "In Progress",
      category: "Reporting"
    },
    { 
      id: 3, 
      title: "Update CRM documentation", 
      description: "Document new features and processes",
      priority: "Low", 
      progress: 20, 
      assignedTo: "Mike Johnson",
      dueDate: "2025-01-30T17:00:00Z",
      status: "Not Started",
      category: "Documentation"
    }
  ],
  timesheets: [
    { 
      id: 1, 
      date: "2025-01-15", 
      hours: 8, 
      project: "CRM Development", 
      employeeId: 2,
      description: "Working on customer management features",
      status: "Submitted"
    },
    { 
      id: 2, 
      date: "2025-01-15", 
      hours: 7.5, 
      project: "Client Support", 
      employeeId: 3,
      description: "Handling customer support tickets",
      status: "Approved"
    },
    { 
      id: 3, 
      date: "2025-01-14", 
      hours: 8, 
      project: "Sales Activities", 
      employeeId: 2,
      description: "Client meetings and follow-ups",
      status: "Approved"
    }
  ],
  reports: [
    { 
      id: 1, 
      title: "Sales Performance Report", 
      data: { 
        totalSales: 125000, 
        newCustomers: 15, 
        conversionRate: 12.5,
        topPerformer: "Jane Smith"
      }, 
      date: "2025-01-15T10:00:00Z",
      type: "Sales"
    },
    { 
      id: 2, 
      title: "Customer Satisfaction Report", 
      data: { 
        averageRating: 4.2, 
        totalResponses: 45, 
        satisfactionRate: 89,
        topIssues: ["Response Time", "Product Quality"]
      }, 
      date: "2025-01-14T15:30:00Z",
      type: "Support"
    }
  ],
  dashboard: {
    admin: { 
      totalRevenue: 125000,
      totalUsers: 50, 
      activeProjects: 12,
      systemUptime: 99.9,
      newCustomers: 15,
      completedTasks: 45,
      pendingApprovals: 5,
      monthlyGrowth: 8.5
    },
    employee: { 
      tasksCompleted: 12, 
      totalTasks: 18,
      meetings: 5, 
      hoursLogged: 35,
      customerInteractions: 8,
      pendingFollowUps: 3
    }
  },
  interactions: [
    { 
      id: 1, 
      customer: "Acme Corporation", 
      type: "Email",
      time: "2025-01-15T09:00:00Z", 
      employeeId: 2,
      notes: "Discussed renewal terms and pricing options",
      outcome: "Positive"
    },
    { 
      id: 2, 
      customer: "Global Industries", 
      type: "Phone Call",
      time: "2025-01-14T14:30:00Z", 
      employeeId: 2,
      notes: "Initial discovery call to understand requirements",
      outcome: "Follow-up scheduled"
    },
    { 
      id: 3, 
      customer: "Tech Innovations", 
      type: "Meeting",
      time: "2025-01-13T11:00:00Z", 
      employeeId: 3,
      notes: "Product demo and Q&A session",
      outcome: "Proposal requested"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "New customer inquiry",
      message: "Global Industries has submitted a new inquiry",
      type: "info",
      time: "2025-01-15T08:30:00Z",
      read: false
    },
    {
      id: 2,
      title: "Task deadline approaching",
      message: "Follow up with Acme Corporation due in 2 days",
      type: "warning",
      time: "2025-01-15T07:00:00Z",
      read: false
    }
  ]
};

export const mockCredentials = {
  admin: { email: "admin@enegix.com", password: "admin123" },
  employee: { email: "employee@enegix.com", password: "employee123" }
};