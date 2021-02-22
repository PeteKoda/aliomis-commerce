import {WidgetsTwo as Widgets} from "@components/footer/elements/widgets";
import {CopyrightTwo as Copyright} from "@components/footer/elements/copyright";

const FooterThree = ({className, dark}) => {
    return (
        <footer id="tt-footer" className={`${className ? className : ''} ${dark ? 'f-mobile-dark' : ''}`}>
            <Widgets dark={dark}/>
            <Copyright dark={dark}/>
        </footer>
    );
};

export default FooterThree;