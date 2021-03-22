import isEmpty from 'lodash/isEmpty';
import Slider from "react-slick";
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false
            }
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 726,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }
    ]
}

const CategoryCarousel = ({ productCategories }) => {

    if (isEmpty(productCategories)) {
        return null;
    }

    return (
        <div style={{ backgroundColor: "#ece8e8" }}>
            <div className="container mx-auto py-20 lg:py-32 px-4" >
                <div>
                    <p className="featured-s-p">subtitle</p>
                    <h2 className="featured-s-h2">Categories</h2>
                </div>
                <div className="py-8" data-sal="slide-left" data-sal-delay="300" data-sal-duration="500" data-sal-easing="ease-out-sine">
                    <Slider {...settings}>
                        {productCategories.map((category, i) => {
                            if (category.slug !== "boutique") {
                                return (
                                    <div key={`category-sample-${i}`} className="pr-0 md:pr-4">
                                        <Link href={`/${category.slug}`}>
                                            <a>
                                                <img src={category.image ? category.image.sourceUrl : ""} className="m-auto" />
                                            </a>
                                        </Link>
                                    </div>
                                )
                            }
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel
