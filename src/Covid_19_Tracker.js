import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from './components/infoBox/InfoBox';
import LineGraph from './LineGraph';
import Map from "./components/map/Map";
import Table from "./components/table/Table";
import "leaflet/dist/leaflet.css";

function Covid_19_Tracker() {
  //How to write a variable in react - function component
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, 10]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {                            //async -> send a request, wait for it,do something with
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())                         //fetch response
        .then((data) => {
          const countries = data.map((country) => {
            return {
              name: country.country, //United States, United Kingdom
              value: country.countryInfo.iso2, //UK, USA, FR
            }
          });
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        let center = (countryCode === 'worldwide') ? [34.80746, 10] : [data.countryInfo.lat, data.countryInfo.long];
        let zoom = (countryCode === 'worldwide') ? 2 : 4;
        setMapCenter(center)
        setMapZoom(zoom);
        setCountry(countryCode);
        setCountryInfo(data); //all of the data
      })
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select varient="outlined" onChange={onCountryChange} value={country}>
              {/* Loop Through all the countries and show a drop down list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>//understand
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          country={country}
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>

      <Card className="app_right">
        <CardContent>
          <h5>Live Cases by Country</h5>
          <Table countries={tableData} />
          {/* Table */}
          <h5>Worldwide new {casesType}</h5>
          <LineGraph className="app_graph" casesType={casesType} />
          {/* Graph */}
        </CardContent>
      </Card>

    </div>
  );
}

export default Covid_19_Tracker;
