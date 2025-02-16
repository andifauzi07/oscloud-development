export type LeadType = {
    id: number;
    companyId: number;
    status: "active" | "completed" | "pending";
    projectName: string;
    value: string;
    startDate: string;
};

export type EmployeeTypes = {
    id: number;
    name: string;
    image: string;
    category: string;
    email: string;
    phone: string;
    joinedDate: string;
    hourlyRateA: string;
    hourlyRateB: string;
    projects: number;
    contact: string;
    isTemporary: boolean;
    // New fields for company relationship
    companyId: number;
    companyRole?: string;
    leads: LeadType[];
};
export const mockEmployees: EmployeeTypes[] = [
    {
        id: 12,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "UI Designer",
        email: "tanaka@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2024.10.25",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 2,
        contact: "tanaka",
        isTemporary: false,
        companyId: 1001,
        companyRole: "Project Manager",
        leads: [
            {
                id: 1,
                companyId: 1001,
                status: "active",
                projectName: "Cloud Platform UI Redesign",
                value: "¥5,000,000",
                startDate: "2024.01.20",
            },
        ],
    },
    {
        id: 17,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Full time",
        email: "Takahashi@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.21",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 54,
        contact: "Takahashi",
        isTemporary: false,
        companyId: 1001,
        companyRole: "Technical Lead",
        leads: [
            {
                id: 2,
                companyId: 1001,
                status: "active",
                projectName: "IT Infrastructure Upgrade",
                value: "¥8,000,000",
                startDate: "2024.02.01",
            },
        ],
    },
    {
        id: 45,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Temporary",
        email: "Ichihara@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.05",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 51,
        contact: "Ichihara",
        isTemporary: true,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },

    {
        id: 254,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 255,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 256,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 257,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 258,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 259,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 260,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
    {
        id: 3002,
        name: "ABC",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Employee Category A",
        email: "Suzuki@gmail.com",
        phone: "090-1234-1234",
        joinedDate: "2023.10.01",
        hourlyRateA: "¥2,500",
        hourlyRateB: "¥1,800",
        projects: 47,
        contact: "Suzuki",
        isTemporary: false,
        companyId: 1002,
        companyRole: "Creative Director",
        leads: [
            {
                id: 3,
                companyId: 1002,
                status: "active",
                projectName: "Brand Identity Redesign",
                value: "¥3,500,000",
                startDate: "2024.01.25",
            },
        ],
    },
];

export const getCompanyPersonnelCount = (companyId: number): number => {
    return mockEmployees.filter(employee => employee.companyId === companyId).length;
};