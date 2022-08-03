import { Paper, ThemeProvider } from "@material-ui/core";
import Peer from "peerjs";
import { useEffect } from "react";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { io } from "socket.io-client";
import AddFriendModal from "./components/Modal/AddFriendModal";
import AddFriendToGroupModal from "./components/Modal/AddFriendToGroupModal";
import AddGroupModal from "./components/Modal/AddGroupModal";
import CallModal from "./components/Modal/CallModal";
import ChangeGroupName from "./components/Modal/ChangeGroupName";
import NotFound from "./components/NotFound";
import Notify from "./components/Notify";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MessengerPage from "./pages/MessengerPage";
import NotifyPage from "./pages/NotifyPage";
import PhoneBook from "./pages/PhoneBookPage";
import RegisterPage from "./pages/RegisterPage";
import { refreshToken } from "./redux/actions/authAction";
import { getConversationsByUserId } from "./redux/actions/conversationsAction";
import { getAllUser } from "./redux/actions/usersAction";
import { GLOBALTYPES } from "./redux/actionType";
import SocketClient from "./SocketClient";
import Theme from "./theme";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { call } = useSelector((state) => state);
  useEffect(() => {
    dispatch(refreshToken());
    const socket = io(process.env.REACT_APP_BASE_URL,{
      transports: ['websocket']
    });
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(getAllUser(token, 1, 15));
    } else if (user) {
      dispatch(getConversationsByUserId(user._id, token));
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      const newPeer = new Peer(undefined, {
        host: process.env.REACT_APP_PEER_PATH,
        port: process.env.REACT_APP_PEER_PORT,
      });
      dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
    }
  }, [dispatch, user]);

  return (
    <Router>
      <ThemeProvider theme={Theme}>
        <Paper className="app">
          <Notify />
          {user && <AddFriendModal />}
          {user && <AddGroupModal />}
          {user && <ChangeGroupName />}
          {call && <CallModal />}
          {token && <SocketClient />}
          {user && <AddFriendToGroupModal />}
          <Switch>
            <Route exact path="/">
              {token ? (
                <Redirect to={`/messenger`} />
              ) : (
                <Redirect to="/login" />
              )}
              {/* <Redirect to="/login"/> */}
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/messenger">
              {token ? <MessengerPage /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/admin">
              {user?.isAdmin === true ? (
                <AdminPage />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/phonebook">
              {token ? <PhoneBook /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/notify">
              {token ? <NotifyPage /> : <Redirect to="/login" />}
            </Route>

            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Paper>
      </ThemeProvider>
    </Router>
  );
}

export default App;
