import { useUser } from "@/lib/hooks";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar  from "react-bootstrap/Navbar";


export default function ComponentNavbar() {
  const [user, { mutate }] = useUser();
  const handleLogout = async () => {
    await fetch("/api/logout");
    mutate({ user: null });
  };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Nav className="me-auto">
            <Navbar.Brand>Gather</Navbar.Brand>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/reports">Reports</Nav.Link>
            {user ? (
              <>
                <Nav.Link href="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/login">
                    Login
                </Nav.Link>
                <Nav.Link href="/signup">
                    Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
