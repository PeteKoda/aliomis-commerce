import Link from "next/link";

const Logo = ({src}) => {
    return (
        <Link href="/">
            <a className="tt-logo tt-logo-alignment">
                <img src={src} alt="wokiee"/>
            </a>
        </Link>
    );
};

export default Logo;
