import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme)=> ({
    onlineFriends:{
        padding:"1rem 0"
    },
    title:{
        display:"flex",
        justifyContent:"space-between",
        '& span':{
            backgroundColor:theme.palette.grey[300],
            padding:".5rem",
            borderRadius:".5rem",
            fontWeight:"bold",
        }
    },
    list:{
        width:"20rem",
        whiteSpace: "nowrap",
        overflowX: "auto",
    }
}))