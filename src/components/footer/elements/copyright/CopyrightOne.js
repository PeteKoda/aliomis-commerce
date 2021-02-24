import Logo from "@components/logo";
import {Container} from "react-bootstrap";

const CopyrightOne = ({className}) => {
    return (
        <div className={`tt-footer-custom ${className ? className : ''}`}>
            <Container>
                <div className="tt-row">
                    <div className="tt-col-left">
                        <div className="tt-col-item tt-logo-col">
                            <img src="https://admin.w3vitals.com/wp-content/uploads/2020/11/w3vitals-logo-e1610190879561.png" width="50px" />
                        </div>
                        <div className="tt-col-item">
                            <div className="tt-box-copyright ht-copy">
                                &copy; W3Vitals {new Date().getFullYear()}. Made with <i className="text-danger icon-h-37"/> by <a
                                href="https://w3vitals.com" target="_blank" rel="noopener">W3Vitals</a>.
                            </div>
                        </div>
                    </div>
                    <div className="tt-col-right">
                        <div className="tt-col-item">
                            <img src="/assets/images/no-placeholder/payment.jpg"/>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default CopyrightOne;