import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import workspaceReducer from "./slices/workspaceSlice"
import employeeReducer from "./slices/employeeSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        employee: employeeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;