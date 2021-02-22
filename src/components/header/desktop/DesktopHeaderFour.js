import Logo from "../../logo";
import Navbar from "@components/navbar";
import {Container} from "react-bootstrap";
import HeaderAction from "../action/HeaderAction";

const logo = "/assets/images/no-placeholder/logo.png";

const DesktopHeaderFour = ({navbarAlignment, logoAlignment, containerFluid, productCategories}) => {
    return (
        <div className="tt-desktop-header">
            <Container fluid={containerFluid}>
                <div className="tt-header-holder">
                    <div className={`tt-obj-logo obj-alignment-${logoAlignment ? logoAlignment : 'center'}`}>
                        <Logo src={logo} width={95} height={20}/>
                    </div>

                    <div className="tt-obj-options obj-move-right tt-position-absolute">
                        <HeaderAction
                            className="obj-move-right"
                            search={true}
                            cart={true}
                            account={true}
                            settings={true}
                        />
                    </div>
                </div>
            </Container>

            <Container fluid={containerFluid}>
                <div className="tt-header-holder">
                    <div className={`tt-obj-menu obj-alignment-${navbarAlignment ? navbarAlignment : 'left'}`}>
                        <Navbar
                            hoverClass="tt-hover-03 tt-menu-small"
                            productCategories={productCategories}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default DesktopHeaderFour;