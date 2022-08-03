import { Avatar, Badge, Divider, IconButton, List, Typography, withStyles } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversationWithFriend } from '../../redux/actions/conversationsAction'
import useStyles from './styles'
function OnlineFriends() {
    const classes = useStyles()
    const {auth} = useSelector(state => state)
    const {online} = useSelector(state => state)
    const dispatch = useDispatch()

    const StyledBadge = withStyles((theme) => ({
        badge: {
          backgroundColor: '#44b700',
          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            content: '""',
          },
        },
      }))(Badge);

    const handleOpenChat  = React.useCallback((friendId) => {
      dispatch(getConversationWithFriend(friendId,auth))
    },[dispatch,auth])
    return (
       <>
        <Divider/>
         <div  className={classes.onlineFriends}>
            <div className={classes.title}>
                <Typography  variant="body" component="h3"color="textPrimary" >Trực tuyến</Typography>
                <span>{online.length}</span>
            </div>
            <List className={classes.list}>
            {online.map(item => (
                 <IconButton key ={item.id} onClick={()=>handleOpenChat(item.id)}>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                        }}
                        variant="dot"
                    >  
                        <Avatar src={item.profilePicture}></Avatar>
                    </StyledBadge>
                </IconButton>

                ))}
            </List>
        </div>
        <Divider/>
       </>
    )
}

export default OnlineFriends
