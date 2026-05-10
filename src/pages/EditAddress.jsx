import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api";
import "../style/EditAddress.css";


export const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isNewAddress = id === "new" || !id;
  const isValidAddressId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

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
    if (!isNewAddress && isValidAddressId(id)) {
      fetchAddress();
    } else if (!isNewAddress && !isValidAddressId(id)) {
      setError("Invalid address ID");
    }
  }, [id]);

  const fetchAddress = async () => {
    try {
      if (!isValidAddressId(id)) {
        setError("Invalid address selected");
        return;
      }

      setLoading(true);
      const response = await API.get(`/user/addresses`);
      const addresses = response.data;
      const addressToEdit = addresses.find(addr => addr._id === id);
      
      if (addressToEdit) {
        setAddress(addressToEdit);
      } else {
        console.warn("Address not found in list");
        setError("Address not found");
      }
    } catch (err) {
      console.error("❌ Error fetching address:", err);
      setError("Failed to load address details");
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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!address.type || !address.street || !address.city || !address.state || !address.postalCode) {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields"
      });
      return;
    }

    let message = "";
    let endpoint = "";
    let method = "";

    if (isNewAddress) {
      endpoint = "/user/address";
      method = "post";
      message = "Address added successfully";
    } else {
      endpoint = `/user/address/${id}`;
      method = "put";
      message = "Address updated successfully";
    }

    try {
      if (method === "post") {
        await API.post(endpoint, address);
      } else {
        await API.put(endpoint, address);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        timer: 1500
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (apiErr) {
      console.error(`❌ Error ${method === "post" ? "creating" : "updating"} address:`, apiErr);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiErr.response?.data?.message || `Failed to ${method === "post" ? "add" : "update"} address`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isNewAddress) {
    return <div className="edit-address-container"><p>Loading...</p></div>;
  }

  return (
    <div className="edit-address-container">
      <h2>{isNewAddress ? "Add New Address" : "Edit Address"}</h2>

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
