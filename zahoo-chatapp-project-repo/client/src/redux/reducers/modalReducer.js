import { GLOBALTYPES } from './../actionType'

export default function modalReducers(state = {
    isShowAddFriendModal: false,
    isShowAddGroupModal: false,
    isShowMoreInfoConversation: false,
    isShowChangeGroupName: false,
    isShowAddFriendToGroupModal:false,
}, action) {
    switch (action.type) {
      case GLOBALTYPES.SHOW_ADDFRIEND_MODAL:
        return {
          isShowAddFriendModal: true,
        };
      case GLOBALTYPES.SHOW_ADDGROUP_MODAL:
        return {
          isShowAddGroupModal: true,
        };
      case GLOBALTYPES.SHOW_CHANGE_GROUP_NAME_MODAL:
        return {
          isShowChangeGroupName: true,
        };
      case GLOBALTYPES.TOGGLE_MORE_INFO_CONVERSATION:
        return {
          isShowMoreInfoConversation: action.payload,
        };
      case GLOBALTYPES.HIDE_MODAL:
        return {
          isShowAddFriendModal: false,
          isShowAddGroupModal: false,
          isShowChangeGroupName:false,
          isShowAddFriendToGroupModal:false
        };
      case GLOBALTYPES.SHOW_ADD_FRIEND_TO_GROUP_MODAL:
        return {
          isShowAddFriendToGroupModal:true,
      
        };
      default:
        return state;
    }
  }