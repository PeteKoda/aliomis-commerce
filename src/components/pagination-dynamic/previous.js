import {isEmpty} from 'lodash';
import {useRouter} from 'next/router';


const Previous = ( {currentPageNo, postName} ) => {
    const router = useRouter();

	if ( ! currentPageNo || isEmpty( postName ) ) {
		return null;
	}

	// If you are on the first page, dont show previous link.
	if ( 0 === currentPageNo - 1 ) {
		return null;
	}

    function changePage() {
        console.log(router)
        router.push({
            pathname: router.pathname,
            query: { ...router.query, page: currentPageNo - 1 },
        }, undefined, { shallow: false, locale: router.locale });
    }

	return (
		<a onClick={() => changePage()}>
			<a className="border border-gray-300 px-3 py-2 mr-4 transition duration-500 ease-in-out hover:bg-gray-500 hover:text-white">Previous</a>
		</a>
	);
};

export default Previous;
