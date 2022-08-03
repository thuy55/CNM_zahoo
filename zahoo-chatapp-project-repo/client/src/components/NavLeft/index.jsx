import { Avatar, Badge, Divider, List, ListItem } from '@material-ui/core'
import { Contacts, ExitToApp, Settings, Sms } from '@material-ui/icons'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { logout } from '../../redux/actions/authAction'
import useStyles from './styles'


function NavLeft() {
    
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const {auth} = useSelector(state => state)
    const countWaitingAddFriend = auth.user?.friendsQueue.length
    const navItems = [
        {
            icon: <Sms color="secondary" />,
            badge:0,
            path: '/messenger'
        },
        {
            icon: <Contacts color="secondary" />,
            badge:countWaitingAddFriend,
            path: '/phonebook'
        },
        // {
        //     icon: <Notifications color="secondary" />,
        //     badge:countWaitingAddFriend,
        //     path: '/notify'
        // },
    ]

    const handleClickItem = (path)=> {
        history.push(path)
    }
    const handleLogout = ()=> {
        dispatch(logout())
    }
    const handleSetting = ()=> {
        alert("setting")
    }
    return (
        <div className={classes.navleft}>
            <Avatar className={classes.avatar} src={process.env.PUBLIC_URL+"logo1.png"} />
            <Divider/>
            <div className={classes.list}>
                {/* LIST ITEM */}
                <List component="nav" aria-label="nav-left">
                    {navItems.map((item, i)=> (
                        <ListItem 
                        button 
                        selected={location.pathname === item.path? true: false}
                        key={i}
                        onClick={()=> handleClickItem(item.path)}
                        >
                        <Badge badgeContent={item.badge} color="error">
                            {item.icon}
                        </Badge>
                    </ListItem>
                    ))}
                </List>
                {/* LIST ACTION */}
                <List component="nav" aria-label="nav-left" >
                    <Divider/>
                    <ListItem 
                        button 
                        onClick={handleLogout}
                    >
                        <ExitToApp color="secondary"/>
                    </ListItem>
                    <ListItem 
                        button 
                        onClick={handleSetting}
                    >
                        <Settings color="secondary"/>
                    </ListItem>
                   
                </List>
            </div>
        </div>
    )
}

export default NavLeft
