import {useState} from "react";
import {MobileNav} from "@components/nav";
import MobileHeader from "../mobile";
import StickyHeader from "../sticky";

const HeaderLayout = ({className, hoverClass, children, containerFluid, productCategories}) => {

    const [showMobileNavbar, setShowMobileNavbar] = useState(false);

    const mobileNavbarHandler = () => {
        setShowMobileNavbar(prevState => !prevState);
    }

    return (
        <header className={`tt-header ${className ? className : ''}`}>
            {children}
            <MobileNav
                mobileNavbarHandler={mobileNavbarHandler}
                showMobileNavbar={showMobileNavbar}
                productCategories={productCategories}
            />
            <MobileHeader
                mobileNavbarHandler={mobileNavbarHandler}
            />
            <StickyHeader
                mobileNavbarHandler={mobileNavbarHandler}
                hoverClass={hoverClass}
                containerFluid={containerFluid}
            />
        </header>
    );
};

export default HeaderLayout;