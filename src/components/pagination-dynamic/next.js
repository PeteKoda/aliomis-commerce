import {isEmpty} from 'lodash';
import {useRouter} from 'next/router';

const Next = ( {currentPageNo, pagesCount, postName} ) => {
    const router = useRouter();

	if ( ! currentPageNo || ! pagesCount || isEmpty( postName ) ) {
		return null;
	}

	// If you are on the last page, dont show next link.
	if ( pagesCount < currentPageNo + 1 ) {
		return null;
	}

    function changePage() {
        console.log(router)
        router.push({
            pathname: router.pathname,
            query: { ...router.query, page: currentPageNo + 1 },
        }, undefined, { shallow: false, locale: router.locale });
    }

	return (
		<a onClick={() => changePage()}>
			<a className="border border-gray-300 px-3 py-2 ml-4 transition duration-500 ease-in-out hover:bg-gray-500 hover:text-white">Next</a>
		</a>
	);
};

export default Next;
