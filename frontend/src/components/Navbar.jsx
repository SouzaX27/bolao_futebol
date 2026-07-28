import {
    Navbar as BootstrapNavbar,
    Nav,
    Container
} from "react-bootstrap";

import {
    Link
} from "react-router-dom";


function Navbar() {

    return (

        <BootstrapNavbar
            bg="dark"
            variant="dark"
            expand="lg"
        >

            <Container>

                <BootstrapNavbar.Brand
                    as={Link}
                    to="/palpites"
                >

                    ⚽ Bolão

                </BootstrapNavbar.Brand>


                <BootstrapNavbar.Toggle />


                <BootstrapNavbar.Collapse>

                    <Nav className="me-auto">

                        <Nav.Link
                            as={Link}
                            to="/palpites"
                        >

                            Palpites

                        </Nav.Link>


                        <Nav.Link
                            as={Link}
                            to="/ranking"
                        >

                            Ranking

                        </Nav.Link>


                            {/* <Nav.Link
                                as={Link}
                                to="/admin"
                            >

                                Admin

                            </Nav.Link> */}

                    </Nav>

                </BootstrapNavbar.Collapse>

            </Container>

        </BootstrapNavbar>

    );

}


export default Navbar;