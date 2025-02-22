import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // เพิ่มการนำเข้า useNavigate

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // สำหรับสินค้าที่กรองแล้ว
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // สำหรับเก็บค่าการค้นหา
  const [cart, setCart] = useState([]); // ตะกร้าสินค้า
  const navigate = useNavigate();  // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // เริ่มต้นแสดงทั้งหมด
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันการค้นหาที่จะกรองสินค้าจากชื่อหรือประเภท
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center">All Products</h2>
        <Button variant="success">
          Cart <Badge bg="light" text="dark">{cart.length}</Badge>
        </Button>
      </div>
      
      {/* ฟอร์มการค้นหา */}
      <Form.Control
        type="text"
        placeholder="Search by name or category"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4"
      />

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading products: {error}</Alert>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center">No products available.</p>
      ) : (
        <Row>
          {filteredProducts.map(product => (
            <Col key={product.codeproduct} md={4} sm={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price} <br />
                    <strong>Date:</strong> {product.date} <br />
                    <strong>Stock:</strong> {product.piece} pcs
                  </Card.Text>
                  {/* ลบปุ่ม "Add to Cart" และ "Buy" */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;
