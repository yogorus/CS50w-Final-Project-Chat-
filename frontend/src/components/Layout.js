import { Nav, Navbar, NavDropdown, NavLink } from 'react-bootstrap';
import { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({children}) => {
    return (
        <>
            <NavigationBar />
            <main>
                <Container fluid className='h-100'>
                    {children}
                </Container>
            </main>
            <Footer />
        </>
    )
}

function NavigationBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem('token') !== null
      );
    const username = (isLoggedIn) ? JSON.parse(window.localStorage.getItem('username')) : '';
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false)
        navigate('../login')
    }

    return (
            <Navbar collapseOnSelect expand="sm" bg='dark' variant='dark' className='p-2'>
                <Navbar.Brand href='#'>ChatIT</Navbar.Brand>
                {!!isLoggedIn
                ?
                <>
                    <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll'/>
                    <Navbar.Collapse id='navbarScroll'>
                    <Nav className='me-auto'>
                        <NavLink as={Link} to="/">Home</NavLink>
                        <NavLink as={Link} to="/room/create">Create Room</NavLink>
                        <NavDropdown title={username}>
                            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </>
                : <></>
                }
            </Navbar>
    )
}

function Footer() {
    return (
        <footer className='fixed-bottom bg-dark text-light mt-auto p-1'>
            <Container>
                <Row>
                    <Col>
                        <h3>Contacts</h3>
                        <ul className='list-unstyled text-small'>
                            <li><a href="https://github.com/yogorus" className='text-secondary'>Github</a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Layout