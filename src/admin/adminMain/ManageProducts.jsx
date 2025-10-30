import { useEffect, useState } from "react";
import "../adminstyle/ManageProduct.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch("https://e-shop-backend-iqb1.onrender.com/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    await fetch(`https://e-shop-backend-iqb1.onrender.com/api/products/${editingProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingProduct),
    });
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.image} alt={p.title} />
              </td>
              <td>{p.title}</td>
              <td>₹{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => setEditingProduct(p)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    await fetch(`https://e-shop-backend-iqb1.onrender.com/api/products/${p._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchProducts();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingProduct.title}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            value={editingProduct.category}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
            }
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
