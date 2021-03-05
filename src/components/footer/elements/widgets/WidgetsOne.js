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
                        <Widget title="À Propos">
                            <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor
                            ut labore et dolore. Lorem ipsum dolor amet conse ctetur
                                adipisicing elit, sedo eiusmod tempor incididunt ut labore etdolore. </p>
                        </Widget>
                    </Col>

                    <Col md={6} lg={2} xl={3}>
                        <Widget title="Général">
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
                        <Widget title="Catégories">
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
                                <p><span>Adresse:</span> 7 Rue des Bouchers, 67000 Strasbourg - France</p>
                                <p><span>Téléphone:</span> +03 88 83 32 34</p>
                                <p><span>Horaires d’ouverture:</span> Mardi au Vendredi: 10h00 - 19h30, Samedi: 10h00 - 19h00</p>
                                <p><span>E-mail:</span> <Link href="mailto:info@mydomain.com">info@aliomis.com</Link>
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