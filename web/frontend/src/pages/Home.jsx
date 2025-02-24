import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaCartPlus } from 'react-icons/fa';  // ใช้ไอคอนเพิ่มเติม

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);  // เก็บสินค้าที่ใส่ตระกร้า

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);  // เพิ่มสินค้าไปยังตระกร้า
    alert(`${product.name} added to cart!`);
  };

  const purchaseProduct = (product) => {
    alert(`Purchased ${product.name} for $${product.price}`);
    // ที่นี่สามารถเพิ่มฟังก์ชันการสั่งซื้อที่เกี่ยวข้องได้
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 text-primary font-weight-bold">All Products</h2>

      {/* ฟอร์มการค้นหา */}
      <Form.Control
        type="text"
        placeholder="Search by name or category"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 shadow-lg"
        style={{
          fontSize: '1.1rem',
          padding: '12px',
          borderRadius: '25px',
          borderColor: '#007bff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      />
      <FaSearch
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          color: '#007bff',
          fontSize: '1.5rem',
        }}
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
              <Card className="shadow-lg rounded-lg" style={{ transition: 'transform 0.3s', border: 'none' }}>
                <Card.Body className="p-4">
                  <Card.Title className="text-center font-weight-bold text-primary">{product.name}</Card.Title>
                  <Card.Subtitle className="text-muted text-center mb-3">{product.category}</Card.Subtitle>
                  <Card.Text className="text-center">
                    <strong>Price:</strong> ${product.price} <br />
                    <strong>Stock:</strong> {product.piece} pcs
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="success"
                      onClick={() => purchaseProduct(product)}
                      className="w-48"
                      style={{
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        padding: '12px',
                        fontSize: '1rem',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#28a745'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#218838'}
                    >
                      <FaShoppingCart className="mr-2" /> Buy Now
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => addToCart(product)}
                      className="w-48"
                      style={{
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        padding: '12px',
                        fontSize: '1rem',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6c757d'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#5a6268'}
                    >
                      <FaCartPlus className="mr-2" /> Add to Cart
                    </Button>
                  </div>
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
