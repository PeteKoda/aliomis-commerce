import isEmpty from "lodash/isEmpty";
import {useEffect} from "react"
import Image from 'next/image'
import 'sal.js/dist/sal.css';
import sal from 'sal.js'

const Intro = ({ data }) => {

    if (isEmpty(data)) {
        return null;
    }

    useEffect(()=>{
        sal()
    },[])

    return (
        <div className="relative flex items-center justify-center" style={{ minHeight: "50vh" }}>
            <div className="w-full absolute top-0" style={{ height: "50vh", zIndex: "-1" }}>
                <Image
                    alt={data.backgroundImage.altText}
                    src={data.backgroundImage.sourceUrl}
                    layout="fill"
                    quality={100}
                    className={"object-cover"}
                />
            </div>
            <div>
                <h1 className="home-h1 py-4 text-center" data-sal="fade" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">{data.h1}</h1>
            </div>

        </div>
    )
}

export default Intro
