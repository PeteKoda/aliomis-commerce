import isEmpty from 'lodash/isEmpty';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "./Product"

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                arrows: true,
                dots: false
            }
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2,
                arrows: true,
                dots: false
            }
        },
        {
            breakpoint: 726,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false
            }
        }
    ]
}

const Featured = ({ data, featured }) => {

    if (isEmpty(data)) {
        return null;
    }

    console.log(featured)

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <div className="container mx-auto py-20 lg:py-32 px-4" >
                <div data-sal="slide-right" data-sal-delay="300" data-sal-duration="500" data-sal-easing="ease-out-sine">
                    <p className="featured-s-p">{data.subTitle}</p>
                    <h2 className="featured-s-h2">{data.title}</h2>
                </div>
                <div className="py-8 mt-3" style={{ backgroundColor: "#fff" }}>
                    <Slider {...settings}>
                        {featured.edges.map((product, i) => (
                            <div key={product?.node.id} className="pr-0 md:pr-4">
                                <Product product={product.node} categorySlug={""} loading={false}  key={product?.node?.id} details={true} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default Featured
