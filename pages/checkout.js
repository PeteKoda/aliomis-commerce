import Layout from "../src/components/Layout";
import CheckoutForm from "../src/components/checkout/CheckoutForm";
import Head from "next/head";


const Checkout = () => (
    <Layout noHeader={true} >
        <Head>
            <script
                src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"
                crossOrigin="anonymous"
            >
            </script>
            <script
                src="https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"
                id="mondial"
            >
            </script>
        </Head>
        <div className="checkout container mx-auto my-20 px-4 xl:px-0" style={{ maxWidth: "1090px" }}>
            <h1 className="mb-5 text-2xl uppercase">Checkout Page</h1>
            <CheckoutForm />
        </div>
    </Layout>
);

export default Checkout;
