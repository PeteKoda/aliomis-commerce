import {DesktopNav} from "@components/nav";

const Navbar = ({className, hoverClass, productCategories}) => {
    return (
        <div className={`tt-desktop-parent-menu tt-parent-box ${className ? className : ''}`}>
            <div className={`tt-desktop-menu ${hoverClass ? hoverClass : ''}`}>
                <DesktopNav productCategories={productCategories} />
            </div>
        </div>
    );
};

export default Navbar;