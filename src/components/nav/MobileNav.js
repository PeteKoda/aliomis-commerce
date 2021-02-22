import Link from "next/link";
import PropTypes from "prop-types";
import navData from "@data/navbar.json";
import { getSiblings, getClosest, slideToggle, slideUp } from "@utils/method";

const MobileNav = ({ className, mobileNavbarHandler, showMobileNavbar, productCategories }) => {
    const handleMenu = (e) => {
        const target = e.target;
        const hasSubmenus = getSiblings(target);
        hasSubmenus.length > 0 && e.preventDefault();
        target.classList.toggle('menu-expand');
        const parent = getClosest(target, "LI");
        const childNodes = parent.childNodes;
        const parentSiblings = getSiblings(parent);
        parentSiblings.forEach((sibling) => {
            const sibChildNodes = sibling.childNodes;
            sibChildNodes.forEach((child) => {

                console.log(child)

                // if (child.classList.contains('mm-next-level')) {
                //     child.classList.remove('menu-expand');
                // }
                // if (child.nodeName === "UL") {
                //     slideUp(child, 300);
                // }
            });
        });
        childNodes.forEach((child) => {
            if (child.nodeName === "UL") {
                slideToggle(child, 300);
            }
        });
    }

    console.log("#######################")
    console.log(productCategories)

    return (
        <nav className={`panel-menu mobile-main-menu ${showMobileNavbar ? "mmitemopen" : null} ${className ? className : ''}`}>
            <div className="mmpanels">
                <div className="mmpanel mmopened mmcurrent" id="mm0">
                    <ul>
                        <li className="mm-close-parent">
                            <button className="mm-close" onClick={mobileNavbarHandler}>Close</button>
                        </li>
                        {navData.map(nav => (
                            <li key={nav.id}>
                                <Link href={nav?.link}>
                                    <a
                                        className={nav?.submenu || nav?.text === "SHOP" || nav?.mega_menu ? 'mm-next-level' : ''}
                                        onClick={(event => handleMenu(event))}
                                    >
                                        {nav?.text}
                                    </a>
                                </Link>

                                {(nav?.text === "SHOP" && productCategories && productCategories.length) ? (
                                    <ul className="pl-4">
                                        {/* <li className="title">SHOP CATEGORIES</li> */}
                                        {productCategories.map((productCategory, i) => (
                                            <li key={`mob-pc-${i}`} ><Link href={`/${productCategory.slug}/`}>{productCategory.name}</Link></li>
                                        ))}
                                    </ul>
                                ) : ''}

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

MobileNav.propTypes = {
    mobileNavbarHandler: PropTypes.func.isRequired,
    showMobileNavbar: PropTypes.bool.isRequired
}

export default MobileNav;