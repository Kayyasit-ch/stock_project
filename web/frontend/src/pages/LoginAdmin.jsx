import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

function LoginAdmin({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // ส่งข้อมูลไปยัง API สำหรับล็อกอิน
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // หากล็อกอินสำเร็จ
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        navigate('/products'); // ไปยังหน้าผลิตภัณฑ์
      } else {
        // หากเกิดข้อผิดพลาดจาก API
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      // จัดการกรณีที่เกิดข้อผิดพลาดในขณะเชื่อมต่อ API
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <h2 className="text-center">Admin Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginAdmin;
