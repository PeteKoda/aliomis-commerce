 import {useContext} from "react";
import cogoToast from "cogo-toast";
import propType from "prop-types";
import {useState} from "react"
import {CartContext} from "@global/CartContext";
import { getUpdatedItems } from "../../functions";
import { v4 } from "uuid";


const Quantity = ({product, products, updateCart, updateCartProcessing}, props) => {
    const {qty} = product;

    const [productCount, setProductCount] = useState(qty);

    const handleQtyChange = (event, cartKey) => {

        if (process.browser) {

            // If the previous update cart mutation request is still processing, then return.
            if (updateCartProcessing) {
                return;
            }

            // If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
            const newQty = (event) ? parseInt(event) : 1;

            // Set the new qty in state.
            setProductCount(newQty);

            console.log(products)

            if (products.length) {

                const updatedItems = getUpdatedItems(products, newQty, cartKey);
                updateCart({
                    variables: {
                        input: {
                            clientMutationId: v4(),
                            items: updatedItems
                        }
                    },
                });
            }

        }
    };

    return (
        <div className="tt-input-counter style-01">
            <span
                className="minus-btn"
                style={{pointerEvents: productCount === 1 ? "none" : "visible"}}
                onClick={() => {
                    handleQtyChange(productCount - 1, product.cartKey)

                    cogoToast.warn('Product Quantity Decrement Successfully!', {
                        position: 'bottom-right',
                        hideAfter: 1
                    })
                }}
            />
            <input
                type="text"
                value={productCount}
                readOnly
            />
            <span
                className="plus-btn"
                onClick={() => {
                    // increment({
                    //     cartId: product.cartId
                    // })
                    handleQtyChange(productCount + 1, product.cartKey)

                    cogoToast.success('Product Quantity Increment Successfully!', {
                        position: 'bottom-right',
                        hideAfter: 1
                    })
                }}
            />
        </div>
    );
};

Quantity.propTypes = {
    product: propType.object.isRequired
}

export default Quantity;