import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import TopBar from "../Components/TopBar/TopBar";
import Navigation from "../Components/NavLink/NavLink";
import LocationWarning from "../Components/UI/LocationWarning";
import FriendFinder from "../Components/FriendFinder/FriendFinder";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { loadUserData } from "../Store/Actions/UserAction";
import Setting from "../Components/Setting/Setting";
import Chat from "../Components/Chat/Chat";
import Inbox from "../Components/Inbox/Inbox";
import { initSocket } from "../Store/Actions/SocketActions";
import Media from "react-media";

function Home({ token, loadUserData, initSocket, userId, socket }) {
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [loc, setLoc] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoc({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
          setIsLocationAllowed(true);
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setIsLocationAllowed(false);
              break;
            default:
              setIsLocationAllowed(false);
              break;
          }
        }
      );
    } else {
      setIsLocationAllowed(false);
    }
  }, []);

  useEffect(() => {
    loadUserData(token);
  }, [token, loadUserData]);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit("user_online", userId);
    }
  }, [socket, userId]);

  return (
    <React.Fragment>
      <Media query="(min-width: 960px)">
        {(matches) =>
          matches ? (
            <Grid container spacing={0}>
              <StyledGrid item xs={12} lg={3} md={4} sm={12}>
                <TopBar />
                <BottomContainer>
                  <Navigation />
                  {isLocationAllowed ? (
                    <Switch>
                      <Route
                        path="/"
                        render={() => (
                          <FriendFinder lng={loc.lng} lat={loc.lat} />
                        )}
                        exact
                      />
                      <Route path="/setting" component={Setting} />
                      <Route path="/inbox" component={Inbox} />
                    </Switch>
                  ) : (
                    <LocationWarning showModal={isLocationAllowed} />
                  )}
                </BottomContainer>
              </StyledGrid>
              <Grid item lg={9} md={8}>
                <Route
                  path="/inbox/:userId"
                  render={() => <Chat isDesktop={true} />}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid style={{ height: "100%" }} container spacing={0}>
              <Grid style={{ height: "100%" }} item sm={12} xs={12}>
                <Switch>
                  <Route
                    path="/inbox/:userId"
                    render={() => <Chat isDesktop={false} />}
                  />
                  <Route
                    path="/"
                    render={() => (
                      <MobileRoutes
                        loc={loc}
                        isLocationAllowed={isLocationAllowed}
                      />
                    )}
                  />
                </Switch>
              </Grid>
            </Grid>
          )
        }
      </Media>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token,
    userId: state.authReducer.userId,
    socket: state.socketReducer.socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadUserData: (token) => dispatch(loadUserData(token)),
    initSocket: () => dispatch(initSocket()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const MobileRoutes = (props) => {
  return (
    <>
      <StyledGrid item xs={12} lg={12} md={12} sm={12}>
        <TopBar />
        <BottomContainer>
          <Navigation />
          {props.isLocationAllowed ? (
            <Switch>
              <Route
                path="/"
                render={() => (
                  <FriendFinder lng={props.loc.lng} lat={props.loc.lat} />
                )}
                exact
              />
              <Route path="/setting" component={Setting} />
              <Route path="/inbox" component={Inbox} />
            </Switch>
          ) : (
            <LocationWarning showModal={props.isLocationAllowed} />
          )}
        </BottomContainer>
      </StyledGrid>
    </>
  );
};

const StyledGrid = styled(Grid)`
  &&& {
    height: ${window.innerHeight + "px"};
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box; /* Opera/IE 8+ */
    border-right: 1px solid #ccc;
    position: relative;
  }
`;
const BottomContainer = styled.div`
  height: ${window.innerHeight - 60 + "px"};
  width: 100%;
`;
