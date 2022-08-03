import { getDataAPI, postDataAPI } from '../../api'
import { GLOBALTYPES } from '../actionType'

//  GET USER BY SDT
export const getUserByPhoneNumber = (phoneNumber,token) => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.GET_USER_REQUEST,  
        })
        const res = await getDataAPI(`users/phone/${phoneNumber}`, token)
       
        dispatch({ 
            type: GLOBALTYPES.GET_USER_SUCCESS, 
            payload: res.data
        })

    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.GET_USER_ERR, 
            payload: err.response.data.msg
        })
    }
}
//  requestAddFriend
export const requestAddFriend = (friendId,user,token,socket) => async dispatch => {
    try {
        const data = {
            userId:user._id
        }
        dispatch({ 
            type: GLOBALTYPES.ALERT,  
            payload: {loading: true} 
        })
        await postDataAPI (`users/request-add-friend/${friendId}`, data, token)
        dispatch({ 
            type: GLOBALTYPES.REQUEST_ADD_FRIEND, 
            payload: { 
                data: data.userId
            } 
        })
        dispatch({ 
            type: GLOBALTYPES.ALERT,  
            payload: {loading: false} 
        })
        socket.emit("requestAddFriend", {
            sender:{
                _id:user._id,
                username:user.username,
                profilePicture:user.profilePicture
            },
            recipient:friendId,
            msg:`${user.username} đã gửi yêu cầu kết bạn.`
        });
       
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}
//  REMOVE STATE USER 
export const removeUserState = () => async dispatch => {
    try {
       
        dispatch({ 
            type: GLOBALTYPES.REMOVE_USER_SUCCESS, 
            payload: { 
                data: null
            } 
        })
       
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}