import {slideToggle} from "@utils/method";

const ShopWidget = ({children, title}) => {

    const collapseHandler = (e) => {
        const target = e.target;
        slideToggle(target.nextSibling, 300);
        if(target.parentNode.classList.contains('open')){
            target.parentNode.classList.remove('open');
        }else {
            target.parentNode.classList.add('open');
        }
    }

    return (
        <div className="tt-collapse open" style={{marginBottom: "0px"}}>
            {title && <h3 className="tt-collapse-title px-4 px-md-0" onClick={event => collapseHandler(event)}>{title}</h3>}
            <div className="tt-collapse-content">
                {children}
            </div>
        </div>
    );
};

export default ShopWidget;