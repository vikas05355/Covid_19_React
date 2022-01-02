import React from "react";
import numeral from "numeral";
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases:
    {
        hex: "#CC1034",
        multiplier: 800,
    },
    recovered:
    {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths:
    {
        hex: "#fb4443",
        multiplier: 2000,
    },

};

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })

    return sortedData;
};

export const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

//Draw circles on the Map
export const showDataOnMap = (data, casesType, selected_country) => {
    return data.map((country) => {
        if ((selected_country == "worldwide") || (selected_country == country.countryInfo.iso2))
            return <Circle
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                pathOptions={{
                    color: casesTypeColors[casesType].hex,
                    fillColor: casesTypeColors[casesType].hex
                }}

                radius={
                    (Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier) / 1.8
                }
            >
                <Popup>
                    <div className="info-container">
                        <img src={country.countryInfo.flag} className="info-flag mb-2" />
                        {/* <div 
                     className="info-flag"
                      style={{ backgroungImage: `url(${country.countryInfo.flag})`}}
                    ></div> */}
                        <div className="info-name">{country.country}</div>
                        <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                        <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                        <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                    </div>
                </Popup>

            </Circle>
    });
}