import HeaderLayout from "./layouts";
import {DesktopHeaderTwo as DesktopHeader} from "./desktop";

const HeaderTwo = () => {
    return (
        <HeaderLayout hoverClass="tt-hover-02">
            <DesktopHeader/>
        </HeaderLayout>
    );
};

export default HeaderTwo;