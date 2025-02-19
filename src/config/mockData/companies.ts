export type ProjectType = {
    id: number;
    projectName: string;
    manager: string;
    startDate: string;
    endDate: string;
    clientName: string;
    category: string;
    members: string[];
    costs: {
        rest: number;
        food: number;
        rental: number;
        otherCost: number;
    };
};

export type CompanyTypes = {
    id: number;
    image: string;
    name: string;
    personnelCount: number;
    categoryGroup: string;
    cities: string[];
    createdAt: string;
    managers: {
        id: number;
        name: string;
        role: string;
    }[];
    products: {
        id: string;
        name: string;
        category: string;
    }[];
    activeLeads: number;
    email: string;
    projects: ProjectType[]; // Add projects field
};

export const mockCompanies: CompanyTypes[] = [
    {
        id: 1001,
        image: "@/assets/person.jpg",
        name: "TechCorp Japan",
        personnelCount: 0,
        categoryGroup: "Technology",
        cities: ["Tokyo", "Osaka"],
        createdAt: "2024.01.15",
        managers: [
            { id: 12, name: "ABC", role: "Project Manager" },
            { id: 17, name: "ABC", role: "Technical Lead" },
        ],
        products: [
            { id: "P1", name: "Cloud Services", category: "Software" },
            { id: "P2", name: "IT Consulting", category: "Services" },
        ],
        activeLeads: 0,
        email: "contact@techcorp.jp",
        projects: [
            {
                id: 1,
                projectName: "Cloud Platform UI Redesign",
                manager: "ABC",
                startDate: "2024.01.20",
                endDate: "2024.06.20",
                clientName: "TechCorp Japan",
                category: "Software",
                members: ["ABC", "DEF"],
                costs: {
                    rest: 50000,
                    food: 20000,
                    rental: 100000,
                    otherCost: 30000,
                },
            },
            {
                id: 2,
                projectName: "IT Infrastructure Upgrade",
                manager: "ABC",
                startDate: "2024.02.01",
                endDate: "2024.08.01",
                clientName: "TechCorp Japan",
                category: "Infrastructure",
                members: ["ABC", "GHI"],
                costs: {
                    rest: 70000,
                    food: 25000,
                    rental: 120000,
                    otherCost: 40000,
                },
            },
        ],
    },
    {
        id: 1002,
        image: "@/assets/person.jpg",
        name: "Creative Solutions",
        personnelCount: 0,
        categoryGroup: "Design",
        cities: ["Fukuoka", "Tokyo"],
        createdAt: "2024.01.20",
        managers: [{ id: 45, name: "ABC", role: "Creative Director" }],
        products: [
            { id: "P3", name: "UI/UX Design", category: "Design" },
            { id: "P4", name: "Brand Strategy", category: "Marketing" },
        ],
        activeLeads: 0,
        email: "info@creative-solutions.jp",
        projects: [
            {
                id: 3,
                projectName: "Brand Identity Redesign",
                manager: "ABC",
                startDate: "2024.01.25",
                endDate: "2024.05.25",
                clientName: "Creative Solutions",
                category: "Design",
                members: ["ABC", "JKL"],
                costs: {
                    rest: 30000,
                    food: 15000,
                    rental: 80000,
                    otherCost: 20000,
                },
            },
        ],
    },
];