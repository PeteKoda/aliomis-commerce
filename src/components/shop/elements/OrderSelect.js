// import Select from 'react-select'

import {useState } from "react";


const OrderSelect = ({ selectInputOption, handleChange, options }) => {

    const [isOpen, setIsOpen] = useState(false)

    function changeOption (opt){
        handleChange(opt)
        setIsOpen(false)
    }

    console.log(options, selectInputOption)
    return (
        <div className="relative custom-select ml-auto">
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