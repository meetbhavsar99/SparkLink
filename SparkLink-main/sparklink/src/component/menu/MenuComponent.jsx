import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./MenuComponent.css";
import Collapse from "react-bootstrap/Collapse";
import sparklink_logo from "../../assets/SparkLink_Logo.png";
import sparklink_icon from "../../assets/SparkLink_icon.png";
import view_icon from "../../assets/view_project.png";
import about_icon from "../../assets/about_us.png";
import contact_icon from "../../assets/contact_us.png";
import milestone_icon from "../../assets/Milestone_Tracker.png";
import profile_icon from "../../assets/profile.png";
import create_icon from "../../assets/create_project.png";
import notification_icon from "../../assets/notification.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logout_icon from "../../assets/logout.png";
import login_icon from "../../assets/login.png";
import { useAuth } from "../../AuthContext";
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import { useNotification } from "../../notificationContext"; 

const MenuComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // MouseEvent
  const [role, setRole] = useState(''); // UserRole
  const { isAuthenticated, setIsAuthenticated, user } = useAuth();
  const [notifCount, setNotifCount] = useState([]);
  const [searchParams] = useSearchParams();
  const user_id_param = searchParams.get('user_id');
  const { notifyCount, updateNotifyCount } = useNotification(); 
  
  const getNavItemClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  const logout = async (req, res) => {
    const response = await axios.post("/api/users/logout");
    if (response.status === 401) {
      window.alert("User is logged out");
      console.log("hiiiiii");
    } else {
      console.log(response.data);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  const fetchNotifCount = async () => {
    try {
      updateNotifyCount();
      const response = await axios.get('/notify/count');
      console.log("message ---> ",response.data.message);
      console.log("count ---> ",response.data.notifCount);
      setNotifCount(response.data.notifCount);

    } catch (error) {
      Swal.fire({ title: 'Error', text: error, icon: 'error', confirmButtonText: 'Ok' });
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifCount();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="sidemenu-container">
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <nav
              className={`navbar content menu-glassmorphism ${open ? "navBackground_expanded" : "navBackground"}`}
              style={{ position: "absolute" }}
            >
              {open ? (
                <Collapse in={open}>
                  <div className="navBackground_expanded text-center">
                    <div className="logo-container">
                      <Link className="text-menu logo-link" to="/">
                        <img
                          src={sparklink_icon}
                          className="nav_menu_icon pulse-animation"
                          alt=""
                        ></img>
                        <img
                          src={sparklink_logo}
                          alt="Logo"
                          className="sparklink_logo fade-in"
                        />
                      </Link>
                    </div>
                    <ul className="nav navbar-nav mt-4">
                      <div className="text-menu-category text-start px-3">
                        <span className="category-label">Home</span>
                      </div>
                      {isAuthenticated && (
                        <li className={getNavItemClass("/profile")}>
                          <span className="menu-item-wrapper">
                            <Link
                              className="text-menu nav-link-item"
                              to={`/profile?user_id=${user.user_id}`}
                            >
                              <div className="icon-container">
                                <img
                                  src={profile_icon}
                                  className="nav_sub_menu_icon"
                                  alt=""
                                ></img>
                              </div>
                              <span className="menu-text">User Profile</span>
                            </Link>
                          </span>
                        </li>
                      )}
                     
                      <li className={getNavItemClass("/about")}>
                        <span className="menu-item-wrapper">
                          <Link className="text-menu nav-link-item" to="/about">
                            <div className="icon-container">
                              <img
                                src={about_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              ></img>
                            </div>
                            <span className="menu-text">About Us</span>
                          </Link>
                        </span>
                      </li>
                      <li className={getNavItemClass("/contact")}>
                        <span className="menu-item-wrapper">
                          <Link
                            className="text-menu nav-link-item"
                            to="/contact"
                          >
                            <div className="icon-container">
                              <img
                                src={contact_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              ></img>
                            </div>
                            <span className="menu-text">Contact Us</span>
                          </Link>
                        </span>
                      </li>
                    </ul>
                    
                    {isAuthenticated && (
                      <ul className="nav navbar-nav mt-3">
                        <div className="text-menu-category text-start px-3">
                          <span className="category-label">Project</span>
                        </div>
                        
                        {user && (user.role === '2' ||  user.role === '3' || user.role === '1') && (
                          <li className={getNavItemClass("/create-project")}>
                            <span className="menu-item-wrapper">
                              <Link className="text-menu nav-link-item" to="/create-project">
                                <div className="icon-container">
                                  <img
                                    src={create_icon}
                                    className="nav_sub_menu_icon"
                                    alt=""
                                  ></img>
                                </div>
                                <span className="menu-text">Create Project</span>
                              </Link>
                            </span>
                          </li>
                        )}
                        
                        <li className={getNavItemClass("/view-project")}>
                          <span className="menu-item-wrapper">
                            <Link className="text-menu nav-link-item" to="/view-project">
                              <div className="icon-container">
                                <img
                                  src={view_icon}
                                  className="nav_sub_menu_icon"
                                  alt=""
                                ></img>
                              </div>
                              <span className="menu-text">View Project</span>
                            </Link>
                          </span>
                        </li>
                        
                        {user && user.role === '4' && (
                          <li className={getNavItemClass("/view-Recomended-project")}>
                            <span className="menu-item-wrapper">
                              <Link className="text-menu nav-link-item" to="/view-Recomended-project">
                                <div className="icon-container">
                                  <img
                                    src={view_icon}
                                    className="nav_sub_menu_icon"
                                    alt=""
                                  ></img>
                                </div>
                                <span className="menu-text">Recommendations</span>
                              </Link>
                            </span>
                          </li>
                        )}
                        
                        {role === "" && (
                          <li className={getNavItemClass("/progress")}>
                            <span className="menu-item-wrapper">
                              <Link
                                className="text-menu nav-link-item"
                                to="/progress"
                              >
                                <div className="icon-container">
                                  <img
                                    src={milestone_icon}
                                    className="nav_sub_menu_icon"
                                    alt=""
                                  ></img>
                                </div>
                                <span className="menu-text">Milestone Tracker</span>
                              </Link>
                            </span>
                          </li>
                        )}
                        
                        {role === "" && (
                          <li className={getNavItemClass("/projApplications")}>
                            <span className="menu-item-wrapper">
                              <Link
                                className="text-menu nav-link-item"
                                to="/projApplications"
                              >
                                <div className="icon-container notification-icon-container">
                                  <img
                                    src={notification_icon}
                                    className="nav_sub_menu_icon"
                                    alt=""
                                  ></img>
                                  <span className="notifcation-badge-expand">{notifyCount > 9 ? '9+' : notifyCount}</span>
                                </div>
                                <span className="menu-text">Notifications</span>
                              </Link>
                            </span>
                          </li>
                        )}
                      </ul>
                    )}

                    <ul className="nav navbar-nav mt-3">
                      {isAuthenticated ? (
                        <li className={getNavItemClass("/logout")}>
                          <span className="menu-item-wrapper logout-item">
                            <span
                              className="text-menu nav-link-item"
                              onClick={logout}
                            >
                              <div className="icon-container">
                                <img
                                  src={logout_icon}
                                  className="nav_sub_menu_icon"
                                  alt="Logout Icon"
                                ></img>
                              </div>
                              <span className="menu-text">Logout</span>
                            </span>
                          </span>
                        </li>
                      ) : (
                        <li className={getNavItemClass("/login")}>
                          <span className="menu-item-wrapper login-item">
                            <span
                              className="text-menu nav-link-item"
                              onClick={() => navigate("/login")}
                            >
                              <div className="icon-container">
                                <img
                                  src={login_icon}
                                  className="nav_sub_menu_icon"
                                  alt="Login Icon"
                                ></img>
                              </div>
                              <span className="menu-text">Login</span>
                            </span>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </Collapse>
              ) : (
                <Collapse in={!open}>
                  <div className="navBackground">
                    <div className="logo-container-collapsed">
                      <img
                        src={sparklink_icon}
                        className="nav_collapsed_menu_icon bounce-animation"
                        alt=""
                      ></img>
                    </div>
                    
                    <ul className="nav navbar-nav mt-4">
                      {isAuthenticated && (
                        <li className="nav-item collapsed-item">
                          <span className="icon-only-container">
                            <img
                              src={profile_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            ></img>
                          </span>
                        </li>
                      )}
                      <li className="nav-item collapsed-item">
                        <span className="icon-only-container">
                          <img
                            src={about_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          ></img>
                        </span>
                      </li>
                      <li className="nav-item collapsed-item">
                        <span className="icon-only-container">
                          <img
                            src={contact_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          ></img>
                        </span>
                      </li>
                    </ul>

                    {isAuthenticated && (
                      <ul className="nav navbar-nav">
                        {user && (user.role === '2' || user.role === '3' || user.role === '1') && (
                          <li className="nav-item collapsed-item">
                            <span className="icon-only-container">
                              <img
                                src={create_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              ></img>
                            </span>
                          </li>
                        )}
                        <li className="nav-item collapsed-item">
                          <span className="icon-only-container">
                            <img
                              src={view_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            ></img>
                          </span>
                        </li>
                        {role === "" && (
                          <li className="nav-item collapsed-item">
                            <span className="icon-only-container">
                              <img
                                src={milestone_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              ></img>
                            </span>
                          </li>
                        )}
                        <li className="nav-item collapsed-item">
                          <span className="icon-only-container notification-icon-container">
                            <img
                              src={notification_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            ></img>
                            <span className="notification-badge">{notifyCount > 9 ? '9+' : notifyCount}</span>
                          </span>
                        </li>
                      </ul>
                    )}

                    <ul className="nav navbar-nav">
                      {isAuthenticated ? (
                        <li className="nav-item collapsed-item">
                          <span className="icon-only-container logout-item-collapsed">
                            <img
                              src={logout_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            ></img>
                          </span>
                        </li>
                      ) : (
                        <li className="nav-item collapsed-item">
                          <span className="icon-only-container login-item-collapsed">
                            <img
                              src={login_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            ></img>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </Collapse>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuComponent;