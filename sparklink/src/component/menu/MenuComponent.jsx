import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import "./MenuComponent.css";
import sparklink_logo from "../../assets/SparkLink_Logo.png";
import sparklink_icon from "../../assets/SparkLink_icon.png";
import view_icon from "../../assets/view_project.png";
import about_icon from "../../assets/about_us.png";
import home_icon from "../../assets/home_icon.png";
import group_icon from "../../assets/group_icon.png";

import contact_icon from "../../assets/contact_us.png";
import milestone_icon from "../../assets/Milestone_Tracker.png";
import profile_icon from "../../assets/profile.png";
import create_icon from "../../assets/create_project.png";
import notification_icon from "../../assets/notification.png";
import application_icon from "../../assets/application_icon.png";
import recommendation_icon from "../../assets/recommendation_icon.png";
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
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const { isAuthenticated, setIsAuthenticated, user } = useAuth();
  const [notifCount, setNotifCount] = useState([]);
  const [searchParams] = useSearchParams();
  const user_id_param = searchParams.get('user_id');
  const { notifyCount, updateNotifyCount } = useNotification(); 
  const menuRef = useRef(null);
  // Add a ref to track if we're currently in a mouse transition
  const isTransitioning = useRef(false);
  // Add a ref to track the timeout ID
  const timeoutRef = useRef(null);
  
  const getNavItemClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  const logout = async () => {
    try {
      const response = await axios.post("/api/users/logout");
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      Swal.fire({ 
        title: 'Error', 
        text: 'Failed to logout. Please try again.', 
        icon: 'error', 
        confirmButtonText: 'Ok' 
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const fetchNotifCount = async () => {
    try {
      updateNotifyCount();
      const response = await axios.get('/notify/count');
      setNotifCount(response.data.notifCount);
    } catch (error) {
      Swal.fire({ 
        title: 'Error', 
        text: error.message || 'Failed to fetch notifications', 
        icon: 'error', 
        confirmButtonText: 'Ok' 
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifCount();
    }
  }, [isAuthenticated]);

  // Improved menu toggle with stability control
  const handleMenuToggle = (isOpen) => {
    // Only update state if we're not in a rapid toggle scenario
    if (!isTransitioning.current) {
      setOpen(isOpen);
    }
  };

  // Enhanced mouse event handling with better debounce and state management
  useEffect(() => {
    const menuElement = menuRef.current;
    
    if (!menuElement) return;
    
    const handleMouseEnter = () => {
      // Clear any pending timeout to ensure stability
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Set transitioning flag to prevent rapid state changes
      isTransitioning.current = true;
      
      // Open the menu
      setOpen(true);
      
      // Reset the transitioning flag after a small delay
      setTimeout(() => {
        isTransitioning.current = false;
      }, 100);
    };
    
    const handleMouseLeave = (e) => {
      // Don't react immediately to avoid flickering
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Check if we're actually leaving the menu area
      // This improved check helps prevent false triggers
      const rect = menuElement.getBoundingClientRect();
      const isReallyLeaving = 
        e.clientX < rect.left - 5 || 
        e.clientX > rect.right + 5 || 
        e.clientY < rect.top - 5 || 
        e.clientY > rect.bottom + 5;
      
      if (isReallyLeaving) {
        // Use a longer timeout for more stability
        timeoutRef.current = setTimeout(() => {
          setOpen(false);
          timeoutRef.current = null;
        }, 500); // Increased for better stability
      }
    };
    
    menuElement.addEventListener('mouseenter', handleMouseEnter);
    menuElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up all listeners and timeouts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      menuElement.removeEventListener('mouseenter', handleMouseEnter);
      menuElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="sidemenu-container">
        <div ref={menuRef}>
          <nav
            className={`navbar content menu-glassmorphism ${open ? "navBackground_expanded" : "navBackground"}`}
            style={{ position: "absolute" }}
          >
            {open ? (
              <div className="navBackground_expanded text-center">
                <div className="logo-container">
                  <Link className="text-menu logo-link" to="/">
                    <img
                      src={sparklink_icon}
                      className="nav_menu_icon pulse-animation"
                      alt=""
                    />
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
                  <li className={getNavItemClass("/")}>
                    <span className="menu-item-wrapper">
                      <Link className="text-menu nav-link-item" to="/">
                        <div className="icon-container">
                          <img
                            src={home_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                        </div>
                        <span className="menu-text">Welcome</span>
                      </Link>
                    </span>
                  </li>
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
                            />
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
                          />
                        </div>
                        <span className="menu-text">About Us</span>
                      </Link>
                    </span>
                  </li>
                  <li className={getNavItemClass("/contact")}>
                    <span className="menu-item-wrapper">
                      <Link className="text-menu nav-link-item" to="/contact">
                        <div className="icon-container">
                          <img
                            src={contact_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
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

                    {user && (user.role === '2' || user.role === '3' || user.role === '1') && (
                      <li className={getNavItemClass("/create-project")}>
                        <span className="menu-item-wrapper">
                          <Link className="text-menu nav-link-item" to="/create-project">
                            <div className="icon-container">
                              <img
                                src={create_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              />
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
                            />
                          </div>
                          <span className="menu-text">View Project</span>
                        </Link>
                      </span>
                    </li>
                    {user && (user.role === '1' || user.role === '3') && (
  <li className={getNavItemClass("/admin-view")}>
    <span className="menu-item-wrapper">
      <Link className="text-menu nav-link-item" to="/admin-view">
        <div className="icon-container">
          <img src={group_icon} className="nav_sub_menu_icon" alt="" />
        </div>
        <span className="menu-text">View All Groups</span>
      </Link>
    </span>
  </li>
)}
                    {user && user.role === '4' && (
  <>
    <li className={getNavItemClass("/view-Recomended-project")}>
      <span className="menu-item-wrapper">
        <Link className="text-menu nav-link-item" to="/view-Recomended-project">
          <div className="icon-container">
            <img src={recommendation_icon} className="nav_sub_menu_icon" alt="" />
          </div>
          <span className="menu-text">Recommendations</span>
        </Link>
      </span>
    </li>

    <li className={getNavItemClass("/applications")}>
      <span className="menu-item-wrapper">
        <Link className="text-menu nav-link-item" to="/applications">
          <div className="icon-container">
            <img src={application_icon} className="nav_sub_menu_icon" alt="" />
          </div>
          <span className="menu-text">Applications</span>
        </Link>
      </span>
    </li>

    <li className={getNavItemClass("/group")}>
  <span className="menu-item-wrapper">
    <Link className="text-menu nav-link-item" to="/group">
      <div className="icon-container">
        <img src={require("../../assets/group_icon.png")} className="nav_sub_menu_icon" alt="" />
      </div>
      <span className="menu-text">Group</span>
    </Link>
  </span>
</li>

  </>
)}

                    {role === "" && (
                      <li className={getNavItemClass("/progress")}>
                        <span className="menu-item-wrapper">
                          <Link className="text-menu nav-link-item" to="/progress">
                            <div className="icon-container">
                              <img
                                src={milestone_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              />
                            </div>
                            <span className="menu-text">Milestone Tracker</span>
                          </Link>
                        </span>
                      </li>
                    )}
                    {role === "" && (
                      <li className={getNavItemClass("/projApplications")}>
                        <span className="menu-item-wrapper">
                          <Link className="text-menu nav-link-item" to="/projApplications">
                            <div className="icon-container notification-icon-container">
                              <img
                                src={notification_icon}
                                className="nav_sub_menu_icon"
                                alt=""
                              />
                              <span className="notifcation-badge-expand">{notifyCount > 9 ? '9+' : notifyCount}</span>
                            </div>
                            <span className="menu-text">Notifications</span>
                          </Link>
                        </span>
                      </li>
                    )}
                  </ul>
                )}
                <ul className="nav navbar-nav mt-3 menu-footer">
                  {isAuthenticated ? (
                    <li className="nav-item">
                      <button
                        className="menu-item-wrapper logout-item clickable-menu-item"
                        onClick={logout}
                      >
                        <div className="icon-container">
                          <img
                            src={logout_icon}
                            className="nav_sub_menu_icon"
                            alt="Logout Icon"
                          />
                        </div>
                        <span className="menu-text">Logout</span>
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <button
                        className="menu-item-wrapper login-item clickable-menu-item"
                        onClick={handleLogin}
                      >
                        <div className="icon-container">
                          <img
                            src={login_icon}
                            className="nav_sub_menu_icon"
                            alt="Login Icon"
                          />
                        </div>
                        <span className="menu-text">Login</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="navBackground">
                <div className="logo-container-collapsed">
                  <Link to="/">
                    <img
                      src={sparklink_icon}
                      className="nav_collapsed_menu_icon bounce-animation"
                      alt=""
                    />
                  </Link>
                </div>
                <ul className="nav navbar-nav mt-4">
                  {isAuthenticated && (
                    <li className="nav-item collapsed-item">
                      <Link to={`/profile?user_id=${user.user_id}`} className="collapsed-link">
                        <span className="icon-only-container">
                          <img
                            src={profile_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                        </span>
                      </Link>
                    </li>
                  )}
                  <li className="nav-item collapsed-item">
                    <Link to="/about" className="collapsed-link">
                      <span className="icon-only-container">
                        <img
                          src={about_icon}
                          className="nav_sub_menu_icon"
                          alt=""
                        />
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item collapsed-item">
                    <Link to="/contact" className="collapsed-link">
                      <span className="icon-only-container">
                        <img
                          src={contact_icon}
                          className="nav_sub_menu_icon"
                          alt=""
                        />
                      </span>
                    </Link>
                  </li>
                </ul>
                {isAuthenticated && (
                  <ul className="nav navbar-nav">
                  {user && (user.role === '1' || user.role === '3') && (
  <li className="nav-item collapsed-item">
    <Link to="/admin-view" className="collapsed-link">
      <span className="icon-only-container">
        <img src={group_icon} className="nav_sub_menu_icon" alt="" />
      </span>
    </Link>
  </li>
)}

                    {user && (user.role === '2' || user.role === '3' || user.role === '1') && (
                      <li className="nav-item collapsed-item">
                        <Link to="/create-project" className="collapsed-link">
                          <span className="icon-only-container">
                            <img
                              src={create_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            />
                          </span>
                        </Link>
                      </li>
                    )}
                    <li className="nav-item collapsed-item">
                      <Link to="/view-project" className="collapsed-link">
                        <span className="icon-only-container">
                          <img
                            src={view_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                        </span>
                      </Link>
                    </li>
                    {role === "" && (
                      <li className="nav-item collapsed-item">
                        <Link to="/progress" className="collapsed-link">
                          <span className="icon-only-container">
                            <img
                              src={milestone_icon}
                              className="nav_sub_menu_icon"
                              alt=""
                            />
                          </span>
                        </Link>
                      </li>
                    )}
                    <li className="nav-item collapsed-item">
                      <Link to="/projApplications" className="collapsed-link">
                        <span className="icon-only-container notification-icon-container">
                          <img
                            src={notification_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                          <span className="notification-badge">{notifyCount > 9 ? '9+' : notifyCount}</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
                <ul className="nav navbar-nav collapsed-menu-footer">
                  {isAuthenticated ? (
                    <li className="nav-item collapsed-item">
                      <button
                        className="collapsed-link"
                        onClick={logout}
                      >
                        <span className="icon-only-container logout-item-collapsed">
                          <img
                            src={logout_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                        </span>
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item collapsed-item">
                      <button
                        className="collapsed-link"
                        onClick={handleLogin}
                      >
                        <span className="icon-only-container login-item-collapsed">
                          <img
                            src={login_icon}
                            className="nav_sub_menu_icon"
                            alt=""
                          />
                        </span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MenuComponent;