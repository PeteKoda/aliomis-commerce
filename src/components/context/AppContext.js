import React, { useState, useEffect } from 'react';

export const AppContext = React.createContext([
	{},
	() => {}
]);

export const UserContext = React.createContext([
	{},
	() => {}
]);

export const AppProvider = ( props ) => {

    const [ cart, setCart ] = useState( null );
    
    const [ user, setUser ] = useState( null );


	useEffect( () => {
		// @TODO Will add option to show the cart with localStorage later.
		if ( process.browser ) {
			let cartData = localStorage.getItem( 'woo-next-cart' );
			cartData = null !== cartData ? JSON.parse( cartData ) : '';
            setCart( cartData );
            
            let userData = localStorage.getItem( 'woo-user' );
			userData = null !== userData ? JSON.parse( userData ) : '';

            setUser( userData );
		}
	}, [] );

	return (
		<AppContext.Provider value={ [ cart, setCart ] }>
            <UserContext.Provider value={ [ user, setUser ] }>
                { props.children }
            </UserContext.Provider>
		</AppContext.Provider>
	);
};
