import { EmptyProducts } from "@components/products-ft";
import { ProductOne as Product } from "@components/product-ft";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import OrderSelect from "@components/shop/elements/OrderSelect"

const options = [
    { value: 'DATE', label: 'Latest' },
    { value: 'PRICE', label: 'Price Ascending' },
    { value: 'PRICE2', label: 'Price Descending' },
    { value: 'TOTAL_SALES', label: 'Best Sellers' }
]

const ShopProducts = ({ products, layout, productPerPage, parentCategorySlug }) => {
    const [selectInputOption, setSelectInputOption] = useState(options[0]);

    const router = useRouter();


    function handleChange(selectedOption) {
        setSelectInputOption({ ...selectedOption })

        router.push({
            pathname: '/[parentCategorySlug]/[categorySlug]' + "/filter",
            query: { ...router.query, order: selectedOption.value },
        }, undefined, { shallow: false, locale: router.locale });
    };

    useEffect(() => {
        if(router.query?.order){
            let index = options.findIndex(x => x.value === router.query.order);
            setSelectInputOption(options[index])
        }
    }, [router.query.categorySlug])


    return (
        <div>
            <div>
                <div>
                    <OrderSelect
                        selectInputOption={selectInputOption}
                        handleChange={handleChange}
                        options={options}
                    />
                </div>
            </div>
            <div className={`tt-product-listing ${layout}`}>
                {products?.length > 0 ? products.slice(0, productPerPage).map((product, i) => (
                    <div
                        key={product.id}
                        className="tt-col-item w-1/2 md:w-1/3 px-2"
                    >
                        <Product product={product} page={"shop"} parentCategorySlug={parentCategorySlug} productDisplayNumber={i} />
                    </div>
                )) : (
                    <EmptyProducts />
                )}
            </div>
        </div>
    );
};

export default ShopProducts;