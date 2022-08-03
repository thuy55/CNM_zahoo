import { List, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import OnlineFriendsHori from '../OnlineFriendsHori'
import SearchBox from '../SearchBox'
import ChatRoom from './ChatRoom'
import FriendVertical from './FriendVertical'
import useStyles from './styles'
function ChatControl() {
    const classes = useStyles()
    const location = useLocation()
    const {data} = useSelector(state => state.conversations)
    const {user} = useSelector(state => state.auth)
    const friendCount = user?.friends.length
    const friends = user?.friends

    const [isSearch, setIsSearch] = useState(false)
    const conversations = data
    return (
        <div className={classes.chatControl}>
            <SearchBox setIsSearch={setIsSearch}/> 
            {!isSearch && 
                <>
                    <OnlineFriendsHori/> 
                    <List className={classes.body}>
                        {location.pathname ==='/phonebook'?
                              <div>
                                  <Typography  variant="body" component="h3"color="textPrimary" >{`Bạn bè(${friendCount})`}</Typography> 
                                    {friends?.map(e => (
                                        <FriendVertical friend={e}/>
                                    ))}
                              </div>
                              :
                              <div>
                                  <Typography  variant="body" component="h3"color="textPrimary" >Hội thoại</Typography> 
                                { conversations.length >0 &&
                                    conversations?.map(e => (
                                        
                                        <ChatRoom conversation={e} key={e._id}/>
                                    ))
                                    // :[...Array(10)].map(()=> (
                                    //     <Skeleton variant="rect" animation="wave" width="100%" height={65} style={{margin:".5rem auto"}}/> 
                                    // )) 
                                }
                              </div>
                        }
                    </List>
                </>
            }
            
        </div>
    )
}

export default ChatControl
