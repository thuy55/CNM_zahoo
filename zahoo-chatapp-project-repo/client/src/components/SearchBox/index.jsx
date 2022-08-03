import { IconButton, InputBase, List, Toolbar } from '@material-ui/core'
import { GroupAdd, PersonAdd, Search } from '@material-ui/icons'
import React, { useCallback, useState } from 'react'
import  useStyles from './styles'
import {useDispatch, useSelector} from 'react-redux'
import {showAddFriendModal, showAddGroupModal} from './../../redux/actions/modalAction'
import { search } from '../../redux/actions/conversationsAction'
function SearchBox({setIsSearch}) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {auth} = useSelector(state => state)
    const [inputSearch, setInputSearch] = useState('')

    const handleAddFriend = () => {
        dispatch(showAddFriendModal())
    }
    const handleAddGroupChat = () => {
        dispatch(showAddGroupModal())
    }
    const handleSearch = useCallback( (e) => {
        const text = e.target.value

        if(text ===''){
            setIsSearch(false)
            setInputSearch('')
            return
        }
        setInputSearch(text)
        setIsSearch(true)
        dispatch(search(inputSearch, auth))
    },[dispatch,inputSearch,auth,setIsSearch])
    return (
        <>
            <Toolbar style={{padding:"0"}}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Search />
                    </div>
                    <InputBase
                    placeholder="Tìm kiếm..."
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    // inputProps={{ 'aria-label': 'search' }}
                    value={inputSearch}
                    onChange={handleSearch}
                    />
                </div>
                <List>
                    <IconButton onClick={handleAddFriend}>
                        <PersonAdd color="primary"/>
                    </IconButton>
                    <IconButton onClick={handleAddGroupChat}>
                        <GroupAdd color="primary"/>
                    </IconButton>
                </List>
        </Toolbar>
        </>
    )
}

export default SearchBox
