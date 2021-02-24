import { set } from 'nprogress';
import { useState } from 'react';
import { v4 } from "uuid";
import { getUpdatedItems } from "../../../functions";
import { Cross, Loading } from "../../icons";
import Skeleton from 'react-loading-skeleton';


import ProductView from "../../Product"

const CartItem = ({
    item,
    products,
    updateCartProcessing,
    handleRemoveProductClick,
    updateCart,
    loading,
    itemNumber
}) => {

    const [productCount, setProductCount] = useState(item.qty);

    const [csOpen, setCsOpen] = useState(false);

    /*
     * When user changes the qty from product input update the cart in localStorage
     * Also update the cart in global context
     *
     * @param {Object} event event
     *
     * @return {void}
     */
    // const handleQtyChange = (event, cartKey) => {

    //     if (process.browser) {

    //         event.stopPropagation();

    //         if (updateCartProcessing) {
    //             return;
    //         }

    //         const newQty = (event.target.value) ? parseInt(event.target.value) : 1;

    //         setProductCount(newQty);

    //         if (products.length) {

    //             const updatedItems = getUpdatedItems(products, newQty, cartKey);

    //             updateCart({
    //                 variables: {
    //                     input: {
    //                         clientMutationId: v4(),
    //                         items: updatedItems
    //                     }
    //                 },
    //             });
    //         }

    //     }
    // };

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
        <div className="woo-next-cart-item flex flex-wrap w-full relative" key={item.databaseId}>
            {console.log(products)}
            <div className="block lg:flex w-full">
                <div className="mr-8">
                    <img width="150" src={item.image.sourceUrl} srcSet={item.image.srcSet} alt={item.image.title} className="mx-auto lg:mx-0" />
                </div>
                <div className="w-full pt-4 lg:pt-0">
                    <div>
                        <div className="woo-next-cart-element text-black text-xl font-bold">{item.name}</div>
                        {item.sku && (
                            <div className="flex pt-4">
                                <div className="text-black">Product Code:</div>
                                <div className="pl-4">{item.sku}</div>
                            </div>
                        )}

                        <div className="mt-4 py-8 flex flex-wrap justify-between " style={{ borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray" }}>
                            {/* <div className="woo-next-cart-element">{('string' !== typeof item.price) ? item.price.toFixed(2) : item.price}</div> */}
                            <div className="woo-next-cart-element text-black text-2xl font-bold w-full sm:w-auto order-2 sm:order-1 text-center mt-8 sm:mt-0">
                                {
                                    loading
                                        ?
                                        <div><Skeleton height={38} width={80} /></div>
                                        :
                                        ('string' !== typeof item.totalPrice) ? item.totalPrice.toFixed(2) : item.totalPrice
                                }

                            </div>
                            <div className="flex items-center w-full sm:w-auto order-1 sm:order-2 justify-center">
                                <div className="text-black pr-4 hidden sm:block">Quantity</div>
                                <div className="flex justify-around items-center text-center" style={{ border: "1px solid #ddd", width: "180px", fontSize: "24px", color: "black", minHeight: "42px" }}>
                                    <div className="cursor-pointer w-1/3" style={{ borderRight: "1px solid lightgray" }} onClick={() => handleQtyChange(productCount - 1, item.cartKey)}>-</div>
                                    <div className="w-1/3" style={{ fontFamily: `"EB Garamond",serif` }}>{productCount}</div>
                                    <div className="cursor-pointer w-1/3" style={{ borderLeft: "1px solid lightgray" }} onClick={() => handleQtyChange(productCount + 1, item.cartKey)}>+</div>
                                </div>
                            </div>
                        </div>
                        <div className="woo-next-cart-element woo-next-cart-el-close absolute" style={{ top: "15px", right: "15px" }}>
                            {/* Remove item */}
                            <span className="woo-next-cart-close-icon cursor-pointer"
                                onClick={(event) => handleRemoveProductClick(event, item.cartKey, products)}>
                                <Cross />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">

                {(item.crossSell && item.crossSell.edges.length > 0) && (
                    <div style={{ marginTop: "1rem" }}>
                        <h4 class="tt-collapse-title block md:hidden" onClick={() => setCsOpen(!csOpen)}>Products Best Bought Together</h4>
                        {/* <button className={`m-auto block bttn-btg block md:hidden ${csOpen && ("bttn-btg-active")}`} onClick={() => setCsOpen(!csOpen)}><h3 style={{ color: "white", fontSize: "21px" }}></h3></button> */}
                        { csOpen && (
                            <div className="flex mt-4 mx-auto justify-center flex-wrap" style={{ maxWidth: "556px" }}>
                                {item.crossSell.edges.map((cs, i) => (
                                    <div key={`cross-sell-${i}`} className="w-1/2 flex justify-center">
                                        <ProductView product={cs?.node} customWidth={100} customHeight={120} details={true} bttn={true} bttnClasses={"bttn-small-atc"} categorySlug={cs?.node?.productCategories?.edges[0].node.slug} loading={false} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {(item.crossSell && item.crossSell.edges.length > 0) && (
                    <div className="p-4 mt-4 hidden md:block" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>
                        <h3 className="text-center font-bold text-xl text-black">Products Usually Bought Together</h3>
                        <div className="flex mt-4 mx-auto justify-center flex-wrap" style={{ maxWidth: "556px" }}>
                            {item.crossSell.edges.map((cs, i) => (
                                <div key={`cross-sell-${i}`} className="w-full md:w-1/3 flex justify-center">
                                    <ProductView product={cs?.node} customWidth={100} customHeight={120} details={true} bttn={true} bttnClasses={"bttn-small-atc"} detailClasses={"text-sm"} categorySlug={cs?.node?.productCategories?.edges[0].node.slug} loading={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CartItem;
