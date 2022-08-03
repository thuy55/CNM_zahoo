import { postDataAPI } from '../../api'
import { GLOBALTYPES } from './../actionType'
import { postConversation } from './conversationsAction'


//  LOGIN
export const login = (data) => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT,  
            payload: {loading: true} 
        })

        const res = await postDataAPI('auth/login', data)
        
        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.accessToken,
                user: res.data.user
            } 
        })
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })

        localStorage.setItem("firstLogin", true)
    
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}
//  REGISTER
export const register = (data) => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.ALERT,  
            payload: {loading: true} 
        })

        const res = await postDataAPI('auth/register', data)

        dispatch({ 
            type: GLOBALTYPES.REGISTER, 
            payload: {
                token: res.data.accessToken,
                user: res.data.user
            } 
        })
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })

        localStorage.setItem("firstLogin", true)
    
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}



//refresh token
export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin){
        try {
            const res = await postDataAPI('auth/refresh_token')
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.accessToken,
                    user: res.data.user
                } 
            })
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    success: res.data.msg
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
}
export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')
        await postDataAPI('auth/logout')
        window.location.href = "/login"
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}
export const acceptAddFriend = (friendId, auth, socket) => async (dispatch) => {
    const {user} = auth
    try {
        dispatch({ 
            type: GLOBALTYPES.ACCEPT_ADD_FRIEND, 
            payload: friendId
        })
        const dataAddFriend ={
            userId:auth.user._id
        }
        const dataConver ={
            array:[auth.user._id,friendId]
        }
        await postDataAPI(`users/accept-add-friend/${friendId}`,dataAddFriend, auth.token)
        dispatch(postConversation(dataConver, auth.token))

        socket.emit("acceptAddFriend",{
            sender:{
                _id:user._id,
                username:user.username,
                profilePicture:user.profilePicture
            },
            recipient:friendId,
            msg:`${user.username} đã đồng ý yêu cầu kết bạn.`
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
export const deniedAddFriend = (friendId, auth, socket) => async (dispatch) => {
    try {
        dispatch({ 
            type: GLOBALTYPES.DENIED_ADD_FRIEND, 
            payload: friendId
        })
        const dataAddFriend ={
            userId:auth.user._id
        }
        await postDataAPI(`users/denied-add-friend/${friendId}`,dataAddFriend, auth.token)
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}
