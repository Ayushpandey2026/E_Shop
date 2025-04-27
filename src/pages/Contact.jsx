
export const Contact = () => {
    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Have a question or need support? We’d love to hear from you.</p>

            <form className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your full name" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="you@example.com" required />
                </div>

                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" placeholder="Support, Order, Feedback..." />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="5" placeholder="Type your message here..." required></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
            </form>
        </div>
    );
};
