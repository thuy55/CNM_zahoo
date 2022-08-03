import { Avatar, Badge, List, ListItem, Typography } from '@material-ui/core'
import { GroupAdd, Label, More, Phone, Videocam } from '@material-ui/icons'
import { AvatarGroup } from '@material-ui/lab'
import { withStyles } from '@material-ui/styles'
import moment from 'moment'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showAddFriendToGroupModal } from '../../../redux/actions/modalAction'
import { GLOBALTYPES } from '../../../redux/actionType'
import useStyles from './styles'
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
const checkUserOnline = (online,userId) => {
return online.find(item => item.id ===userId)?true: false
} 
function ChatHeader({currentConversation,auth}) {
    const classes = useStyles()
    const  dispatch = useDispatch()
    const {isShowMoreInfoConversation} = useSelector(state => state.modal)
    const {online} = useSelector(state => state)
    const {socket,peer} = useSelector(state => state)

    let {member} = currentConversation
    const isGroupChat =currentConversation.label
    const friends = member.filter(e=> e._id !== auth.user._id)
    const friendsCount = friends.length

    // Call
    const caller = ({video}) => {
        const { _id, profilePicture, username } = friends[0]

        const msg = {
            sender: auth.user._id,
            recipient: _id, 
            profilePicture, username,video
        }
        dispatch({ type: GLOBALTYPES.CALL, payload: msg })
    }

    const callUser = ({video}) => {
        const { _id, profilePicture, username } = auth.user

        const msg = {
            sender: _id,
            recipient: friends[0]._id, 
            profilePicture, username,video
        }

        if(peer.open) msg.peerId = peer._id

        socket.emit('callUser', msg)
    }

    const handleAddMember = () => {
       dispatch(showAddFriendToGroupModal())
    }
    const handlePhoneCall = () => {
        caller({video: false})
        callUser({video: false})
    }
    const handleVideoCall = () => {
        caller({video: true})
        callUser({video: true})

    }
    const toggleViewInfo = () => {
        dispatch({type:GLOBALTYPES.TOGGLE_MORE_INFO_CONVERSATION,payload:!isShowMoreInfoConversation})
    }
    return (
        <div className={classes.header}>
            <div className={classes.info}>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    }}
                    variant={ checkUserOnline(online,friends[0]?._id) && friendsCount === 1? `dot`: ''}
                >
                    <AvatarGroup max={2}>
                        {friends?.map(item => {
                            return <Avatar src={item?.profilePicture} key={item._id} alt="avatar"/>
                        })}
                    </AvatarGroup>
                </StyledBadge>
                <div className={classes.desc}>
                    <Typography className={classes.primary}>{currentConversation?.label? currentConversation.label:friends[0].username}</Typography>
                    <div className={classes.secondary}>
                        <Label color="primary" style={{marginRight:"0.5rem"}}/>
                        <span>{friendsCount===1? '': friendsCount+1}</span>
                    </div>
                </div>  
            </div>
           
            <List component="nav" aria-label="nav-left" className={classes.action}>
                {isGroupChat &&
                    <ListItem 
                        button 
                        onClick={handleAddMember}
                    >
                        <GroupAdd color="primary"/>
                    </ListItem>
                }
                {!isGroupChat &&
                    <ListItem 
                        button 
                        onClick={handlePhoneCall}
                    >
                        <Phone color="primary"/>
                    </ListItem>
                }
                {!isGroupChat &&
                    <ListItem 
                        button 
                        onClick={handleVideoCall}
                    >
                        <Videocam color="primary"/>
                    </ListItem>
                }
                <ListItem 
                    button 
                    onClick={toggleViewInfo}
                >
                    <More color="primary"/>
                </ListItem>
            </List>
        </div>
    )
}

export default ChatHeader
