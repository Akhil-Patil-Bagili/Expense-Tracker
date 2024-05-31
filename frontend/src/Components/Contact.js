import React, { useState } from "react";
import "../Styles/App.css";
import { AiFillInstagram } from 'react-icons/ai';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import emailjs from 'emailjs-com';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
        console.log('Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
        console.log('User ID:', process.env.REACT_APP_EMAILJS_USER_ID);
        emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            formData,
            process.env.REACT_APP_EMAILJS_USER_ID
        ).then((result) => {
            console.log(result.text);
            alert('Message Sent Successfully!');
        }, (error) => {
            console.log(error.text);
            alert('Message Sending Failed!');
        });
    };

    return (
        <div className="contact-container">
            <header>
                <h1>Contact Developer</h1>
                <p>Got a question or just want to say hi? Feel free to get in touch with me.</p>
            </header>

            <main className="contact-content">
                <section className="contact-form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Send Message</button>
                    </form>
                </section>
                <section className="social-media">
                    <a href="https://www.instagram.com/akhil_patil_b/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <AiFillInstagram className="social-icon" />
                    </a>
                    <a href="https://github.com/Akhil-Patil-Bagili" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <FaGithub className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/akhil-patil-bagili/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedinIn className="social-icon" />
                    </a>
                </section>
            </main>
        </div>
    );
};

export default Contact;
