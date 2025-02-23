import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";

export interface Point {
    pointid: number; // Changed from pointId
    categoryid: number; // Added
    pointname: string; // Changed from name
    weight: number;
}

export interface Category {
    categoryid: number; // Changed from categoryId
    templateid: number; // Added
    categoryname: string; // Changed from name
    points: Point[];
}

export interface Template {
    templateid: number; // Changed from templateId
    templatename: string; // Changed from templateName
    workspaceid: number; // Added
    categories: Category[];
}

export interface Score {
    pointid: number; // Changed from pointId
    score: number;
}

export interface PerformanceSheet {
    sheetId: number;
    employee: {
        employeeid: number; // Changed from employeeId
        name: string;
    };
    template: {
        templateid: number; // Changed from templateId
        templatename: string; // Changed from name
    };
    createdDate: string;
    scores: Score[];
    totalScore: number;
}

interface PerformanceState {
    templates: Template[];
    sheets: PerformanceSheet[];
    loading: boolean;
    error: string | null;
}

const initialState: PerformanceState = {
    templates: [],
    sheets: [],
    loading: false,
    error: null,
};

// --- Templates
export const fetchTemplates = createAsyncThunk(
    "performance/fetchTemplates",
    async (workspaceId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/performance/templates`
            );
            console.log(response.data);
            return response.data.templates;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch templates"
            );
        }
    }
);

export const createTemplate = createAsyncThunk(
    "performance/createTemplate",
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: {
                templatename: string; // Changed from templateName
                categories: {
                    categoryname: string; // Changed from name
                    points: {
                        pointname: string; // Changed from name
                        weight: number;
                    }[];
                }[];
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/performance/templates`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create template"
            );
        }
    }
);

export const updateTemplate = createAsyncThunk(
    "performance/updateTemplate",
    async (
        {
            workspaceId,
            templateId,
            data,
        }: {
            workspaceId: number;
            templateId: number;
            data: Partial<Template>;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.put(
                `/workspaces/${workspaceId}/performance/templates/${templateId}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to update template"
            );
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    "performance/deleteTemplate",
    async (
        {
            workspaceId,
            templateId,
        }: {
            workspaceId: number;
            templateId: number;
        },
        { rejectWithValue }
    ) => {
        try {
            await apiClient.delete(
                `/workspaces/${workspaceId}/performance/templates/${templateId}`
            );
            return templateId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to delete template"
            );
        }
    }
);

// --- Sheets
export const fetchSheets = createAsyncThunk(
    "performance/fetchSheets",
    async (
        {
            workspaceId,
            filters,
        }: {
            workspaceId: number;
            filters?: {
                employeeId?: number;
                templateId?: number;
                startDate?: string;
                endDate?: string;
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.get(
                `/workspaces/${workspaceId}/performance/sheets`,
                {
                    params: filters,
                }
            );
            return response.data.sheets;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch sheets"
            );
        }
    }
);

export const createSheet = createAsyncThunk(
    "performance/createSheet",
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: {
                employeeId: number;
                templateId: number;
                scores: Score[];
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/performance/sheets`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create sheet"
            );
        }
    }
);

const performanceSlice = createSlice({
    name: "performance",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch templates
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create template
            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.templates.push(action.payload);
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update template
            .addCase(updateTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.templates.findIndex(
                    (t) => t.templateid === action.payload.templateid
                );
                if (index !== -1) {
                    state.templates[index] = action.payload;
                }
            })
            .addCase(updateTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default performanceSlice.reducer;
