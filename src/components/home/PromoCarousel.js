import { isEmpty } from 'lodash';
import Link from "next/link";
import Image from 'next/image'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect, useRef } from 'react';
import Product from "./Product"

const PromoCarousel = ({ bestSellers, offers, promo }) => {

    if (isEmpty(bestSellers)) {
        return null;
    }

    console.log(bestSellers, offers)

    return (
        <div className="container py-20 m-auto px-4">
            <div className="flex flex-wrap items-center mb-20">
                <div className="w-full lg:w-1/2 order1-2 pt-8 lg:pt-0">
                    <div data-sal="slide-right" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back" className="mr-auto ml-auto lg:mr-20" style={{ maxWidth: "468px" }}>
                        <Carousel
                            showThumbs={false}
                            showArrows={true}
                            showStatus={false}
                            swipeable={true}
                        >
                            {offers.edges.map((product, i) => (
                                <Product key={product?.node.id} product={product.node} categorySlug={""} loading={false} />
                            ))}
                        </Carousel>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 order2-1">
                    <div data-sal="slide-left" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back" style={{ maxWidth: "610px" }}>
                        <Image
                            alt={promo.offersImage.altText}
                            src={promo.offersImage.sourceUrl}
                            layout="responsive"
                            quality={100}
                            width={610}
                            height={375}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center mb-20">
                <div className="w-full lg:w-1/2">
                    <div style={{ maxWidth: "610px" }} data-sal="slide-right" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">
                        <Image
                            alt={promo.bestSellersImage.altText}
                            src={promo.bestSellersImage.sourceUrl}
                            layout="responsive"
                            quality={100}
                            width={610}
                            height={375}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 pt-8 lg:pt-0">
                    <div className="mr-auto ml-auto lg:ml-20" style={{ maxWidth: "468px" }} data-sal="slide-left" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">
                        <Carousel
                            showThumbs={false}
                            showArrows={true}
                            showStatus={false}
                            swipeable={true}
                        >
                            {bestSellers.edges.map((product, i) => (
                                <Product key={product?.node.id} product={product.node} categorySlug={""} loading={false} />
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCarousel
