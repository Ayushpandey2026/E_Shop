import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api";


export const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false
  });

  useEffect(() => {
    if (id !== "new") {
      fetchAddress();
    }
  }, [id]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/user/addresses`);
      const addresses = response.data;
      const addressToEdit = addresses.find(addr => addr._id === id);
      
      if (addressToEdit) {
        setAddress(addressToEdit);
      } else {
        setError("Address not found");
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setError("Failed to load address");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load address details"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!address.type || !address.street || !address.city || !address.state || !address.postalCode) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please fill in all required fields"
        });
        return;
      }

      if (id === "new") {
        // Create new address
        const response = await API.post("/user/address", address);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Address added successfully",
          timer: 1500
        });
      } else {
        // Update existing address
        const response = await API.put(`/user/address/${id}`, address);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Address updated successfully",
          timer: 1500
        });
      }
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error saving address:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to save address"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && id !== "new") {
    return <div className="edit-address-container"><p>Loading...</p></div>;
  }

  return (
    <div className="edit-address-container">
      <h2>{id === "new" ? "Add New Address" : "Edit Address"}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Address Type *</label>
        <select
          name="type"
          value={address.type}
          onChange={handleChange}
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Street Address *</label>
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleChange}
          placeholder="Enter street address"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleChange}
          placeholder="Enter country"
        />
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          name="isDefault"
          id="isDefault"
          checked={address.isDefault}
          onChange={handleChange}
        />
        <label htmlFor="isDefault">Set as default address</label>
      </div>

      <div className="edit-btn-group">
        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => navigate("/profile")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
