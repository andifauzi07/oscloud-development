import { EmployeeTypes, mockEmployees } from "./employees";

export interface CategoryItem {
    id: string;
    name: string;
    score: number;
}

export interface Category {
    id: string;
    name: string;
    items: CategoryItem[];
    weight: number;
    color: string;
    score: number;
}

export interface TemplateType {
    id: string;
    name: string;
    created_at: string;
    categories: Category[];
}

export interface PerformanceSheet {
    id: number;
    employeeId: number;
    name: string;
    templateId: string;
    date: string;
    scores: Record<string, Record<string, number>>; // categoryId -> { itemId: score }
}

// Helper function to generate random scores for a template
const generateScoresForTemplate = (template: TemplateType): Record<string, Record<string, number>> => {
    return template.categories.reduce((categoryScores, category) => ({
        ...categoryScores,
        [category.id]: category.items.reduce((itemScores, item) => ({
            ...itemScores,
            [item.id]: Math.floor(Math.random() * (95 - 70) + 70)
        }), {})
    }), {});
};

// Helper function to generate performance sheets for all employees
const generatePerformanceSheetsForEmployees = (
    employees: EmployeeTypes[],
    templates: TemplateType[]
): PerformanceSheet[] => {
    let sheetId = 1;
    const sheets: PerformanceSheet[] = [];

    employees.forEach((employee) => {
        // Generate two sheets per employee with different templates
        templates.forEach((template, index) => {
            const baseDate = new Date();
            baseDate.setMonth(baseDate.getMonth() - index); // One month apart

            sheets.push({
                id: sheetId++,
                employeeId: employee.id,
                name: `${employee.contact}'s ${template.name} Review`,
                templateId: template.id,
                date: baseDate.toISOString().split("T")[0].replace(/-/g, "."),
                scores: generateScoresForTemplate(template),
            });
        });
    });

    return sheets;
};

export const mockTemplates: TemplateType[] = [
    {
        id: "1",
        name: "Standard Performance Template",
        created_at: "2024.01.15",
        categories: [
            {
                id: "cat1",
                name: "Technical Skills",
                items: [
                    { id: "item1", name: "Programming", score: 85 },
                    { id: "item2", name: "Problem Solving", score: 78 },
                    { id: "item3", name: "Code Quality", score: 92 },
                ],
                weight: 40,
                color: "#4f46e5",
                score: 85
            },
            {
                id: "cat2",
                name: "Soft Skills",
                items: [
                    { id: "item4", name: "Communication", score: 88 },
                    { id: "item5", name: "Teamwork", score: 75 },
                    { id: "item6", name: "Leadership", score: 82 },
                ],
                weight: 30,
                color: "#06b6d4",
                score: 82
            },
            {
                id: "cat3",
                name: "Work Ethics",
                items: [
                    { id: "item7", name: "Punctuality", score: 90 },
                    { id: "item8", name: "Reliability", score: 85 },
                    { id: "item9", name: "Initiative", score: 88 },
                ],
                weight: 30,
                color: "#10b981",
                score: 88
            }
        ]
    },
    {
        id: "2",
        name: "Management Performance Template",
        created_at: "2024.01.20",
        categories: [
            {
                id: "cat4",
                name: "Leadership Skills",
                items: [
                    { id: "item10", name: "Team Management", score: 90 },
                    { id: "item11", name: "Decision Making", score: 85 },
                ],
                weight: 50,
                color: "#f59e0b",
                score: 88
            },
            {
                id: "cat5",
                name: "Project Management",
                items: [
                    { id: "item12", name: "Planning", score: 88 },
                    { id: "item13", name: "Execution", score: 75 },
                    { id: "item14", name: "Monitoring", score: 92 },
                ],
                weight: 50,
                color: "#ef4444",
                score: 85
            }
        ]
    }
];

/**
 * Generated performance sheets will look like this:
 * [
 *   {
 *     id: 1,
 *     employeeId: 12,  // References Tanaka
 *     name: "tanaka's Standard Performance Template Review",
 *     templateId: "template1",
 *     date: "2024.02.15",
 *     scores: {
 *       "cat1": {
 *         "item1": 85,
 *         "item2": 78,
 *         "item3": 92
 *       },
 *       "cat2": {
 *         "item4": 88,
 *         "item5": 75,
 *         "item6": 82
 *       },
 *       "cat3": {
 *         "item7": 90,
 *         "item8": 85,
 *         "item9": 88
 *       }
 *     }
 *   },
 *   {
 *     id: 2,
 *     employeeId: 12,  // Same employee gets another sheet with different template
 *     name: "tanaka's Management Performance Template Review",
 *     templateId: "template2",
 *     date: "2024.01.15",  // One month apart
 *     scores: {
 *       "cat4": {
 *         "item10": 90,
 *         "item11": 85
 *       },
 *       "cat5": {
 *         "item12": 88,
 *         "item13": 75,
 *         "item14": 92
 *       }
 *     }
 *   },
 *   // ... continues for all employees
 * ]
 */
export const mockPerformanceSheets: PerformanceSheet[] =
    generatePerformanceSheetsForEmployees(mockEmployees, mockTemplates);
