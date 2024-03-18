import { configureStore } from "@reduxjs/toolkit";
import rootCopy from "../Copier/rootCopy";

const store = configureStore({
  reducer: rootCopy,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
