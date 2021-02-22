import HeaderLayout from "./layouts";
import {DesktopHeaderOne as DesktopHeader} from "./desktop";
import {NotificationBarTwo as NotificationBar} from "@components/notification-bar";

const HeaderFive = ({navbarAlignment, logoAlignment, containerFluid}) => {
    return (
        <HeaderLayout
            hoverClass="tt-hover-03"
            containerFluid={containerFluid}
        >
            <NotificationBar containerFluid={containerFluid}/>
            <DesktopHeader
                navbarAlignment={navbarAlignment}
                logoAlignment={logoAlignment}
                containerFluid={containerFluid}
                className="tt-header-static tt-color-scheme-03 tt-bg-01"
            />
        </HeaderLayout>
    );
};

export default HeaderFive;