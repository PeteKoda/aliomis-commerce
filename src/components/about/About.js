import React from "react"
import Image from 'next/image'


const About = ({ data }) => {

    return (
        <div className="container mx-auto pb-20 md:pb-32 px-4">
            <div className="flex flex-wrap align-center">
                {data && data.map((ab, i) => {
                    if (i % 2 === 0) {
                        return (
                            <React.Fragment key={`ab-content-${i}`}>
                                <div className={`w-full md:w-1/2 flex items-center mt-20`}>
                                    <div className="pr-0 pr-md-5 " style={{ maxWidth: "500px"}}>
                                        <h3 className="featured-s-h2 pb-4">{ab.title}</h3>
                                        <h4 className="featured-s-h3 pb-2">{ab.subtitle}</h4>
                                        <div dangerouslySetInnerHTML={{ __html: ab.description }} />
                                    </div>
                                </div>
                                <div className={`w-full md:w-1/2 mt-20`}>
                                    <div className="relative" style={{ width: "100%", height: "400px", maxWidth: "560px" }}>
                                        <Image
                                            alt={ab.image.altText}
                                            src={ab.image.sourceUrl}
                                            layout="fill"
                                            quality={100}
                                            // width={560}
                                            // height={390}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    } else {
                        return (
                            <React.Fragment key={`ab-content-${i}`}>
                                <div className={`w-full md:w-1/2 mt-20`}>
                                    <div className="relative" style={{ width: "100%", height: "400px", maxWidth: "560px" }}>
                                        <Image
                                            alt={ab.image.altText}
                                            src={ab.image.sourceUrl}
                                            layout="fill"
                                            quality={100}
                                            // width={560}
                                            // height={390}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </div>
                                <div className={`w-full md:w-1/2 flex items-center mt-20`}>
                                    <div className="pl-0 pl-md-5" style={{ maxWidth: "500px"}}>
                                        <h3 className="featured-s-h2 pb-4">{ab.title}</h3>
                                        <h4 className="featured-s-h3 pb-2">{ab.subtitle}</h4>
                                        <div dangerouslySetInnerHTML={{ __html: ab.description }} />
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default About
