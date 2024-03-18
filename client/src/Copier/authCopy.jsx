import types from "../types";

const initialState = {
  checking: true,
  calendars: [],
  color: '',
};

const authCopy = (state = initialState, action) => {
  switch (action.type) {
    case types.authLogin:
      return {
        ...state,
        ...action.payload,
        calendars: action.payload.calendars || [],
      };
    case types.authCheckingFinish:
      return {
        ...state,
        checking: false,
      };

    case types.authLogout:
      return {
        checking: false,
      };
    case types.AUTH_SET_COLOR:
      return {
        ...state,
        color: action.payload.color,
      };

    default:
      return state;
  }
};

export default authCopy;
