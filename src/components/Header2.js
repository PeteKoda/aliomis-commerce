import Nav from "./Nav";



const Header = (props) => {
    console.log(props)

	return (
		<div className="header">
			<Nav  productCategories={ props.productCategories } />
		</div>
	)
};

export default Header;
