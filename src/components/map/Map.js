import React from 'react';
import { MapContainer, MapConsumer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../util";

function Map({ countries, casesType, center, zoom, country }) {
    return (
        <div className="map">
            <MapContainer
            // center={center} zoom={zoom}
            >
                <MapConsumer>
                    {(map) => {
                        map.setZoom(zoom)
                        map.setView(center);
                        return null
                    }}
                </MapConsumer>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
                />
                {showDataOnMap(countries, casesType,country)}
            </MapContainer>

        </div>
    );
}

export default Map;