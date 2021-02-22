import { isEmpty, isArray } from 'lodash';
import Image from 'next/image'

const Clients = ({ clients }) => {

    if (isEmpty(clients)) {
        return null;
    }

    return (
        <div className="my-20">
            <div className={"flex justify-center flex-wrap w-full container m-auto"}>
                { clients && clients.map((client,i) => (
                    <div key={`client-${i}`}>
                        <Image
                            alt={client.image.altText}
                            src={client.image.sourceUrl}
                            layout="fixed"
                            quality={100}
                            width={210}
                            height={100}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Clients
