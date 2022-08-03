import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme)=> ({
    chatControl:{
        // flex:".1",
        display:"flex",
        flexDirection:"column",
        padding:"0 .5rem"
    },
    body:{
        overflowY:"scroll",
        flex:"1"
    }
}))