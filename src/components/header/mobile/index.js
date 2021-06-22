import Logo from "../../logo";
import PropTypes from "prop-types";
import {Row, Container} from "react-bootstrap";
import HeaderAction from "../action/HeaderAction";

const MobileHeader = ({className, mobileNavbarHandler}) => {
    return (
        <div className={`tt-mobile-header ${className ? className : null}`}>
            <Container fluid>
                <div className="tt-header-row">
                    <HeaderAction
                        hamburger={true}
                        search={true}
                        cart={true}
                        account={true}
                        settings={false}
                        mobileNavbarHandler={mobileNavbarHandler}
                    />
                </div>
            </Container>

            <Container fluid className="tt-top-line">
                <Row>
                    <div className="tt-logo-container">
                        <Logo
                            src="/assets/images/no-placeholder/logo.png"
                            width={95}
                            height={20}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

MobileHeader.propTypes = {
    mobileNavbarHandler: PropTypes.func.isRequired
}

export default MobileHeader;