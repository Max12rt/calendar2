import { combineReducers } from "redux";
import authCopy from "./authCopy";
import calendarCopy from "./calendarCopy";
import uiCopy from "./uiCopy";

const rootCopy = combineReducers({
  auth: authCopy,
  ui: uiCopy,
  calendar: calendarCopy,
});

export default rootCopy;
