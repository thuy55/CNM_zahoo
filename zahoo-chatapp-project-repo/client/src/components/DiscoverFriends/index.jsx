import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { Check, Close } from '@material-ui/icons'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { acceptAddFriend, deniedAddFriend } from '../../redux/actions/authAction'
import FriendCard from './FriendCard'
import useStyles from './styles'
function DiscoverFriends() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const { auth,socket} = useSelector(state => state)
    const friendsQueue = auth?.user.friendsQueue
    const handleDeniedAddFriend = React.useCallback((id) => {
        dispatch(deniedAddFriend(id, auth,socket))
    },[dispatch,auth,socket])
    const handleAgreeAddFriend = React.useCallback((id) => {
        dispatch(acceptAddFriend(id,auth,socket))
        history.push('/messenger')
    },[dispatch, auth,history,socket])

    const list = useSelector((state) => state.suggessFriendReducer.data);
    return (

        <div className={classes.discoverFriends}>
            <div className={classes.friendsQueue}>
                <Typography variant="body" component="h3">{`Lời mời kết bạn(${friendsQueue.length})`}</Typography>
                <List className={classes.listItem}>
                    {friendsQueue.map((item,index)=> (
                        <ListItem className={classes.item}>
                            <ListItemAvatar>
                                <Avatar src={item?.profilePicture} alt="avatar" onClick={()=> alert(2)} />
                            </ListItemAvatar>
                            <ListItemText primary={item?.username} secondary={item?.phoneNumber} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="denied" onClick={()=>handleDeniedAddFriend(item._id)}>
                                    <Close/>
                                </IconButton>
                                <IconButton edge="end" aria-label="agree" onClick={()=>handleAgreeAddFriend(item._id)}>
                                    <Check/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
            <div className={classes.friendsSuggestion}>
                <Typography variant="body" component="h3">{`Gợi ý kết bạn(${list.length})`}</Typography>
                <Grid container spacing={2}>
                    {
                       list.map((user_result, index)=>(
                        <Grid item xs={3} key={index} >
                            <FriendCard user_result={user_result}/>
                        </Grid>
                        ))
                    }
                   
                   
                </Grid>
            </div>
        </div>
    )
}

export default DiscoverFriends
