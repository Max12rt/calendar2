import types from "../types";

const initialState = {
  modalOpen: false,
  msgError: ""
};

const uiCopy = (state = initialState, action) => {
  switch (action.type) {
    case types.uiSetError:
      return {
        ...state,
        msgError: action.payload,
      };

    case types.uiRemoveError:
      return {
        ...state,
        msgError: "",
      };
    case types.uiOpenModal:
      return {
        ...state,
        modalOpen: true,
      };
    case types.uiCloseModal:
      return {
        ...state,
        modalOpen: false,
      };
    default:
      return state;
  }
};

export default uiCopy;
