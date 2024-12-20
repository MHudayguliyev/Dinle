import { configureStore } from '@reduxjs/toolkit';
import MediaReducer from './reducers/MediaReducer';
import AuthReducer from './reducers/AuthReducer';
import OverflowReducer from './reducers/OverflowReducer';
import SidebarReducer from './reducers/SidebarReducer';

const store = configureStore({
    reducer: {
        mediaReducer: MediaReducer, 
        authReducer: AuthReducer, 
        overflowReducer: OverflowReducer, 
        sidebarReducer: SidebarReducer
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}) 
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {themeReducer: ThemeReducer }
export type AppDispatch = typeof store.dispatch;