const BigLoader = ({ isOpen, text }) => {

    return (
        <div>
            {isOpen && (
                <div class="vertical-centered-box">
                    <div class="content">
                        <div class="loader-circle"></div>
                        <div class="loader-line-mask">
                            <div class="loader-line"></div>
                        </div>

                    </div>
                    <span
                        style={{
                            color: "white",
                            position: "relative",
                            top: "84px",
                            fontSize: "1.3rem"
                        }}
                    >{text}</span>
                </div >
            )}
        </div>

    )
}

export default BigLoader