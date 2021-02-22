import Logo from "@components/logo";
import {Container} from "react-bootstrap";

const CopyrightOne = ({className}) => {
    return (
        <div className={`tt-footer-custom ${className ? className : ''}`}>
            <Container>
                <div className="tt-row">
                    <div className="tt-col-left">
                        <div className="tt-col-item tt-logo-col">
                            <Logo src="/assets/images/no-placeholder/logo.png"/>
                        </div>
                        <div className="tt-col-item">
                            <div className="tt-box-copyright ht-copy">
                                &copy; Wokiee {new Date().getFullYear()}. Made with <i className="text-danger icon-h-37"/> by <a
                                href="https://hasthemes.com" target="_blank" rel="noopener noreferrer">HasThemes</a>.
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