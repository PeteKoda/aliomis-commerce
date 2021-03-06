import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';

import { useState, useRef, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import Image from 'next/image'


import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';


const GalleryCarousel = ({ gallery }) => {

    if (isEmpty(gallery) || !isArray(gallery)) {
        return null;
    }

    const [activeImg, setActiveImg] = useState(gallery[0])

    useEffect(()=> {
        setActiveImg(gallery[0])
    },[gallery])

    function changePreview (item, i){
        setActiveImg(item)
    }

    return (
        <div className="flex flex-wrap flex-md-nowrap">
            <div className="flex flex-wrap flex-row md:flex-col justify-evenly order1-2 ig-w w-full">
                {
                    gallery.map((item, index) => {
                        return (
                            <div className={"w-1/2 sm:w-1/3 md:w-full mt-0 md:mt-2"} key={item?.id} >
                                <div className="justify-center flex pt-2 sm: pt-0">
                                    <Image
                                        src={item?.sourceUrl}
                                        alt={item?.altText}
                                        width={118}
                                        height={160}
                                        onClick={() => changePreview(item, index)}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="w-full pl-0 md:pl-4 order2-1 flex">
                <InnerImageZoom src={activeImg?.sourceUrl} zoomType="hover" zoomSrc={activeImg?.mediaItemUrl} />
            </div>
        </div>
    )
}

export default GalleryCarousel
