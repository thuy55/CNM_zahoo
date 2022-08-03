import {GLOBALTYPES } from './../actionType'

//SHOW ADD FRIEND MODAL
export const showAddFriendModal = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.SHOW_ADDFRIEND_MODAL, 
        })
    } catch (err) {
       
    }
}
//SHOW ADD GROUP MODAL
export const showAddGroupModal = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.SHOW_ADDGROUP_MODAL, 
        })
    } catch (err) {
       
    }
}
//SHOW CHANGE GROUP NAME MODAL
export const showChangeGroupNameModal = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.SHOW_CHANGE_GROUP_NAME_MODAL, 
        })
    } catch (err) {
       
    }
}
// HIDE MODAL
export const hideModal = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.HIDE_MODAL, 
        })
       
    } catch (err) {
       
    }

    
}
//SHOW ADD FRIEND TO GROUP MODAL
export const showAddFriendToGroupModal = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.SHOW_ADD_FRIEND_TO_GROUP_MODAL, 
        })
    } catch (err) {
       
    }
}