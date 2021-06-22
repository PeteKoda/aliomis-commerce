// import Select from 'react-select'

import {useState, useEffect } from "react";
import { useRouter } from "next/router";

const options = [
    { value: 'DATE', label: 'Latest' },
    { value: 'PRICE', label: 'Price Ascending' },
    { value: 'PRICE2', label: 'Price Descending' },
    { value: 'TOTAL_SALES', label: 'Best Sellers' }
]


const OrderSelect = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [selectInputOption, setSelectInputOption] = useState(options[0]);

    const router = useRouter()

    function changeOption (opt){
        handleChange(opt)
        setIsOpen(false)
    }

    function handleChange(selectedOption) {
        setSelectInputOption({ ...selectedOption })

        router.push({
            pathname: '/[categorySlug]' + "/filter",
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
        <div className="relative custom-select ml-auto d-block mb-6" style={{maxWidth: "200px"}}>
            <div onClick={()=> setIsOpen(!isOpen)}>{selectInputOption.label}</div>
            { isOpen && (
                <ul className="absolute">
                    { options && options.map((option, i) => (
                        <li 
                            className={selectInputOption.value === option.value ? 'custom-selected-option' : ''}
                            onClick={(e) => changeOption(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderSelect;