import Link from "next/link";
import { useContext } from "react";
import Widget from "@components/widget";
import { toCapitalize } from "@utils/toCapitalize";
import footerGeneralData from "@data/footer-general.json";
import { arrSortByCharacter } from "@utils/method";
import { Col, Container, Row } from "react-bootstrap";
import { getProductsUniqueCategories } from "@utils/product";
import { ProductsContext } from "@global/ProductsContext";

const WidgetsOne = ({ className, productCategories }) => {
    const { products } = useContext(ProductsContext);

    return (
        <div className={`tt-footer-col tt-color-scheme-01 ${className ? className : ''}`}>
            <Container>
                <Row>
                    <Col md={6} lg={2} xl={3}>
                        <Widget title="ABOUT US">
                            <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor
                            ut labore et dolore. Lorem ipsum dolor amet conse ctetur
                                adipisicing elit, sedo eiusmod tempor incididunt ut labore etdolore. </p>
                        </Widget>
                    </Col>

                    <Col md={6} lg={2} xl={3}>
                        <Widget title="GENERAL">
                            <ul className="tt-list">
                                {footerGeneralData.map(item => (
                                    <li key={item.id}>
                                        <Link href={item.link}>
                                            <a>{item.text}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Widget>
                    </Col>

                    <Col md={6} lg={2} xl={3}>
                        <Widget title="CATEGORIES">
                            <ul className="tt-list">
                                {productCategories.map((productCategory, i) => (
                                    <li key={productCategory.id + i}>
                                        <Link href={`/${productCategory.slug}/`}>
                                            <a>{productCategory.name}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Widget>
                    </Col>

                    <Col md={6} lg={2} xl={3}>
                        <Widget title="CONTACT">
                            <address>
                                <p><span>Address:</span> 2548 Broaddus Maple Court Avenue, Madisonville KY 4783, USA</p>
                                <p><span>Phone:</span> +777 2345 7885; +777 2345 7886</p>
                                <p><span>Hours:</span> 7 Days a week from 10 am to 6 pm</p>
                                <p><span>E-mail:</span> <Link href="mailto:info@mydomain.com">info@mydomain.com</Link>
                                </p>
                            </address>
                        </Widget>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default WidgetsOne;