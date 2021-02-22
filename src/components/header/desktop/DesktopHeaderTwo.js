import Logo from "../../logo";
import Navbar from "@components/navbar";
import {Container} from "react-bootstrap";
import HeaderAction from "../action/HeaderAction";

const logo = "/assets/images/no-placeholder/logo.png";

const DesktopHeaderTwo = () => {
    return (
        <div className="tt-desktop-header">
            <Container>
                <div className="tt-header-holder">
                    <div className="tt-col-obj tt-obj-logo">
                        <Logo src={logo} width={95} height={20}/>
                    </div>

                    <div className="tt-col-obj obj-move-right">
                        <HeaderAction
                            search={true}
                            cart={true}
                            account={true}
                            settings={true}
                        />
                    </div>
                </div>
            </Container>

            <div className="tt-color-scheme-01">
                <Container>
                    <div className="tt-header-holder">
                        <div className="tt-obj-menu">
                            <Navbar
                                hoverClass="tt-hover-02"
                            />
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default DesktopHeaderTwo;
