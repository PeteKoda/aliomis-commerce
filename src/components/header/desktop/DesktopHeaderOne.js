import Logo from "../../logo";
import {Container} from "react-bootstrap";
import Navbar from "@components/navbar";
import HeaderAction from "../action/HeaderAction";

const logo = "/assets/images/no-placeholder/logo.png";
const logoWhite = "/assets/images/custom/logo-white.png";

const DesktopHeaderOne = ({className,navbarAlignment, containerFluid, dark}) => {
    return (
        <div className={`tt-desktop-header ${className ? className: ''}`}>
            <div className={dark ? 'tt-color-scheme-01' : 'tt-header-light'}>
                <Container fluid={containerFluid}>
                    <div className="tt-header-holder">
                        <div className="tt-col-obj tt-obj-logo">
                            <Logo src={!dark ? logo : logoWhite} width={95} height={20}/>
                        </div>
                        <div className={`tt-col-obj tt-obj-menu obj-alignment-${navbarAlignment ? navbarAlignment : 'left'}`}>
                            <Navbar
                                hoverClass="tt-hover-03"
                            />
                        </div>

                        <div className="tt-col-obj tt-obj-options">
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
            </div>
        </div>
    );
};

DesktopHeaderOne.defaultProps = {
    dark: false
}

export default DesktopHeaderOne;
