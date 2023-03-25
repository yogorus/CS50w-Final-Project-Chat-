import { Nav, Navbar, NavLink} from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';


const Layout = ({children}) => {
    return (
        <>
            <NavigationBar />
            <main>
                <Container fluid>
                    {children}
                </Container>
            </main>
            <Footer />
        </>
    )
}

function NavigationBar() {
    return (
            <Navbar collapseOnSelect expand="sm" bg='dark' variant='dark' className='p-2'>
                <Navbar.Brand href="#home">JustChat</Navbar.Brand>
                <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll'/>
                <Navbar.Collapse id='navbarScroll'>
                    <Nav>
                        <NavLink as={Link} to="/">Home</NavLink>
                        <NavLink as={Link} to="/room/create">Create Room</NavLink>
                        <NavLink as={Link} to="/login">Log In</NavLink>
                    </Nav>
                </Navbar.Collapse>
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
                            <li><a href="" className='text-secondary'>Github</a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Layout