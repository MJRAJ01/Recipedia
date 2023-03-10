import React from "react";
import "./home.styles.css";
import Logo from "../../components/logo/logo.component";

import { Link } from "react-router-dom";

const HomePage = () => {
    const scrollOffset = -1 * window.innerHeight * 0.1;

    return (
        <div className="homepage">
            <div className="page" id="home">
                <div className="logo-cont">
                    <Logo home />
                </div>
                <h2>
                    Join the fastest growing hub to upload, organize, and share
                    your recipes{" "}
                </h2>
                <div className="btn-grp">
                    <Link to="login">
                        <button id="secondary_btn">Sign In </button>
                    </Link>
                    <Link to="register">
                        <button id="main_btn">Register Now!</button>
                    </Link>
                </div>

                <br />
            </div>
            <div className="page" id="upload">
                <div className="about-text">
                    <h3>Upload Recipes Online or Manually </h3>
                    <p>
                        Use our patented Recipe Parser to automatically scrape
                        information from your favorite websites or transcribe
                        grandmothers hand-written notecards from the motherland
                    </p>
                </div>
            </div>
            <div className="page" id="upload">
                <div className="about-text">
                    <h3>Organize and Get Smart Suggestions</h3>
                    <p>
                        Have all of your week-night meals in a single spot and
                        we’ll provide similar recipes using Machine Learning
                        from other users{" "}
                    </p>
                </div>
            </div>
            <div className="page" id="upload">
                <div className="about-text">
                    <h3>Share Your Favorites With Friends</h3>
                    <p>
                        Post, Comment, and Re-post recipes with our Social Feed
                        to see what your friends are cooking and put them onto
                        your favroites!
                    </p>
                </div>
            </div>
            <div className="btn-grp">
                <button id="main_btn">Register Now!</button>
            </div>

            <div className="page" id="contact"></div>
        </div>
    );
};

export default HomePage;
