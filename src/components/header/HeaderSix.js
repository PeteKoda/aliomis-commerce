import HeaderLayout from "./layouts";
import {DesktopHeaderFour as DesktopHeader} from "./desktop";
import {NotificationBarThree as NotificationBar} from "@components/notification-bar";

const HeaderSix = ({navbarAlignment, logoAlignment, containerFluid, productCategories}) => {
    return (
        <HeaderLayout
            hoverClass="tt-hover-03"
            containerFluid={containerFluid}
            productCategories={productCategories}
        >
            <NotificationBar containerFluid={containerFluid}/>
            <DesktopHeader
                navbarAlignment={navbarAlignment}
                logoAlignment={logoAlignment}
                containerFluid={containerFluid}
                productCategories={productCategories}
            />
        </HeaderLayout>
    );
};

export default HeaderSix;