import { isEmpty, isArray } from 'lodash';
import Image from 'next/image'
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef } from 'react';
import Product from "./Product"

const settings = {
    dots: true,
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
                dots: true
            }
        },
        {
            breakpoint: 850,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
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

const Featured = ({ data, featured }) => {

    if (isEmpty(data)) {
        return null;
    }

    console.log(featured)

    return (
        <div style={{ backgroundColor: "#ece8e8" }}>
            <div className="container mx-auto py-20 lg:py-32 px-4" >
                <p className="featured-s-p">{data.subTitle}</p>
                <h2 className="featured-s-h2">{data.title}</h2>
                <div className="py-8">
                    <Slider {...settings}>
                        {featured.edges.map((product, i) => (
                            <div key={product?.node.id} className="pr-0 md:pr-4">
                                <Product product={product.node} categorySlug={""} loading={false} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default Featured
