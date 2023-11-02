import React from "react";
import "../Styles/App.css";
import { AiFillInstagram, AiFillMail, AiFillPhone } from 'react-icons/ai';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const Contact = () => (
    <div className="contact-container">
        <header>
            <h1>Contact Me</h1>
            <p>Got a question or just want to say hi? Feel free to get in touch with me.</p>
        </header>

        <main className="contact-content">
            <section className="contact-info">
                <p><AiFillMail /> akhilpatilbagili@gmail.com</p>
                <p><AiFillPhone /> +19178323147</p>
                <p><MdLocationOn /> San Jose, California</p>
            </section>

            <section className="social-media">
                <a href="https://www.instagram.com/akhil_patil_b/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <AiFillInstagram className="social-icon" />
                </a>
                <a href="YOUR_GITHUB_LINK_HERE" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub className="social-icon" />
                </a>
                <a href="https://www.linkedin.com/in/akhil-patil-bagili/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedinIn className="social-icon" />
                </a>
            </section>
        </main>
    </div>
);

export default Contact;