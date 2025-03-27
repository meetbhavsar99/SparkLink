import React from 'react';
import './HomeComponent.css';
import MasterComponent from '../MasterComponent';
import Carousel from 'react-bootstrap/Carousel';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';

import Homepage_1 from '../../assets/homescreen_1.png';
import Homepage_2 from '../../assets/homescreen_2.png';
import Homepage_3 from '../../assets/homescreen_3.png';

import caption_1 from '../../assets/Caption_1.png';
import caption_2 from '../../assets/Caption_2.png';
import caption_3 from '../../assets/Caption_3.png';
import caption_4 from '../../assets/Caption_4.png';
import caption_5 from '../../assets/Caption_5.png';
import caption_6 from '../../assets/Caption_6.png';

const HomeComponent = () => {
    return (
        <>
            <MenuComponent />
            <div className="page-container">
                <div className="content-container">
                    <MasterComponent />
                    <div className="home_container">
                        <div className="container-fluid background">
                            <div style={{ height: 'auto' }}>
                                <Carousel>
                                    <Carousel.Item>
                                    <div className="carousel-slide row align-items-center">
                                        <div className="col-md-6 text-center carousel-left">
                                        <div>
                                            <span className='text_caption'>Real-World Experience for Students</span>
                                            <br />
                                            <span className='text_sub_caption'>
                                            Gain Hands-On Skills, Build a Portfolio,
                                            <br /> and Earn Money by Solving IT Problems Across Campus
                                            </span>
                                        </div>
                                        </div>
                                        <div className="col-md-6 text-center">
                                        <img src={Homepage_1} className='carousel_img' alt="" />
                                        </div>
                                    </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                    <div className="carousel-slide row align-items-center">
                                        <div className="col-md-6 text-center carousel-left">
                                        <div>
                                            <span className='text_caption'>Empowering IT Solutions for Campus Needs</span>
                                            <br />
                                            <span className='text_sub_caption'>
                                            Connecting University of Windsor Departments <br />with Talented Students to Tackle Tech Challenges
                                            </span>
                                        </div>
                                        </div>
                                        <div className="col-md-6 text-center">
                                        <img src={Homepage_2} className='carousel_img' alt="" />
                                        </div>
                                    </div>
                                    </Carousel.Item>

                                    <Carousel.Item>
                                    <div className="carousel-slide row align-items-center">
                                        <div className="col-md-6 text-center carousel-left">
                                        <div>
                                            <span className='text_caption'>Simplifying Collaboration and Project Management</span>
                                            <br />
                                            <span className='text_sub_caption'>
                                            Seamlessly Match Departments with Skilled Students
                                            <br /> to Complete Technology Projects Efficiently
                                            </span>
                                        </div>
                                        </div>
                                        <div className="col-md-6 text-center">
                                        <img src={Homepage_3} className='carousel_img' alt="" />
                                        </div>
                                    </div>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="text-center my-5">
                                <h2 className="text_tagline mb-3">Explore What SparkLink Offers</h2>
                                <p className="text_subtagline">Discover the tools and benefits designed to help you grow and succeed.</p>
                            </div>

                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {[caption_1, caption_2, caption_3].map((img, idx) => (
                                    <div className="col" key={idx}>
                                        <div className="homepage_card text-center p-4 h-100">
                                            <img src={img} className="homepage_img mb-3" alt="" />
                                            <p className="card_subcaption">
                                                {[
                                                    "Bring your IT visions to life with UWindsor SparkLink, connecting you to top Computer Science talent",
                                                    "Collaborate with UWindsor SparkLink to deliver impactful IT solutions while enhancing your skills",
                                                    "Showcase your skills with SparkLink, gaining real-world experience and building a standout portfolio"
                                                ][idx]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
                                {[caption_4, caption_5, caption_6].map((img, idx) => (
                                    <div className="col" key={idx}>
                                        <div className="homepage_card text-center p-4 h-100">
                                            <img src={img} className="homepage_img mb-3" alt="" />
                                            <p className="card_subcaption">
                                                {[
                                                    "Empower your growth with UWindsor SparkLink—bridging classroom knowledge and real-world IT skills",
                                                    "Track progress and milestones with UWindsor SparkLink, staying organized as you achieve impactful IT solutions",
                                                    "Transform ideas into impactful IT solutions with SparkLink, enhancing your skills and solving real-world problems"
                                                ][idx]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 text-center">
                                <button className="button_text button-card mx-2" onClick={() => window.location.href = "/about"}>
                                    About Us
                                </button>
                                <button className="button_text button-card mx-2" onClick={() => window.location.href = "/contact"}>
                                    Contact us
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
