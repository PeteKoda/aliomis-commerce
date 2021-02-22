import HeaderLayout from "./layouts";
import {DesktopHeaderFour as DesktopHeader} from "./desktop";
import {NotificationBarTwo as NotificationBar} from "@components/notification-bar";

const HeaderFour = ({navbarAlignment, logoAlignment, showNotificationBar, dark, containerFluid}) => {
    return (
        <HeaderLayout hoverClass="tt-hover-03">
            {showNotificationBar && <NotificationBar dark={dark} containerFluid={containerFluid}/>}
        
            <DesktopHeader
                navbarAlignment={navbarAlignment}
                logoAlignment={logoAlignment}
                containerFluid={containerFluid}
            />
        </HeaderLayout>
    );
};

HeaderFour.defaultProps = {
    showNotificationBar: true
}

export default HeaderFour;