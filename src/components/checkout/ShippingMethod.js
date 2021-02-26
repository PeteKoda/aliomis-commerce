import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';



const ShippingMethod = ({ input, handleOnChange, cart, setShippingInput, loading }) => {

    const [isMondial, setIsMondial] = useState(input.shippingMethod && input.shippingMethod.includes("mondial") ? true : false)

    useEffect(() => {


        if (isMondial) {
            initializeMondial()
        } else {
            setIsMondial(true)
        }
    }, []);

    useEffect(() => {
        console.log(input)
        if (input.shippingMethod.includes("mondial")) {
            setIsMondial(true)
            initializeMondial()
        } else {
            setIsMondial(false)
        }
    }, [input.shippingMethod]);


    function initializeMondial() {
        $("#Zone_Widget").MR_ParcelShopPicker({
            //
            // Paramétrage de la liaison avec la page.
            //
            // Selecteur de l'élément dans lequel est envoyé l'ID du Point Relais (ex: input hidden)
            Target: "#Target_Widget",
            //
            // Paramétrage du widget pour obtention des point relais.
            //
            // Le code client Mondial Relay, sur 8 caractères (ajouter des espaces à droite)
            // BDTEST est utilisé pour les tests => un message d'avertissement apparaît
            Brand: "BDTEST  ",
            // Pays utilisé pour la recherche: code ISO 2 lettres.
            Country: "FR",
            // Code postal pour lancer une recherche par défaut
            PostCode: "59000",
            // Mode de livraison (Standard [24R], XL [24L], XXL [24X], Drive [DRI])
            ColLivMod: "24R",
            // Nombre de Point Relais à afficher
            NbResults: "7",
            //
            // Paramétrage d'affichage du widget.
            //
            // Activer l'affichage Responsive.
            Responsive: true,
            // Afficher les résultats sur une carte?
            ShowResultsOnMap: true,

            OnParcelShopSelected:
                (data) => {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    console.log(input)

                    let newInputState = { ...input };

                    console.log(newInputState)

                    newInputState.address1 = data.Adresse1;

                    newInputState.address2 = `Mondial Id: ${data.ID} , Shop Name: ${data.Nom} ${data.Adresse2 && (`, Address 2:${data.Adresse2}`)}`;

                    newInputState.city = data.Ville;

                    newInputState.postcode = data.CP;

                    console.log(newInputState)

                    setShippingInput(newInputState)

                    // this.setState({ inputFields: newInputState, moreInfoTab: true })
                    // this.props.panelReadyHandler(true);
                }
        });
    }
    return (
        <React.Fragment>
            <div className="pt-4" style={{ color: "#4e4e4e" }}>
                <div className="grid grid-cols-2 gap-2 px-4 py-2" style={{ background: "#f8f8f8", fontWeight: "600" }}>
                    <div>
                        Delivery Method
                </div>
                    <div>
                        Shipping Cost
                </div>
                </div>
                {!loading
                    ?
                    <div>
                        {cart && cart?.availableShippingMethods?.[0]?.rates && cart?.availableShippingMethods?.[0]?.rates.map((rts, i) => (
                            <div key={`shipping-rates-${i}`} className="w-full flex px-4 py-2" style={input.shippingMethod === rts.id ? { border: "1px solid blue" } : { border: "none" }}>
                                <div className="w-1/2">
                                    <label>
                                        <input
                                            type="radio"
                                            value={rts.id}
                                            checked={input.shippingMethod === rts.id}
                                            onChange={handleOnChange}
                                            name="shippingMethod"
                                            className="mr-4"
                                        />
                                        {rts.label}
                                    </label>
                                </div>
                                <div className="w-1/2">
                                    {rts.cost}
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div>
                        <Skeleton height={40} width={"100%"} />
                        <Skeleton height={40} width={"100%"} />
                        <Skeleton height={40} width={"100%"} />
                    </div>

                }

            </div>
            <div style={isMondial ? { position: "relative", visibility: "visible" } : { position: "absolute", height: "0px", top: "0", visibility: "hidden" }}>
                <div id="Zone_Widget"></div>
                <input type="text" id="Target_Widget" />
                <div className="hidder"></div>
            </div>


        </React.Fragment>
    );
};

export default ShippingMethod;
