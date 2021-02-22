import {NewsletterTwo as Newsletter} from "@components/newsletter";
import {CopyrightTwo as Copyright} from "@components/footer/elements/copyright";

const FooterTwo = ({className, dark, newsletter}) => {
    return (
        <footer id="tt-footer" className={`${className ? className : ''} ${dark ? 'f-mobile-dark' : ''}`}>
            {newsletter && <Newsletter dark={dark}/>}
            <Copyright dark={dark}/>
        </footer>
    );
};

FooterTwo.defaultProps = {
    newsletter: true
}

export default FooterTwo;