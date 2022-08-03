import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { Check, Close } from '@material-ui/icons'
import React from 'react'
import { useSelector } from 'react-redux'
import NavLeft from '../../components/NavLeft'
import {useDispatch} from 'react-redux'
import { acceptAddFriend, deniedAddFriend } from '../../redux/actions/authAction'
import useStyles from './styles'
import { useHistory } from 'react-router'
const NotifyPage =()=>{
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const {auth} = useSelector(state => state)
    const handleDeniedAddFriend = React.useCallback((id) => {
        dispatch(deniedAddFriend(id, auth))
    },[dispatch,auth])
    const handleAgreeAddFriend = React.useCallback((id) => {
        dispatch(acceptAddFriend(id,auth))
        history.push('/messenger')
    },[dispatch, auth,history])
    return (
        <div className={classes.notify}>
            <NavLeft/>
            <List style={{flex:"1",padding:"1rem"}}>
                <Typography variant="body" component="h3">Yêu cầu kết bạn</Typography>
                {auth.user?.friendsQueue.map((item,index)=> (
                    <ListItem style={{backgroundColor:"grey", width:"100%"}}>
                       <ListItemAvatar>
                            <Avatar src={item?.profilePicture} alt="avatar" onClick={()=> alert(2)} />
                        </ListItemAvatar>
                        <ListItemText primary={item.username} secondary={item.phoneNumber} />
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
                 <List style={{flex:"1",padding:"1rem"}}>
                    <Typography variant="body" component="h3">Thông báo</Typography>
                </List>
            </List>
           
        </div>
    )
}
export default NotifyPage
