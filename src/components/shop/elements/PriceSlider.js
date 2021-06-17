import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css"

const PriceSlider = ({ maxValue, minValue, value }) => {

    return (
        <InputRange
            maxValue={maxValue}
            minValue={minValue}
            value={value}
            onChange={value => setPriceVal(value)}
            minLabel=""
            maxLabel=""
        />
    );
};

export default PriceSlider;