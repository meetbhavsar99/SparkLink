import React, { useState, useEffect } from "react";
import "./HomeComponent.css";
import MasterComponent from "../MasterComponent";
import MenuComponent from "../menu/MenuComponent";
import FooterComponent from "../footer/FooterComponent";

import Homepage_1 from "../../assets/homescreen_1.png";
import Homepage_2 from "../../assets/homescreen_2.png";
import Homepage_3 from "../../assets/homescreen_3.png";

import caption_1 from "../../assets/Caption_1.png";
import caption_2 from "../../assets/Caption_2.png";
import caption_3 from "../../assets/Caption_3.png";
import caption_4 from "../../assets/Caption_4.png";
import caption_5 from "../../assets/Caption_5.png";
import caption_6 from "../../assets/Caption_6.png";

const HomeComponent = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: Homepage_1,
      caption: "Real-World Experience for Students",
      subCaption:
        "Gain Hands-On Skills, Build a Portfolio, and Earn Money by Solving IT Problems Across Campus",
    },
    {
      image: Homepage_2,
      caption: "Empowering IT Solutions for Campus Needs",
      subCaption:
        "Connecting University of Windsor Departments with Talented Students to Tackle Tech Challenges",
    },
    {
      image: Homepage_3,
      caption: "Simplifying Collaboration and Project Management",
      subCaption:
        "Seamlessly Match Departments with Skilled Students to Complete Technology Projects Efficiently",
    },
  ];

  useEffect(() => {
    const autoScroll = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoScroll);
  }, [slides.length]);

  const cardContents = [
    {
      img: caption_1,
      text: "Bring your IT visions to life with UWindsor SparkLink, connecting you to top Computer Science talent",
    },
    {
      img: caption_2,
      text: "Collaborate with UWindsor SparkLink to deliver impactful IT solutions while enhancing your skills",
    },
    {
      img: caption_3,
      text: "Showcase your skills with SparkLink, gaining real-world experience and building a standout portfolio",
    },
    {
      img: caption_4,
      text: "Empower your growth with UWindsor SparkLink—bridging classroom knowledge and real-world IT skills",
    },
    {
      img: caption_5,
      text: "Track progress and milestones with UWindsor SparkLink, staying organized as you achieve impactful IT solutions",
    },
    {
      img: caption_6,
      text: "Transform ideas into impactful IT solutions with SparkLink, enhancing your skills and solving real-world problems",
    },
  ];

  return (
    <>
      <MenuComponent />
      <div className="page-container">
        <div className="content-container">
          <MasterComponent />
          <div className="home_container">
            <div className="hero-section">
              <div className="hero-content">
                <div
                  className="hero-slider"
                  style={{
                    transform: `translateX(-${activeSlide * 33.333}%)`,
                  }}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`hero-slide ${
                        activeSlide === index ? "active" : ""
                      }`}
                    >
                      <div className="hero-text">
                        <h1>{slide.caption}</h1>
                        <p>{slide.subCaption}</p>
                      </div>
                      <div className="hero-image">
                        <img src={slide.image} alt={slide.caption} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hero-navigation">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`nav-dot ${
                        activeSlide === index ? "active" : ""
                      }`}
                      onClick={() => setActiveSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="features-section">
              <div className="section-header">
                <h2>Explore What SparkLink Offers</h2>
                <p>
                  Discover the tools and benefits designed to help you grow and
                  succeed.
                </p>
              </div>

              <div className="features-grid">
                {cardContents.map((card, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">
                      <img src={card.img} alt={`Feature ${index + 1}`} />
                    </div>
                    <div className="feature-description">
                      <p>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cta-buttons">
                <button
                  className="button-card"
                  onClick={() => (window.location.href = "/about")}
                >
                  About Us
                </button>
                <button
                  className="button-card"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    </>
  );
};

export default HomeComponent;
