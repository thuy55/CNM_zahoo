import {GLOBALTYPES } from '../actionType'

//SHOW ADD FRIEND MODAL
export const notifyRequestAddFriend = () => async dispatch => {
    try {
        dispatch({ 
            type: GLOBALTYPES.NOTIFY, 
            action:'notify'
        })
    } catch (err) {
       
    }
}
