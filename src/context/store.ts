import { configureStore } from "@reduxjs/toolkit";

//W---------={ Store }=----------</br>
export const store = configureStore({
  reducer: {},
});

//W---------={ RootState and AppDispatch }=----------</br>
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
