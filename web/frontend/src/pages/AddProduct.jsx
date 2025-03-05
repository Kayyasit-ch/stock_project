import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import './AddProduct.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    codeproduct: '', name: '', category: '', price: '', date: '', piece: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post('http://localhost:3000/api/products', formData);
      setSuccess(true);
      setFormData({
        codeproduct: '', name: '', category: '', price: '', date: '', piece: 1
      });
    } catch (error) {
      setError('Error adding product. Please try again.');
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <h2>Add Product</h2>

      {error && <Alert variant="danger" className="alert">{error}</Alert>}
      {success && <Alert variant="success" className="alert">Product added successfully!</Alert>}

      <Form.Group className="form-group">
        <Form.Label className="form-label">Code</Form.Label>
        <Form.Control
          type="text"
          name="codeproduct"
          value={formData.codeproduct}
          onChange={handleChange}
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">Category</Form.Label>
        <Form.Control
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="form-control"
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">Piece</Form.Label>
        <Form.Control
          type="number"
          name="piece"
          min="1"
          value={formData.piece}
          onChange={handleChange}
          className="form-control"
        />
      </Form.Group>

      <Button type="submit" disabled={loading} className="btn-submit">
        {loading ? <Spinner animation="border" size="sm" /> : 'Add Product'}
      </Button>
    </Form>
  );
}

export default AddProduct;