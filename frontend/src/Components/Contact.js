import React from "react";
import "../Styles/App.css";
import { AiFillInstagram, AiFillMail, AiFillPhone } from 'react-icons/ai';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const Contact = () => {
    return (
        <div className="contact-container">
            <h1>Contact Me</h1>
            <div className="contact-content">
                <p>Got a question or just want to say hi? Feel free to get in touch with me.</p>
                <ul className="contact-info">
                    <li><AiFillMail /> akhilpatilbagili@gmail.com</li>
                    <li><AiFillPhone /> +1 9178323147</li>
                    <li><MdLocationOn /> San Jose, California</li>
                </ul>
                <div className="social-media">
                    {/* eslint-disable-next-line */}
                    <a href="https://www.instagram.com/akhil_patil_b/" target="_blank" rel="noopener noreferrer">
                        <AiFillInstagram className="social-icon" />
                    </a>
                    {/* eslint-disable-next-line */}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="social-icon" />
                    </a>
                    {/* eslint-disable-next-line */}
                    <a href="https://www.linkedin.com/in/akhil-patil-bagili/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className="social-icon" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
