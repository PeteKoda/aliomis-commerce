import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import navData from "@data/navbar.json";
import React, { useState, useEffect } from "react";
import Product from "@components/Product";

const DesktopNav = ({ className, productCategories }) => {

    const [selectedNavCat, setSelectedNavCat] = useState(0)
    return (
        <nav className={className}>
            <ul>
                {navData.map(navItem => (
                    <li key={navItem.id}
                        className={`dropdown tt-submenu ${navItem.mega_menu ? 'megamenu' : 'tt-megamenu-col-01'}`}
                    >
                        { navItem.link !== "#" 
                            ?
                                <Link href={navItem.link}><a>{navItem.text}</a></Link>
                            :
                                <a>{navItem.text}</a>
                        }
                        {navItem?.submenu && (
                            <div className="dropdown-menu">
                                <Row>
                                    <Col lg={12}>
                                        <Row className="tt-col-list">
                                            {navItem?.submenu && navItem?.submenu.map(subItem => (
                                                <div className={`col-sm-${navItem?.mega_menu ? 3 : 12}`} key={subItem.id}>
                                                    <h6 className="tt-title-submenu">
                                                        <Link href="/">
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </h6>
                                                    <ul className="tt-megamenu-submenu">
                                                        {subItem?.lists.map((item, index) => (
                                                            <li key={index} className={item.badge}>
                                                                <Link href={item.link}>
                                                                    <a>
                                                                        {item.text}
                                                                        {item.badge && (
                                                                            <span className={`tt-badge tt-${item.badge}`}>
                                                                                {item.badge === 'coming_soon' && 'COMING SOON'}
                                                                                {item.badge === 'popular' && 'POPULAR'}
                                                                                {item.badge === 'hot' && 'HOT'}
                                                                                {item.badge === 'new' && 'NEW'}
                                                                            </span>
                                                                        )}
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}

                                            {navItem?.promo && (
                                                <Col lg={3}>
                                                    <Link href="/shop" className="tt-promo-02">
                                                        <a><img src={navItem?.promo} alt="promo" /></a>
                                                    </Link>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {(navItem.text === "SHOP" && productCategories && productCategories.length) ? (
                            <div className="dropdown-menu">
                                <Row>
                                    <Col lg={12}>
                                        <Row className="tt-col-list">
                                            <div className={`col-sm-${navItem?.mega_menu ? 3 : 12}`}>
                                                <h6 className="tt-title-submenu">
                                                    <Link href="/">
                                                        <span>Shop Categories</span>
                                                    </Link>
                                                </h6>
                                                <ul className="tt-megamenu-submenu">
                                                    {productCategories.map((productCategory, i) => (
                                                        <li key={productCategory.id + i} onMouseEnter={() => setSelectedNavCat(i)}>
                                                            <Link href={`/${productCategory.slug}/`}>
                                                                <a>
                                                                    {productCategory.name}
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className={`col-sm-9`}>
                                                <div className="product-categories grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 relative px-8">
                                                    {(undefined !== productCategories) && (
                                                        productCategories[selectedNavCat].products.nodes.map(product => <Product key={product?.id} product={product} categorySlug={""} details={true} loading={false} />)
                                                    )}
                                                </div>
                                            </div>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        ) : ''}

                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default DesktopNav;
