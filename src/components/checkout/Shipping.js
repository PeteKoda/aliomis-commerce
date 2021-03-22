import React from 'react';
import countryList from './country-list';
import Error from "./Error";

const Shipping = ({ input, handleOnChange }) => {
    return (
        <React.Fragment>
            {/*Name*/}
            <div className="grid grid-cols-2 gap-2">
                <div className="">
                    <div className="form-group mb-3">
                        <label className="text-xs" htmlFor="first-name">
                            Prénom
							<abbr className="required" title="required">*</abbr>
                        </label>
                        <input onChange={handleOnChange} value={input.firstName} type="text" name="firstName" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="first-name" />
                        <Error errors={input.errors} fieldName={'firstName'} />
                    </div>
                </div>
                <div className="">
                    <div className="form-group mb-3">
                        <label className="text-xs" htmlFor="last-name">
                            Nom
							<abbr className="required" title="required">*</abbr>
                        </label>
                        <input onChange={handleOnChange} value={input.lastName} type="text" name="lastName" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="last-name" />
                        <Error errors={input.errors} fieldName={'lastName'} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {/* Country */}
                <div>
                    <label className="text-xs" htmlFor="country-select">
                        Pays
					<abbr className="required" title="required">*</abbr>
                    </label>
                    <select onChange={handleOnChange} value={input.country} style={{ height: "37px" }} name="country" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="country-select">
                        <option value="">Sélectionnez un pays...</option>
                        {countryList.length && (
                            countryList.map((country, index) => (
                                <option key={`${country}-${index}`} value={country.countryCode}>{country.countryName}</option>
                            ))
                        )}
                    </select>
                    <Error errors={input.errors} fieldName={'country'} />
                </div>

                {/* Town/City */}
                <div className="form-group mb-3">
                    <label className="text-xs" htmlFor="city">
                        Ville
					<abbr className="required" title="required">*</abbr>
                    </label>
                    <input onChange={handleOnChange} value={input.city} type="text" name="city" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="city" />
                    <Error errors={input.errors} fieldName={'city'} />
                </div>
            </div>
            {/* Street Address */}
            <div className="grid grid-cols-2 gap-2">
                <div className="">
                    <label className="text-xs" htmlFor="street-address">
                    Adresse postale
					<abbr className="required" title="required">*</abbr>
                    </label>
                    <input type="text" onChange={handleOnChange} value={input.address1} name="address1" placeholder="House number and street name" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded mb-3" id="street-address" />
                    <Error errors={input.errors} fieldName={'address1'} />
                </div>

                <div style={{ marginTop: "1.7rem" }}>
                    <input type="text" onChange={handleOnChange} value={input.address2} name="address2" placeholder="Apartment, suite, unit etc.(optional)" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="first-name" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                {/* County */}
                <div>
                    <label className="text-xs" htmlFor="state">
                        Région
					<abbr className="required" title="required">*</abbr>
                    </label>
                    <input onChange={handleOnChange} value={input.state} type="text" name="state" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="state" />
                    <Error errors={input.errors} fieldName={'state'} />
                </div>
                {/* Post Code */}
                <div >
                    <label className="text-xs" htmlFor="post-code">
                        Code postal
					<abbr className="required" title="required">*</abbr>
                    </label>
                    <input onChange={handleOnChange} value={input.postcode} type="text" name="postcode" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="post-code" />
                    <Error errors={input.errors} fieldName={'postcode'} />
                </div>
            </div>

            {/* Company Name */}
            <div className="form-group mb-3">
                <label className="text-xs" htmlFor="first-name">Nom entreprise (facultatif)</label>
                <input onChange={handleOnChange} value={input.company} type="text" name="company" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="first-name" />
                <Error errors={input.errors} fieldName={'company'} />
            </div>
            {/*	@TODO Create an Account */}
            {/*<div className="form-check">*/}
            {/*	<label className="text-xs" className="form-check-label">*/}
            {/*		<input onChange={ handleOnChange } className="form-check-input" name="createAccount" type="checkbox"/>*/}
            {/*			Create an account?*/}
            {/*	</label>*/}
            {/*</div>*/}
            {/*<h2 className="mt-4 mb-4">Additional Information</h2>*/}
            {/* @TODO Order Notes */}
            {/*<div className="form-group mb-3">*/}
            {/*	<label className="text-xs" htmlFor="order-notes">Order Notes</label>*/}
            {/*	<textarea onChange={ handleOnChange } defaultValue={ input.orderNotes } name="orderNotes" className="form-control woo-next-checkout-textarea" id="order-notes" rows="4"/>*/}
            {/*	<Error errors={ input.errors } fieldName={ 'orderNotes' }/>*/}
            {/*</div>*/}
        </React.Fragment>
    );
};

export default Shipping;
