import Link from "next/link";
// import { CURRENCY } from "@utils/constant";
// import { CartContext } from "@global/CartContext";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client';
import APPLY_CUSTOMER_COUPON from "../../mutations/coupon";
import REMOVE_CUSTOMER_COUPON from "../../mutations/remove-coupon";
import Skeleton from 'react-loading-skeleton';
import cogoToast from "cogo-toast";



import { v4 } from "uuid";



const CalculateShipping = ({ cart, refetchCart, cartLoading }) => {

    const [coupon, setCoupon] = useState({
        clientMutationId: v4(),
        code: ""
    })

    const [coupons, setCoupons] = useState({
        clientMutationId: v4(),
        codes: []
    })

    const [applyCoupon, { data: couponResponse, loading: couponLoading, error: couponError }] = useMutation(APPLY_CUSTOMER_COUPON, {
        variables: {
            input: coupon
        },
        onCompleted: () => {
            refetchCart()
            cogoToast.success('Coupon applied successfully.', {
                position: 'bottom-right',
                hideAfter: 3
            })
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                cogoToast.error('There was an error with the provided coupon.', {
                    position: 'bottom-right',
                    hideAfter: 3
                })
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    const [removeCoupon, { data: couponRResponse, loading: couponRLoading, error: couponRError }] = useMutation(REMOVE_CUSTOMER_COUPON, {
        variables: {
            input: coupons
        },
        onCompleted: () => {
            // Reload Page Because Cart Prices Returns With Discount Problem
            window.location.reload()
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                alert(error.graphQLErrors[0].message)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    useEffect(() => {
        if (coupons.codes.length > 0) {
            removeCoupon()
        }
    }, [coupons])

    function removeCustomerCoupon() {
        setCoupons({ ...coupons, codes: [cart?.appliedCoupons?.nodes[0].code] })
    }

    return (
        <div className="tt-shopcart-wrapper" style={{position: "sticky",top: "60px"}}>
            {/* <div className="tt-shopcart-box">
                <h4 className="tt-title">ESTIMATE SHIPPING AND TAX</h4>
                <p>Enter your destination to get a shipping estimate.</p>
                <form className="form-default">
                    <div className="form-group">
                        <label htmlFor="address_country">COUNTRY <sup>*</sup></label>
                        <select id="address_country" className="form-control">
                            <option>India</option>
                            <option>France</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_province">STATE/PROVINCE <sup>*</sup></label>
                        <select id="address_province" className="form-control">
                            <option>State/Province</option>
                            <option>Dhaka</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_zip">ZIP/POSTAL CODE <sup>*</sup></label>
                        <input
                            type="text"
                            id="address_zip"
                            name="name"
                            className="form-control"
                            placeholder="Zip/Postal Code"
                        />
                    </div>
                    <Link href="/shop"><a className="btn btn-border">CALCULATE SHIPPING</a></Link>
                    <p>There is one shipping rate available for Alabama, Tanzania, United Republic Of.</p>
                    <ul className="tt-list-dot list-dot-large">
                        <li>International Shipping at $20.00</li>
                    </ul>
                </form>
            </div> */}

            {/* <div className="tt-shopcart-box">
                <h4 className="tt-title">NOTE</h4>
                <p>Add special instructions for your order...</p>
                <form className="form-default">
                    <textarea className="form-control" rows="5"/>
                </form>
            </div> */}

            <div className="tt-shopcart-box flex">
                <input type="text" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value })} className="form-control w-2/3" />
                {
                    couponLoading
                        ?
                        <button className="btn btn-md ml-2" style={{ width: "200px" }}>
                            <div className="loadingio-spinner-eclipse-acxari33u6t"><div className="ldio-hzdb83wvgw">
                                <div></div>
                            </div></div>
                        </button>
                        :
                        <button className="btn btn-md ml-2" style={{ width: "200px" }} onClick={applyCoupon}>
                            <span className="icon icon-check_circle" />ADD COUPON
                        </button>
                }

            </div>

            <div className="tt-shopcart-box tt-boredr-large" style={{ border: "none" }}>
                <table className="tt-shopcart-table01">
                    {(couponLoading || cartLoading) && (
                        <tbody>
                            <th style={{ width: "100%" }}>
                                <Skeleton height={50} width={"100%"} />
                            </th>

                        </tbody>
                    )}
                    {(!couponLoading && !cartLoading) && cart?.appliedCoupons?.nodes[0]?.code && (
                        <tbody>
                            <tr>
                                <th>APPLIED COUPON</th>
                                <td style={{ color: "#839362" }}>
                                    <div className="flex w-full justify-between">
                                        <div>
                                            <div>{cart?.appliedCoupons?.nodes[0].code.toUpperCase()}</div>
                                            <div>
                                                <span>
                                                    save €{(parseFloat(cart.subtotal.replace("€", "").replace(",", ".")).toFixed(2) - parseFloat(cart.totalProductsPrice.replace("€", "").replace(",", ".")).toFixed(2)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>

                                            {(couponRLoading || cartLoading)
                                                ?
                                                <div className="btn-link cursor-pointer" onClick={removeCustomerCoupon}>
                                                    <div className="loadingio-spinner-eclipse-acxari33u6t">
                                                        <div className="ldio-hzdb83wvgw">
                                                            <div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="btn-link cursor-pointer" onClick={removeCustomerCoupon}>
                                                    <i className="icon-h-02" />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {
                        cartLoading
                            ?
                            <tfoot>
                                <tr>
                                    <Skeleton height={50} width={"100%"} />
                                </tr>
                            </tfoot>
                            :
                            <tfoot>
                                <tr>
                                    <th>SUB TOTAL</th>
                                    {cart && cart?.totalProductsPrice && (
                                        <td>{cart.totalProductsPrice}</td>
                                    )}
                                </tr>
                            </tfoot>
                    }


                </table>

                {
                    cartLoading
                        ?
                        <div className="btn btn-lg">
                            <span className="icon icon-check_circle" />PROCEED TO CHECKOUT
                        </div>
                        :
                        <Link href="/checkout/">
                            <a className="btn btn-lg">
                                <span className="icon icon-check_circle" />PROCEED TO CHECKOUT
                             </a>
                        </Link>
                }
            </div>
        </div>
    );
};

export default CalculateShipping;