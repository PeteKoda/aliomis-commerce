const NewsletterForm = ({className}) => {
    return (
        <form className={`form-inline form-default ${className ? className : ''}`} method="post" action="#">
            <div className="form-group">
                <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Entrez votre email"
                />
                <button type="submit" className="btn" style={{whiteSpace: 'nowrap'}}>REJOINS NOUS</button>
            </div>
        </form>
    );
};

export default NewsletterForm;