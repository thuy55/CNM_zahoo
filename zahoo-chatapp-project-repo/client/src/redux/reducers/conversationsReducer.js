import { GLOBALTYPES } from './../actionType'

const initialState = {
    data:[]
}

const conversationsReducer = (state = initialState, action) => {
    switch (action.type){
        case GLOBALTYPES.GET_CONVERSATIONS_SUCCESS:
            return action.payload;
        case GLOBALTYPES.POST_CONVERSATION:
            return {
                ...state,
                data:[action.payload,...state.data]
            };
        case GLOBALTYPES.UPDATE_LAST_MSG:{
            const msg = action.payload
            const convers = [...state.data]

            const index = convers.findIndex((el) => el._id === msg.conversation)
            if(index !== -1){
                convers[index] = {
                    ...convers[index],
                    lastMessage:msg
                }
            }
            return {
                ...state,
                data:[...convers]
            }
        }
        case GLOBALTYPES.UPDATE_COUNT_WAITING_MESSAGE:{
            const convers = [...state.data] 
            const index = convers.findIndex((el) => el._id === action.payload)
            if(index !== -1){
                let count_waiting_msg = convers[index].count_waiting_msg? convers[index].count_waiting_msg+1:1
                convers[index] = {
                    ...convers[index],
                    count_waiting_msg:count_waiting_msg
                }
            }
            return {
                 ...state,
                data:[...convers]
            }
        }
        case GLOBALTYPES.REMOVE_COUNT_WAITING_MESSAGE:{
            const convers = [...state.data] 
            const index = convers.findIndex((el) => el._id === action.payload)
            if(index !== -1){
                convers[index] = {
                    ...convers[index],
                    count_waiting_msg:undefined
                }
            }
            return {
                 ...state,
                data:[...convers]
            }
        }
        case GLOBALTYPES.CHANGE_GROUP_NAME_OF_CONVERSATION_IN_LIST_CONVERSATION:{
            const{conversationId,newLabel} =action.payload
            const convers = [...state.data] 
            const index = convers.findIndex((el) => el._id === conversationId)
            if(index !== -1){
                convers[index] = {
                    ...convers[index],
                    label:newLabel
                }
            }
            return {
                 ...state,
                data:[...convers]
            }
        }
        case GLOBALTYPES.OUT_GROUP_TO_CLIENT:{
            const{conversation,memberID} =action.payload          
            const convers = [...state.data] 
            const index = convers.findIndex((el) => el._id === conversation._id)
            
            if(index !== -1){
                convers[index] = {
                    ...convers[index],
                    member:convers[index].member.filter(m=> m._id !== memberID)
                }
            }
            return {...state,
                data:[...convers]}
        }
        case GLOBALTYPES.OUT_GROUP:{
        
            return {...state,
                data: state.data.filter(c=> c._id !== action.payload._id)}
        }
        case GLOBALTYPES.DELETE_GROUP:{
        
            return {...state,
                data: state.data.filter(c=> c._id !== action.payload._id)}
        }
        case GLOBALTYPES.DELETE_GROUP_TO_CLIENT:{
        
            return {...state,
                data: state.data.filter(c=> c._id !== action.payload.conversation._id)}
        }

        case GLOBALTYPES.UPDATE_CURRENT_CONVERSATION_ADD_MEMBER:{
            const {conversation, member} = action.payload
            // process here
            // const newMember = state.data.member.concat(member)
            const convers = [...state.data] 
            const index = convers.findIndex((el) => el._id === conversation._id) 
            if(index !== -1){
                convers[index] = {
                    ...convers[index],
                    member: convers[index].member.concat(member)
                }
            }
            return {
                 ...state,
                data:[...convers]
            }
        }
        
        case GLOBALTYPES.ADD_MEMBER_GROUP_TO_CLIENT:{
            let {conversation, member} = action.payload
            const convers = [...state.data] 

            if(convers.filter((el) => el._id === conversation._id).length >0 )
            {
              const  index = convers.findIndex((el) => el._id === conversation._id)
              if(index !==-1){
                convers[index] = {
                    ...convers[index],
                    member:convers[index].member.concat(member)
                  }
              }
                return {
                    ...state,
                   data:[...convers]
               }
            }
        
            else {
                
                conversation.member.concat(member)
                return {
                  data: [conversation, ...state.data]
                }
            }
            
        }


        default:
            return state;
    }
}


export default conversationsReducer