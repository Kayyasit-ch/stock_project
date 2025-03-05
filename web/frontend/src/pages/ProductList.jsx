import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // เพิ่ม Link
import './ProductList.css'

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // สำหรับสินค้าที่กรองแล้ว
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // สำหรับเก็บค่าการค้นหา

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // เริ่มต้นแสดงทั้งหมด
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันการค้นหาที่จะกรองสินค้าจากชื่อ, ประเภท หรือ codeproduct
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.category.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.codeproduct.toLowerCase().includes(e.target.value.toLowerCase()) // เพิ่มการค้นหาจาก codeproduct
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h2>Product List</h2>

      {/* ฟอร์มการค้นหา */}
      <Form.Control
        type="text"
        placeholder="Search by name, category or code"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4"
      />

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">
          Error loading products: {error.message}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Date</th>
              <th>Piece</th>
              <th>Actions</th> {/* เพิ่ม Actions */}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.codeproduct}>
                <td>{product.codeproduct}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.date}</td>
                <td>{product.piece}</td>
                <td>
                  {/* เพิ่มปุ่ม Edit */}
                  <Link to={`/edit-product/${product.codeproduct}`}>
                    <Button variant="warning" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default ProductList;
