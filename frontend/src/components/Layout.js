import { Nav, Navbar, NavLink} from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Layout = ({children}) => {
    return (
        <>
            <NavigationBar />
            <main>{children}</main>
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

export default Layout