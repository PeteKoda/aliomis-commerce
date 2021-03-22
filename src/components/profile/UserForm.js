import React from 'react';
import Error from "./../checkout/Error";

const UserForm = ({ input, handleOnChange }) => {
    return (
        <React.Fragment>
            {/*Email*/}
            <div className="">
                <div className="form-group mb-3">
                    <label className="text-xs" htmlFor="email">
                        Email
							<abbr className="required" title="required">*</abbr>
                    </label>
                    <input onChange={handleOnChange} value={input.email} type="email" name="email" className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded" id="email" />
                    <Error errors={input.errors} fieldName={'email'} />
                </div>
            </div>
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

        </React.Fragment>
    );
};

export default UserForm;
