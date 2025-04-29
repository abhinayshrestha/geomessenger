import React, { useEffect } from "react";
import { connect } from "react-redux";
import Login from "./Login";
import Home from "./Home";
import styled from "styled-components";
import { checkAuth } from "../Store/Actions/AuthActions";

function App(props) {
  const RootContainer = styled.div`
    height: 100vh;
    width: 100vw;
    @media (max-width: 960px) {
      position: fixed;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      height: 100%;
      width: 100%;
    }
  `;
  useEffect(() => {
    props.check();
  }, [props]);

  return <RootContainer>{props.isAuth ? <Home /> : <Login />}</RootContainer>;
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.authReducer.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    check: () => dispatch(checkAuth()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
