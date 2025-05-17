import React, { useEffect, useState } from "react";
import "./Contact.css";

import Z_header from "../../components/Z_header/Z_header";
import Z_hero from "../../components/Z_hero/Z_hero";
import Z_pagesection from "../../components/Z_pagesection/Z_pagesection";
import Z_footer from "../../components/Z_footer/Z_footer";

import HeroImage from "../../assets/images/hero_home.jpg";

import { ReactComponent as Logo } from "../../assets/icons/logo.svg";

function Contact() {
  return (
    <div className="contact">
      <Z_header
        links={[
          <a href="/about" rel="noopener noreferrer">
            About
          </a>,
          <a href="/contact" rel="noopener noreferrer">
            Contact
          </a>,
          <div className="dropdown">
            Services
            <ul className="dropdown-menu">
              <li>
                <a href="/printing">3D Printing</a>
              </li>
              <li>
                <a href="/modeling">3D Modeling</a>
              </li>
            </ul>
          </div>,
        ]}
        name={"Axion"}
        logo={<Logo />}
      />
      <main className="main">
        <Z_hero
          img={HeroImage}
          alt="Alt text for your hero image"
          attribution="Author"
          objectPos="How far to move the image to the right at small screen sizes (percentage)"
        >
          <h1>Axion Fabrication</h1>
          <h2>Put a super cool tagline here</h2>
        </Z_hero>
        <Z_pagesection>
          <h2>Welcome to Axion Fabrication</h2>
          <h3>Put a catchy tagline for your Axion Fabrication here</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eum{" "}
            <a href="/" rel="noopener noreferrer">
              aut
            </a>
            , nam, aliquid illum, sint modi consequuntur nihil{" "}
            <a href="/" rel="noopener noreferrer">
              consequatur
            </a>{" "}
            maiores voluptatum! Eveniet neque quod adipisci{" "}
            <a href="/" rel="noopener noreferrer">
              ipsum
            </a>{" "}
            nemo. Quia, aut necessitatibus.
          </p>
        </Z_pagesection>
      </main>
      <footer className="footer">
        <Z_footer
          name={"Axion"}
          logo={<Logo />}
          children={[
            [
              <h4>Services</h4>,
              <a href="/articles" rel="noopener noreferrer">
                Articles
              </a>,
              <a href="/affiliate" rel="noopener noreferrer">
                Affiliate Links
              </a>,
            ],
            [
              <h4>More</h4>,
              <a href="/about" rel="noopener noreferrer">
                About Us
              </a>,
              <a href="/collaborate" rel="noopener noreferrer">
                Work With Us
              </a>,
              <a href="/contact" rel="noopener noreferrer">
                Contact
              </a>,
            ],
          ]}
        />
      </footer>
    </div>
  );
}

export default Contact;