import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import './EditProduct.css'

function EditProduct() {
  const { codeproduct } = useParams(); // รับค่า codeproduct จาก URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    date: '',
    piece: ''
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);  // เพิ่มสถานะสำหรับแสดงข้อความสำเร็จ

  useEffect(() => {
    axios.get(`http://localhost:3000/api/products/${codeproduct}`)
      .then(response => {
        console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
        setProduct(response.data);
      })
      .catch(error => setError(error.message));
  }, [codeproduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/products/${codeproduct}`, product)
      .then(() => {
        setSuccessMessage("Product updated successfully!");  // เมื่ออัปเดตสำเร็จให้แสดงข้อความ
        setError(null);  // ลบข้อความข้อผิดพลาดถ้ามี
        setTimeout(() => navigate('/products'), 2000);  // ใช้เวลา 2 วินาทีในการไปที่หน้ารายการสินค้า
      })
      .catch(error => {
        setError(error.message);
        setSuccessMessage(null);  // หากเกิดข้อผิดพลาด ให้ลบข้อความสำเร็จ
      });
  };

  return (
    <div>
      <h2>Edit Product</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}  {/* แสดงข้อความสำเร็จ */}

      <Row>
        {/* แสดงข้อมูลเก่าด้านซ้าย */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Product Information</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{product.name || "Loading..."}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category || "Loading..."}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>{product.price || "Loading..."}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>{product.date || "Loading..."}</td>
                  </tr>
                  <tr>
                    <td>Piece</td>
                    <td>{product.piece || "Loading..."}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* ฟอร์มแก้ไขข้อมูลด้านขวา */}
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={product.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control 
                type="text" 
                name="category" 
                value={product.category} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={product.price} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                name="date" 
                value={product.date} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Piece</Form.Label>
              <Form.Control 
                type="number" 
                name="piece" 
                value={product.piece} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Button type="submit" variant="primary">Update Product</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default EditProduct;
