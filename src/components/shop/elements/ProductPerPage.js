import {useContext} from "react";
import PropTypes from "prop-types";
import {ProductsContext} from "@global/ProductsContext";

const ProductPerPage = ({productPerPage, onProductPerPageHandler}) => {
    const {products} = useContext(ProductsContext);

    let showPerPage = [];

    for (let i = 1, j = 4; j <= products.length; i++, j += 4) {
        let no = 4 * i;
        showPerPage.push(no);
    }

    return (
        <select
            defaultValue={productPerPage}
            style={{minWidth: 50}}
            onChange={event => onProductPerPageHandler(event)}
        >
            {showPerPage.map(item => (
                <option key={item} value={item}>{item}</option>
            ))}
        </select>
    );
};

ProductPerPage.propTypes = {
    productPerPage: PropTypes.number.isRequired,
    onProductPerPageHandler: PropTypes.func.isRequired
}

export default ProductPerPage;