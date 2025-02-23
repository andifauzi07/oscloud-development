import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/apiClient";
import { number } from "zod";

export interface Company {
    companyid: number;
    name: string;
    logo: string;
    workspaceid: number;
    personnel: Personnel[];
    activeLeads: number;
    totalContractValue: number;
}

export interface Personnel {
    personnelid: number;
    companyid: number;
    name: string;
}

export interface Lead {
    leadid: number;
    companyid: number;
    status: string;
    contractvalue: number;
    personnelid: number;
    workspaceid: number;
    company: Company[];
    personnel: Personnel[];
}

// --- Company
export const createCompany = createAsyncThunk(
    `company/createCompany`,
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: Company;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/companies`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create company"
            );
        }
    }
);

// --- Leads
export const createLead = createAsyncThunk(
    `company/createLead`,
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: Lead;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                `/workspaces/${workspaceId}/crm/leads`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to create company"
            );
        }
    }
);

export const updateLead = createAsyncThunk(
    `company/updateLead`,
    async (
        {
            workspaceId,
            data,
        }: {
            workspaceId: number;
            data: Partial<Lead>;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.put(
                `/workspaces/${workspaceId}/crm/leads`
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to update lead"
            );
        }
    }
);
