import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import workspaceReducer from "./slices/workspaceSlice"
import employeeReducer from "./slices/employeeSlice"
import userReducer from "./slices/userSlice"
import performanceReducer from "./slices/performanceSlice"
import payrollReducer from './slices/payrollSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        workspace: workspaceReducer,
        employee: employeeReducer,
        performance: performanceReducer,
        payroll: payrollReducer,
    }

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;