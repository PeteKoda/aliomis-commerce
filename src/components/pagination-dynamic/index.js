import Link from 'next/link';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {createPaginationLinks} from '@utils/pagination';
import cx from 'classnames';
import Previous from './previous';
import Next from './next';

const Pagination = ( {pagesCount, postName} ) => {
	if ( ! pagesCount || ! postName ) {
		return null;
	}

	const router = useRouter();
	const currentPageNo = parseInt( router?.query?.page ) || 1;

	const paginationLinks = createPaginationLinks( currentPageNo, pagesCount );

    function changePage (pageNum) {
        console.log(pageNum)
        console.log(router)
        router.push({
            pathname: router.pathname,
            query: { ...router.query, page: pageNum },
        }, undefined, { shallow: false, locale: router.locale });
    }

	return (
		<div className="flex justify-center my-8">

			<Previous currentPageNo={currentPageNo} postName={postName}/>

			{paginationLinks.map( ( pageNo, index ) => {

				const paginationLink = `/${postName}/page/${pageNo}/`;

                console.log(paginationLink)

				return (
					'number' === typeof pageNo ? (
						<a key={`id-${index}`} onClick={() => changePage(pageNo)}>
							<a
								className={cx( 'border border-gray-300 px-3 py-2 transition duration-500 ease-in-out hover:bg-gray-500 hover:text-white', {
									'is-active bg-gray-500 text-white': pageNo === currentPageNo
								} )}
							>
								{pageNo}
							</a>
						</a>
					) : (
					// If its "..."
						<span key={`id-${index}`} className="px-3 py-2">{pageNo}</span>
					)
				);
			} )}
			<Next currentPageNo={currentPageNo} pagesCount={pagesCount} postName={postName}/>
		</div>
	);
};

Pagination.propTypes = {
	pagesCount: PropTypes.number,
	postName: PropTypes.string,
};

Pagination.defaultProps = {
	pagesCount: 0,
	postName: 'blog',
};

export default Pagination;
