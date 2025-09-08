import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/MyProfile.css";

export const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    type: "",
    details: "",
  });

  useEffect(() => {
    if (id !== "new") {
      // 🔹 Replace with API fetch for specific address
      const dummy = { type: "Home", details: "123, ABC Colony, Lucknow" };
      setAddress(dummy);
    }
  }, [id]);

  const handleSave = () => {
    // 🔹 Call API to save/update address
    alert("Address Saved!");
    navigate("/profile");
  };

  return (
    <div className="edit-address-container">
      <h2>{id === "new" ? "Add New Address" : "Edit Address"}</h2>

      <label>Address Type</label>
      <input
        type="text"
        value={address.type}
        onChange={(e) => setAddress({ ...address, type: e.target.value })}
        placeholder="Home / Work / Other"
      />

      <label>Full Address</label>
      <textarea
        value={address.details}
        onChange={(e) => setAddress({ ...address, details: e.target.value })}
        placeholder="Enter your full address"
      />

      <div className="edit-btn-group">
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-btn" onClick={() => navigate("/profile")}>
          Cancel
        </button>
      </div>
    </div>
  );
};
