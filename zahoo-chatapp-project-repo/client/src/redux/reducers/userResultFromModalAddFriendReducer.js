import { GLOBALTYPES } from "../actionType";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GLOBALTYPES.GET_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case GLOBALTYPES.GET_USER_ERR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GLOBALTYPES.REMOVE_USER_SUCCESS:
      return action.payload;
    case GLOBALTYPES.REQUEST_ADD_FRIEND: {
      const id = action.payload.data;
      return {
        data: { ...state.data, friendsQueue: [...state.data.friendsQueue, id] },
      };
    }
    default:
      return state;
  }
};

export default userReducer;
