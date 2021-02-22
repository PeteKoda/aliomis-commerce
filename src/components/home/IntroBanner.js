import { isEmpty, isArray } from 'lodash';
import Image from 'next/image'
import Link from "next/link";
import { useState, useEffect, useRef } from 'react';

const IntroBanner = ({ data }) => {

    if (isEmpty(data)) {
        return null;
    }

    return (
        <div className="relative flex items-center justify-center" style={{ minHeight: "70vh" }}>
            <div className="w-full absolute top-0" style={{ height: "70vh", zIndex: "-1" }}>
                <Image
                    alt={data.backgroundImage.altText}
                    src={data.backgroundImage.sourceUrl}
                    layout="fill"
                    quality={100}
                    className={"object-cover"}
                />
            </div>
            <div>
                <p className="home-up-title text-center">{data.h2}</p>
                <h1 className="home-h1 py-4">{data.h1}</h1>
                <div className="flex justify-center">
                    <Link href="/">
                        <a className="bttn-default inline-block" style={{color:"white", border:"1px solid #ffffff8f"}}>
                            {data.cta.text}
                        </a>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default IntroBanner
