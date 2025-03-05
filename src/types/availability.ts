export interface TimeSlot {
    start: string;
    end: string;
}

export interface Availability {
    availabilityId: number;
    employeeId: number;
    employeeName: string;
    date: string;
    timeSlot: TimeSlot;
}

export interface AvailabilityFilters {
    startDate?: string;
    endDate?: string;
    employeeId?: number;
}

export interface AvailabilityState {
    availability: Availability[];
    selectedAvailability: Availability | null;
    total: number;
    currentPage: number;
    limit: number;
    loading: boolean;
    error: string | null;
}

export interface CreateAvailabilityData {
    employeeId: number;
    date: string;
    timeSlot: TimeSlot;
}

export interface UpdateAvailabilityData {
    date?: string;
    timeSlot?: TimeSlot;
}