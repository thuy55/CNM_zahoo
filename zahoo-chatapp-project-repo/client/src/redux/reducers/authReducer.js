import { postDataAPI } from '../../api';
import { GLOBALTYPES } from './../actionType'

const initialState = {
    user:null,
    token:null
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case GLOBALTYPES.AUTH:
            return action.payload;
        case GLOBALTYPES.REGISTER:
            return action.payload;
        case GLOBALTYPES.UPDATE_FRIENDS_QUEUE:{
            let _friendsQueue = state.user.friendsQueue
            _friendsQueue.push(action.payload)
            return {
                ...state,
                user:{...state.user,friendsQueue: _friendsQueue}
            }
        }
        case GLOBALTYPES.UPDATE_FRIENDS:{
            let _friends = state.user.friends
            _friends.push(action.payload)
            return {
                ...state,
                user:{...state.user,friends: _friends}
            }
        }
        case GLOBALTYPES.ACCEPT_ADD_FRIEND:{
            state.user.friends.push(action.payload)

            const _friendsQueue = state.user.friendsQueue
            const index = _friendsQueue.findIndex((el) => el._id === action.payload)
            if(index !== -1){
                _friendsQueue.splice(index, 1)
            }
            return {
                ...state,
                user:{...state.user,friendsQueue: _friendsQueue}
            }
        }
        case GLOBALTYPES.DENIED_ADD_FRIEND:{

            const _friendsQueue = state.user.friendsQueue
            const index = _friendsQueue.findIndex((el) => el._id === action.payload)
            if(index !== -1){
                _friendsQueue.splice(index, 1)
            }
            return {
                ...state,
                user:{...state.user,friendsQueue: _friendsQueue}
            }
        }
        
        case GLOBALTYPES.ACTIVE_USER_TO_CLIENT:{

         
            if(state.user?._id === action.payload._id){
                return {
                    ...state,
                    user:{...state.user,status: action.payload.status}
                }
            }
            try  {
                localStorage.removeItem('firstLogin')
                 postDataAPI('auth/logout')
                window.location.href = "/login"
            } catch (err) {
               console.log("err:", err)
            }
            return {...state}
            
        }

        default:
            return state;
    }
}


export default authReducer