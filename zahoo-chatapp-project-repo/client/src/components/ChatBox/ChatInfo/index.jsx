import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Typography
} from "@material-ui/core";
import {
  DeleteForever, Edit,
  ExitToApp, Group,
  Image,
  Info,
  InsertDriveFile, Link, Settings, Today
} from "@material-ui/icons";
import { AvatarGroup } from "@material-ui/lab";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGroup,
  getFiles,
  getImageAndVideo,
  outGroup
} from "../../../redux/actions/currentConversation";
import { showChangeGroupNameModal } from "../../../redux/actions/modalAction";
import ListFile from "./ListFile";
import ListImage from "./ListImage";
import SimpleAccordion from "./SimpleAccordion";
import useStyles from "./styles";

const Title = ({ icon, title }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {icon}
      <span style={{ marginLeft: ".5rem" }}>{title}</span>
    </div>
  );
};


function ChatInfo({ currentConversation }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { member } = currentConversation;
  const isGroupChat = currentConversation.label;
  const { user, token } = useSelector((state) => state.auth);
  const { socket} = useSelector((state) => state);
  const { media, files } = useSelector((state) => state.currentConversation);
  const _friends = member.filter((m) => m._id !== user._id);

  const handleOutGroup = () => {
    dispatch(outGroup(user, token, currentConversation, socket));
  };

  useEffect(() => {
    dispatch(getImageAndVideo(currentConversation._id, token));
  }, [currentConversation, token, dispatch]);

  useEffect(() => {
    dispatch(getFiles(currentConversation._id, token));
  }, [currentConversation, token, dispatch]);
const handleDeleteGroup=()=>{
  dispatch(deleteGroup(user, currentConversation, token, socket))
}
  const Actions = () => (
    <div>
      {isGroupChat && (
        <div>
          <Button style={{ color: "red" }} onClick={() => handleOutGroup()}>
            <ExitToApp style={{ color: "red", marginRight: ".5rem" }} />
            Rời nhóm
          </Button>
          {currentConversation?.createdBy?._id === user._id && 
          <Button style={{ color: "red" }} onClick={() => handleDeleteGroup()}>
            <DeleteForever style={{ color: "red", marginRight: ".5rem" }} />
            Giải tán nhóm
          </Button>
}
        </div>
      )}
    </div>
  );
  const in4 = (
    <div className={classes.info}>
      <div>
        <Today />
        <Typography component="span" variant="body1">{`Ngày tạo: ${moment(
          currentConversation?.createdAt
        ).format("MM/DD/YYYY, h:mm:ss a")}`}</Typography>
      </div>
      <div>
        <Group />
        <Typography
          component="span"
          variant="body1"
        >{`Thành viên: ${member.length}`}</Typography>
      </div>
      {isGroupChat && (
        <div>
          <Link />
          <a href="">link vao nhom</a>
        </div>
      )}
    </div>
  );
  const handleChangeGroupName = () => {
    dispatch(showChangeGroupNameModal());
  };
  return (
    <div className={classes.chatInfo}>
      <div className={classes.header}>
        <AvatarGroup max={2}>
          {member?.map((item) => {
            return (
              <Avatar
                src={item?.profilePicture}
                key={item._id}
                alt="avatar"
                className={classes.avatar}
              />
            );
          })}
        </AvatarGroup>
        <div>
          <TextField
            value={
              isGroupChat ? currentConversation.label : _friends[0].username
            }
            disabled
            style={{ textAlign: "center" }}
          />
          {isGroupChat && (
            <span>
              <IconButton onClick={handleChangeGroupName}>
                <Edit color="primary" />
              </IconButton>
            </span>
          )}
        </div>
      </div>
      <div style={{ height: "100vh", width: "100%", overflowY: "auto" }}>
        <SimpleAccordion
          title={<Title title="Thông tin" icon={<Info color="primary" />} />}
          body={in4}
        />
        <SimpleAccordion
          title={<Title title="Ảnh/video" icon={<Image color="primary" />} />}
          body={<ListImage itemData={media} />}
        />
        <SimpleAccordion
          title={
            <Title title="Tệp" icon={<InsertDriveFile color="primary" />} />
          }
          body={<ListFile itemData={files} />}
        />
        <SimpleAccordion
          title={
            <Title title="Cài đặt khác" icon={<Settings color="primary" />} />
          }
          body={<Actions />}
        />
      </div>
    </div>
  );
}

export default ChatInfo;
