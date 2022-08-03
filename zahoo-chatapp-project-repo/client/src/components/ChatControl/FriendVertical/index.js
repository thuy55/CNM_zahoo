import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversationWithFriend } from '../../../redux/actions/conversationsAction'

function FriendVertical({friend}) {
    const dispatch = useDispatch()
    const {auth} = useSelector(state => state)

    const handleOpenChat  = React.useCallback((friendId) => {
        dispatch(getConversationWithFriend(friendId,auth))
      },[dispatch,auth])
    return (
        <ListItem button onClick={()=>handleOpenChat(friend._id)}  >
            <ListItemAvatar>
                <Avatar src={friend?.profilePicture} key={friend._id} alt="avatar" />
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
        </ListItem>
    )
}

export default FriendVertical
