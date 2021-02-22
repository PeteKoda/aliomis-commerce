import Layout from "../src/components/Layout";
import Head from "next/head";
import ThankYouC from "../src/components/checkout/ThankYou";

const ThankYou = () => (
    <Layout noHeader={true}>
        <Head>
            <script
                src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"
                crossorigin="anonymous"
            >
            </script>
            <script
                src="https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"
                id="mondial"
            >
            </script>
        </Head>
        <div className="checkout container mx-auto my-20 px-4 xl:px-0" style={{ maxWidth: "1090px" }}>
            <ThankYouC />
        </div>
    </Layout>
);

export default ThankYou;
