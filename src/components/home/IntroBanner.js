import isEmpty from 'lodash/isEmpty';
import Image from 'next/image'
import Link from "next/link";
import { useEffect } from 'react';
import 'sal.js/dist/sal.css';
import sal from 'sal.js'

const IntroBanner = ({ data }) => {

    useEffect(()=>{
        sal();
    },[])

    if (isEmpty(data)) {
        return null;
    }

    return (
        <div className="relative flex justify-center" style={{ minHeight: "70vh" }}>
            <div className="w-full absolute top-0" style={{ height: "70vh", zIndex: "-1" }}>
                <Image
                    alt={data.backgroundImage.altText}
                    src={data.backgroundImage.sourceUrl}
                    layout="fill"
                    quality={100}
                    className={"object-cover"}
                />
            </div>
            <div data-sal="fade" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back" style={{top: "70px", position: "relative"}}>
                <p className="home-up-title text-center">{data.h2}</p>
                <h1 className="home-h1 py-4">{data.h1}</h1>
                <div className="flex justify-center">
                    <Link href={data.cta.link}>
                        <a className="bttn-default inline-block">
                            {data.cta.text}
                        </a>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default IntroBanner
