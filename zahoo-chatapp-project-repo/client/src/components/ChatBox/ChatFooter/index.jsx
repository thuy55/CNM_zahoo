import { IconButton } from '@material-ui/core';
import { AttachFile, Close, Face, Image, Send } from '@material-ui/icons';
import Picker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI } from '../../../api';
import { addMesage } from '../../../redux/actions/messagesAction';
import { GLOBALTYPES } from '../../../redux/actionType';
import { fileShow, imageShow, videoShow } from '../../../util/mediaShow';
import Typing from '../../Alert/Typing';
import Alert from './../../Alert/Alert';
import useStyles from './styles';
function ChatFooter({currentConversationId}) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {auth} = useSelector(state => state)
    const {socket, typing} = useSelector(state => state)
    const {member,_id} = useSelector(state => state.currentConversation.data)
    const [input, setInput] = useState('')
    const [toggleEmoji, setToggleEmoji] = useState(false)
    const [media, setMedia] = useState([])
    const ref = useRef()
    var members =[]
    const listUserTuping = typing.filter(item => item.conversationId === _id)
    if(listUserTuping.length >0) {
        members = listUserTuping.map(item => item.sender)
    }
    const onEmojiClick = (e, emojiObject) => {
        setInput(input +emojiObject.emoji)
        setToggleEmoji(false)
    }
    useEffect(() => {
        ref.current.focus()
    }, [])
    
    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err =""
        let newMedia=[]
        files.forEach(file => {
            if(!file) return err ="Tệp không tồn lại"
            if(file.size  > 1024 * 1024 *5){
                return err ="Ảnh/Video tối đa 5mb"
            }
            return newMedia.push(file)
        })
        if(err) dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}})
        setMedia([...media, ...newMedia])
    }
    const handleDeleteMedia = (index) => {
        const newMedia = [...media]
        newMedia.splice(index,1)    
        setMedia(newMedia)
    }
    const handleChangeInput = (value) => {
        
        setInput(value)
        if(value ==='')
            socket.emit("offTypingText",{
                conversationId:_id,
                member:member.map(item=> item._id),
                sender:auth.user.username,
                // msg: `${auth.user.username} đang nhập tin nhắn`
            })
        else {
            socket.emit("onTypingText",{
                conversationId:_id,
                member:member.map(item=> item._id),
                sender:auth.user.username,
                // msg: `${auth.user.username} đang nhập tin nhắn`
            })
        }
    }

    const handleSubmitForm = async (e)=> {
        e.preventDefault()
        if (!input.trim() && media.length ===0) return
        let newArr =[]

        
        // post the image direclty to the s3 bucket
        if( media.length > 0) {
            const {data:{url}} = await getDataAPI('s3Url')
            await fetch(url, {  
                method: "PUT",
                headers: {
                "Content-Type": media[0].type
                },
                body: media[0]
            })
            const imageUrl = url.split('?')[0]
            newArr.push({
                url:imageUrl,
                type:media[0].type
            }) 
        }
        
        const {username,profilePicture, _id} = auth.user
        const data = {
            conversation:currentConversationId,
            sender:{username,profilePicture, _id},
            text:input,
            media: newArr,
           
        }
        dispatch(addMesage({data,auth,socket,member}))

        setInput('')
        setMedia([])
    }
    return (
        <div className={classes.footer}>
             <Alert/>
             {listUserTuping.length >0 &&  
                <div style={{display: "flex", alignItems:"center"}}>
                    <Typing/>
                    {
                       members
                    } đang nhập tin nhắn
                    
                </div>
             }
            <div className={classes.showMedia} style={{display: media.length > 0? 'grid':'none'}}>
                {media?.map((item, index)=> (
                    <div key={index}>
                        {
                            item.type.match(/video/i)
                            ?videoShow(URL.createObjectURL(item))
                            : item.type.match(/image/i)?
                                imageShow(URL.createObjectURL(item))
                                : fileShow(URL.createObjectURL(item))
                        }
                        <span onClick= {()=> handleDeleteMedia(index)}><Close/> </span>
                    </div>
                ))}
            </div>
            <form action="" className={classes.form} onSubmit={handleSubmitForm}>
                <div component="ul" aria-label="action" className={classes.actions} >
                   <label>
                        <Image color="primary"/>
                        <input type="file" name="file" id="file" multiple accept="image/*,video/*,.pdf,.doc" onChange={handleChangeMedia} className={classes.mediaInput} />
                   </label>
                    <label size="small" >
                        <AttachFile color="primary"/>
                        <input 
                            type="file" 
                            name="file" 
                            id="file" 
                            multiple accept=".pdf,.doc" 
                            onChange={handleChangeMedia}
                            className={classes.mediaInput} />
                    </label>
                </div>
                <div className={classes.forminput}>
                    <input type="text" value={input} placeholder="Aa" onChange={e=> handleChangeInput(e.target.value)} ref={ref}/>
                    <IconButton 
                        color="primary"
                        onClick={()=> setToggleEmoji(!toggleEmoji)}
                        >
                        <Face/>
                    </IconButton>
                    {toggleEmoji && <Picker onEmojiClick={onEmojiClick}  className={classes.emojiPicker} />}
                </div>
                <IconButton 
                    color="primary" 
                    type="submit"
                    disabled={(input || media.length >0)? false: true}
                    >
                    <Send/>
                </IconButton>
            </form> 
        </div>
    )
}

export default ChatFooter
