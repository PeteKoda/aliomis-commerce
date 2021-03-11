import isEmpty from 'lodash/isEmpty';
import Image from 'next/image'
import Link from "next/link";

const AboutUs = ({ data }) => {

    if (isEmpty(data)) {
        return null;
    }

    return (
        <div className="text-center lg:text-left px-4" style={{ backgroundColor: "#9db97b" }}>
            <div className="relative flex flex-wrap items-center justify-center py-20 lg:py-32 container mx-auto">
                <div className=" w-full lg:w-1/2">
                    <div data-sal="slide-right" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">
                        <Image
                            alt={data.image.altText}
                            src={data.image.sourceUrl}
                            layout="responsive"
                            quality={100}
                            width={680}
                            height={480}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex items-end" data-sal="slide-left" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">
                    <div className="about-home-section mx-auto lg:mx-0">
                        <p className="ab-odd-p">{data.subTitle}</p>
                        <h2>{data.title}</h2>
                        <p className="mx-auto lg:mx-0" style={{maxWidth: "468px"}}>{data.description}</p>
                        <div className="inline-block">
                            <Link href={data.cta.link}>
                                <a className="bttn-default" style={{color:"white", border:"1px solid #ffffff8f"}}>
                                    {data.cta.text}
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
