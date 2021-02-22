const Main = ({ data }) => {

    return (
        <div className="container mx-auto py-20 md:py-32 px-4">
            <div className="text-center">
                <h2 className="featured-s-h2">{data.h2}</h2>
                <div className="pt-4" dangerouslySetInnerHTML={{__html: data.description}} />
            </div>
        </div>
    )
}

export default Main
