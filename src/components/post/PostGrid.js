import Link from "next/link";
import dateFormat from "dateformat";
import Image from 'next/image'


const PostGrid = ({ slug, title, excerpt, thumb, categories, date, altText }) => {
    return (
        <div className="tt-blog-thumb">
            <div className="tt-img">
                <Link href={`${slug}`}>
                    <a>
                        <Image
                            alt={altText}
                            src={thumb}
                            layout="responsive"
                            quality={100}
                            width={210}
                            height={200}
                            className="rounded"
                        />
                    </a>
                </Link>
            </div>

            <div className="tt-title-description">
                <div className="tt-background" />
                <div className="tt-tag">
                    {categories.map((category, i) => <Link href={`${slug}`} key={i}><a>{category.node.name}</a></Link>)}
                </div>
                <div className="tt-title">
                    <Link href={`${slug}`}><a>{title}</a></Link>
                </div>
                {/* <p>{excerpt}</p> */}
                <div className="article-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
                <div>
                    <Link href={`${slug}`}>
                        <a className="text-black mt-4 relative" style={{ top: "10px" }}>
                            Lire la suite
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostGrid;