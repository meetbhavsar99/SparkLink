import React from "react";
import { useRoutes } from "react-router-dom";
import HomeComponent from "./component/home/HomeComponent";
import AboutComponent from "./component/about/AboutComponent";
import ContactComponent from "./component/contact/ContactComponent";
import ProgressTrackerComponent from "./component/progress-tracker/ProgressTrackerComponent";
import CreateProjectComponent from "./component/createproject/CreateProjectComponent";
import RegisterComponent from "./component/register/RegisterComponent";
import LoginComponent from "./component/login/LoginComponent";
import ProtectedRoute from "./component/ProtectedRoute";
import ProjApplicationComponent from "./component/project-applications/projApplicationComponent";
import ViewProjectComponent from "./component/viewproject/ViewProjectComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationComponent from "./component/viewproject/ApplicationComponent";
import ProfileComponent from "./component/profile/ProfileComponent";
import EditProfileComponent from "./component/editProfile/EditProfileComponent";
import ViewUserComponent from "./component/admin/viewUsers";
import ResetPasswordComponent from "./component/resetpassword/ResetPasswordComponent";
import ResetPasswordEmailComponent from "./component/resetpasswordemail/ResetPasswordEmailComponent";
import ViewRecomendedProject from "./component/viewproject/ViewRecommendedProject";
import AdminSystemSettings from "./component/admin/AdminSystemSettings";
import AdminAnalytics from "./component/admin/AdminAnalytics";
import AdminDashboard from "./component/admin/AdminDashboard";
import AdminLogs from "./component/admin/AdminLogs";
import LogsComponent from "./component/admin/LogsComponent";
import GroupComponent from "./component/StudentGroup/StudentGroupComponent";
import ViewGroupComponent from "./component/StudentGroup/ViewAllGroupsComponent";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <HomeComponent /> },
    { path: "/about", element: <AboutComponent /> },
    { path: "/contact", element: <ContactComponent /> },
    { path: "/register", element: <RegisterComponent /> },
    { path: "/login", element: <LoginComponent /> },

    { path: "/reset-password", element: <ResetPasswordComponent /> },
    { path: "/reset-password-email", element: <ResetPasswordEmailComponent /> },
    // Protected parent route
    {
      path: "/", // Protected routes parent path
      element: <ProtectedRoute />,
      children: [
        { path: "progress", element: <ProgressTrackerComponent /> },
        { path: "create-project", element: <CreateProjectComponent /> },
        { path: "view-project", element: <ViewProjectComponent /> },
        { path: "view-Recomended-project", element: <ViewRecomendedProject /> },
        { path: "projApplications", element: <ProjApplicationComponent /> },
        { path: "/profile", element: <ProfileComponent /> },
        { path: "/editProfile", element: <EditProfileComponent /> },
        { path: "/admin/viewusers", element: <ViewUserComponent /> },
        { path: "/admin/settings", element: <AdminSystemSettings /> },
        { path: "/admin/analytics-reports", element: <AdminAnalytics /> },
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/admin-logs", element: <AdminLogs /> },
        { path: "/admin/logs", element: <LogsComponent /> },
        { path: "/applications", element: <ApplicationComponent /> },
        { path: "/group", element: <GroupComponent /> },
        { path: "/admin-view", element: <ViewGroupComponent /> },
      ],
    },
  ]);

  return routes;
};

export default AppRoutes;
