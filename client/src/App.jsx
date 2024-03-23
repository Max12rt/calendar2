import { Provider } from "react-redux";

import store from "./store";
import React, { useState } from "react"
import AppRouter from "./routers/AppRouter";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};
export default App;
