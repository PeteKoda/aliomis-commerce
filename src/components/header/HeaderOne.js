import HeaderLayout from "./layouts";
import {DesktopHeaderOne as DesktopHeader} from "./desktop";

const HeaderOne = ({navbarAlignment, dark}) => {
    return (
        <HeaderLayout hoverClass="tt-hover-03">
            <DesktopHeader
                dark={dark}
                navbarAlignment={navbarAlignment}
            />
        </HeaderLayout>
    );
};

export default HeaderOne;