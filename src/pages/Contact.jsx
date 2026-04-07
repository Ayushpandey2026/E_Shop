import { useState } from "react";
import API from "../api.js";
import Swal from "sweetalert2";
import "../style/Contact.css";
export const Contact = () => {
            const[name,setName] = useState("");
            const[email,setEmail] = useState("");
            const[subject,setSubject] = useState("");
            const[message, setMessage] = useState("");  

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine subject and message for the backend
            const fullMessage = subject ? `${subject}: ${message}` : message;
            
            const response = await API.post("/enquiry/insert", {
                name,
                email,
                phone: "", // optional field
                message: fullMessage,
            });
            console.log("Message sent successfully:", response.data);   
            Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Thank you for contacting us! We will get back to you soon.",
                timer: 2000,
                showConfirmButton: false,
            });
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        }
        catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = error.response?.data?.message || "There was an error sending your message. Please try again later.";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    }
    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Have a question or need support? We’d love to hear from you.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} 
                    placeholder="Your full name" required
                    onChange={(e)=>setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email}
                     placeholder="you@example.com" required 
                    onChange={(e)=>setEmail(e.target.value)}
                     />
                </div>

                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" value={subject} 
                    placeholder="Support, Order, Feedback..."
                    onChange={(e)=>setSubject(e.target.value)}
                     />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea value={message} rows="5" 
                    placeholder="Type your message here..." required
                    onChange={(e)=>setMessage(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
            </form>
        </div>
    );
};
