import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,

} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from "../Nav/Nav";
import AdminNav from "../AdminNav/AdminNav";
import Footer from "../Footer/Footer";
import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import PreventativeCare from '../PreventativeCare/PreventativeCare';
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import "./App.css";
import AdminLandingPage from "../AdminLandingPage/AdminLandingPage";
import AdminPreventativeCare from '../AdminPreventativeCare/AdminPreventativeCare';
import AdminResources from "../AdminResources/AdminResources";
import AdminSpecificResources from "../AdminSpecificResources/AdminSpecificResources";
import Membership from "../Membership/Membership";
import Feedback from "../Feedback/Feedback";
import CategoryDetailView from "../CategoryDetailView/CategoryDetailView";
import AdminCategoryDetailView from "../AdminCategoryDetailView/AdminCategoryDetailView";

import Resources from '../Resources/Resources';
import UserMedicalLinks from "../UserMedicalLinks/UserMedicalLinks";
import UserVirtualHealth from "../UserVirtualHealth/UserVirtualHealth";
import AdminFeedbackView from "../AdminFeedbackView/AdminFeedbackView";

import { createTheme, ThemeProvider } from '@mui/material/styles';

//Add Google Analystics Tracking-id below to initialize it in the app
import ReactGA from 'react-ga';
const TRACKING_ID = // YOUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);


//function used to redirect if its admin loggin in or user logging in
function UserOrAdmin(user) {
  if (user.id && user.access_level == 0) {
    console.log("user redirect");
    return (<Redirect to="/user" />);
  } else if (user.id && user.access_level == 1) {
    console.log("admin redirect");
    return (<Redirect to="/admin" />);
  }
  return (<LoginPage />);
}

// MUI theme
const theme = createTheme({
  typography: {
    detailField01: {
      fontWeight: 'bold',
    },
  },
  palette: {
    type: 'light',
    primary: {
      main: '#8EBBA7',
      contrastText: "#171717"
    },
    secondary: {
      main: 'rgb(99, 130, 116)',
    },
    text: {
      primary: '#000000',
      secondary: '#a3a3a3',
      white: '#fff'
    },
    link: {
      primary: "#171717"
    },
    error: {
      main: '#d63a2f',
    }
  }
});

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);


  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  //Google Analytics
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.hash + window.location.search);
  }, []);


  // MUI theme provider

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          {user.id && user.access_level == 1 ? <AdminNav /> : <Nav />}
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />

            <Route
              exact
              path="/adminprevcare">

              <AdminPreventativeCare />
            </Route>
            {/* Visiting localhost:3000/about will show the about page. */}
            <Route
              // shows AboutPage at all times (logged in or not)
              exact
              path="/about"
            >
              <AboutPage />
            </Route>

            <Route
              // shows AboutPage at all times (logged in or not)
              exact
              path="/membership"
            >
              <Membership />
            </Route>

            <Route
              exact
              path="/feedback"
            >
              <Feedback />
            </Route>

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute
              // shows AboutPage at all times (logged in or not)
              exact
              path="/preventativecare"
            >
              <PreventativeCare />
            </ProtectedRoute>

            <ProtectedRoute
              // shows AboutPage at all times (logged in or not)
              exact
              path="/virtualhealth"
            >
              <UserVirtualHealth />
            </ProtectedRoute>

            <ProtectedRoute
              // shows AboutPage at all times (logged in or not)
              exact
              path="/medicallinks"
            >
              <UserMedicalLinks />
            </ProtectedRoute>


            <ProtectedRoute
              // logged in shows UserPage else shows LoginPage
              exact
              path="/user"
            >
              {user.access_level === 1 ? <Redirect to="/admin" /> : <UserPage />}
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/info"
            >
              <InfoPage />
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/resources"
            >
              <Resources />
            </ProtectedRoute>

            <Route exact path="/login">
              {UserOrAdmin(user)}
            </Route>

            <Route exact path="/registration">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/user" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/home">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/user" />
              ) : (
                // Otherwise, show the Landing page
                <LandingPage />
              )}
            </Route>

            {/* admin landing page */}
            <ProtectedRoute exact path="/admin">
              {user.id && user.access_level == 1 ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <AdminLandingPage />
              ) : (
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              )}
            </ProtectedRoute>

            {/* admin feedback view page */}
            <ProtectedRoute
              exact
              path="/adminfeedbackview">

              <AdminFeedbackView />

            </ProtectedRoute>


            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/preventativecare/:catId/ages/:ageId"
            >
              <CategoryDetailView />
            </ProtectedRoute>


            {/* admin resources page */}
            <ProtectedRoute
              exact
              path="/adminresources"
            >
              {user.id && user.access_level == 1 ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <AdminResources />
              ) : (
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              )}
            </ProtectedRoute >

            <ProtectedRoute
              exact
              path="/adminprevcare"
            >
              {user.id && user.access_level == 1 ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <AdminPreventativeCare />
                :
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              }

            </ProtectedRoute>

            <ProtectedRoute
              exact
              path="/adminprevcare/:catId/ages/:ageId"
            >
              {user.id && user.access_level == 1 ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <AdminCategoryDetailView />
                :
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              }

            </ProtectedRoute>

            <ProtectedRoute
              exact
              path="/adminprevcare/:catId/ages/:ageId/:sectionName"
            >
              {user.id && user.access_level == 1 ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <AdminCategoryDetailView />
                :
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              }

            </ProtectedRoute>

            <ProtectedRoute
              exact
              path="/adminprevcare/specificresources/:categoryId"
            >
              {user.id && user.access_level == 1 ?
                // If the user is already logged in, 
                // redirect them to the /user page
                <AdminSpecificResources />
                :
                // Otherwise, show the Landing page
                <Redirect to="/home" />
              }

            </ProtectedRoute>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;