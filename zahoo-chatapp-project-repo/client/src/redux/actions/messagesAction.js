import { getDataAPI, postDataAPI } from "../../api";
import { GLOBALTYPES } from "./../actionType";

//  GET MESSAGES BY ID
export const getMessagesByConversationId =
  (conversationId, token, page = 1) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `messages/${conversationId}?page=${page}&limit=${12}`,
        token
      );

      dispatch({
        type: GLOBALTYPES.GET_MESSAGES_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.log("err:",err)
      // dispatch({
      //   type: GLOBALTYPES.ALERT,
      //   payload: {
      //     error: err,
      //   },
      // });
    }
  };

export const loadMoreMessages =
  (conversationId, token, page = 1) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `messages/${conversationId}?page=${page}&limit=${12}`,
        token
      );
      // const newData = {...res.data, data: res.data.data}

      dispatch({ type: GLOBALTYPES.UPDATE_MESSAGES, payload: res.data });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

// ADD MESAGE
export const addMesage =
  ({ data, auth, socket, member }) =>
  async (dispatch) => {
    try {
      // add msg
      const msg = await postDataAPI("messages", data, auth.token);

      dispatch({
        type: GLOBALTYPES.ADD_MESSAGE,
        payload: data,
      });

      dispatch({
        type: GLOBALTYPES.UPDATE_LAST_MSG,
        payload: {
          _id: msg.data._id,
          conversation: msg.data.conversation,
          text: msg.data.text,
          updatedAt: msg.data.updatedAt,
        },
      });

      socket.emit("addMessage", { data, member });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err,
        },
      });
    }
  };
