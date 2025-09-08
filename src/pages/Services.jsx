import { FaShippingFast, FaUndo, FaHeadset, FaLock, FaMapMarkedAlt, FaHeart, FaGift, FaRegListAlt } from 'react-icons/fa';
import "../style/Service.css";
export const Services = () => {
  const services = [
    {
      icon: <FaShippingFast size={30} color="#fff" />,
      title: "Fast & Free Delivery",
      desc: "Get your orders delivered quickly at no extra cost."
    },
    {
      icon: <FaUndo size={30} color="#fff" />,
      title: "Easy Returns & Refunds",
      desc: "Hassle-free 7-day return policy with instant refunds."
    },
    {
      icon: <FaHeadset size={30} color="#fff" />,
      title: "24/7 Customer Support",
      desc: "We’re available anytime for your questions or issues."
    },
    {
      icon: <FaLock size={30} color="#fff" />,
      title: "Secure Payments",
      desc: "All transactions are encrypted and protected."
    },
    {
      icon: <FaMapMarkedAlt size={30} color="#fff" />,
      title: "Order Tracking",
      desc: "Track your product in real-time from dispatch to delivery."
    },
    {
      icon: <FaRegListAlt size={30} color="#fff" />,
      title: "Product Recommendations",
      desc: "Get smart suggestions based on your interests."
    },
    {
      icon: <FaHeart size={30} color="#fff" />,
      title: "Wishlist & Save for Later",
      desc: "Save items and shop when you're ready."
    },
    {
      icon: <FaGift size={30} color="#fff" />,
      title: "Subscription Plans",
      desc: "Subscribe for monthly deliveries or discounts."
    }
  ];

  return (
    <div className="services">
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={()=> window.location.href = '/Contact'} className="contact-btn" >Contact Support</button>
    </div>
  );
};
