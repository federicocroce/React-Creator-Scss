/* global google */

import React from 'react';

import { setCurrentPlace } from '../../../Actions/actionsCreator';
import KeyValue from '../KeyValue';
import GMaps from './GMaps';

import { connect } from "react-redux";

import $ from 'jquery-lite'

var currentPlace = null;

// const initAutocomplete = (mapElement, searchBox) => {
//     // var map = new google.maps.Map($("#map"), {
//     var map = new google.maps.Map(mapElement, {
//         center: { lat: -33.8688, lng: 151.2195 },
//         zoom: 13,
//         mapTypeId: 'roadmap'
//     });

//     return map;

//     // Create the search box and link it to the UI element.
//     // var input = $("#pac-input");


//     // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//     // Bias the SearchBox results towards current map's viewport.
//     // map.addListener('bounds_changed', function () {
//     //     searchBox.setBounds(map.getBounds());
//     // });


//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.

// };


// const setCurrentPosition = (map, markers, infoWindow) => {
//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             var pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             var icon = {
//                 url: pos.icon,
//                 size: new google.maps.Size(71, 71),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(17, 34),
//                 scaledSize: new google.maps.Size(25, 25)
//             };

//             infoWindow.setPosition(pos);

//             infoWindow.setContent('Location found.');

//             markers.push(new google.maps.Marker({
//                 map: map,
//                 icon: icon,
//                 title: pos.name,
//                 position: pos
//             }));

//             map.setCenter(pos);
//         }, function () {
//             handleLocationError(true, infoWindow, map.getCenter());
//         });
//     } else {
//         // Browser doesn't support Geolocation
//         handleLocationError(false, infoWindow, map.getCenter());
//     }
// }


// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(browserHasGeolocation ?
//         'Error: The Geolocation service failed.' :
//         'Error: Your browser doesn\'t support geolocation.');
// }

const addListener = (searchBox, props) => {
    // searchBox.addListener('places_changed', function (currentPlaceState) {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // Clear out the old markers.
    props.gMapsElements.markers.forEach(function (marker) {
        marker.setMap(null);
    });
    props.gMapsElements.markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        props.gMapsElements.markers.push(new google.maps.Marker({
            map: props.gMapsElements.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
        }));

        currentPlace = {};
        console.log(place.address_components);
        place.address_components.map((place, index) => {
            var types = place.types[0];

            switch (types) {
                case 'street_number':
                    currentPlace.streetNumber = {
                        key: 'Número: ',
                        value: place.long_name
                    }
                    // currentPlace.streetNumber = place.long_name;
                    break;
                case 'route':
                    currentPlace.route = {
                        key: 'Dirección: ',
                        value: place.long_name
                    }
                    // currentPlace.route = place.long_name;
                    break;
                case 'sublocality_level_1':
                    currentPlace.sublocality = {
                        key: 'Zona: ',
                        value: place.long_name
                    }
                    // currentPlace.sublocality = place.long_name;
                    break;
                case 'locality':
                    currentPlace.locality = {
                        key: 'Localidad: ',
                        value: place.short_name
                    }
                    // currentPlace.locality = place.short_name;
                    break;
                case 'administrative_area_level_1':
                    currentPlace.province = {
                        key: 'Provincia: ',
                        value: place.short_name
                    }
                    // currentPlace.province = place.long_name;
                    break;
                case 'country':
                    currentPlace.country = {
                        key: 'País: ',
                        value: place.long_name
                    }
                    // currentPlace.country = place.long_name;
                    break;
                case 'postal_code':
                    currentPlace.postalCode = {
                        key: 'Código Postal: ',
                        value: place.long_name
                    }
                    // currentPlace.postalCode = place.long_name;
                    break;

                default:
                    return currentPlace
            }

            // currentPlace.streetNumber = types == "street_number" ? place.long_name : currentPlace.streetNumber;
            // currentPlace.route = types == "route" ? place.long_name : currentPlace.route;
            // currentPlace.sublocality = types == "sublocality_level_1" ? place.long_name : currentPlace.sublocality;
            // currentPlace.locality = types == "locality" ? place.short_name : currentPlace.locality;
            // currentPlace.province = types == "administrative_area_level_1" ? place.long_name : currentPlace.province;
            // currentPlace.country = types == "country" ? place.long_name : currentPlace.country;
            // currentPlace.postalCode = types == "postal_code" ? place.long_name : currentPlace.postalCode;
        });

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    });
    props.gMapsElements.map.fitBounds(bounds);

    props.setCurrentPlace(currentPlace);

};



class GMapsSechBox extends React.Component {


    componentDidMount() {

        // var mapElement = document.getElementById('map');
        var input = document.getElementById('pac-input');
        // var markers = this.props.markers;

        // var map = this.props.gMapsElements.map;

        // var infoWindow = new google.maps.InfoWindow({ map: map });
        var searchBox = new google.maps.places.SearchBox(input);

        // setCurrentPosition(map, markers, infoWindow);
        searchBox.addListener('places_changed', addListener.bind(null, searchBox, this.props));

        // var place = currentPlace.map((object, index) =>
        //     <p key={index}> {JSON.stringify(object)} </p>
        // )
    }

    render() {

        // var a = this.props;

        return (
            <div>

                <KeyValue dataKeyValue={this.props.currentPlace} />

                <div>
                    <div className="input-text-container">
                        <input id="pac-input" className="inputMaterial" type="text" required placeholder=" " />
                        <label>Search Box</label>
                        <hr />
                    </div>
                </div>
            </div>
        );
    }
}

/*
const GMapsSechBox = (props) => {

                    props.componentDidMount();

                return (
        <div>
                    <input id="pac-input" type="text" placeholder="Search Box" />
                    <div id="map"></div>
                </div>
                );


}*/



const mapStateToProps = state => {
    return {
        gMapsElements: state.maps.gMapsElements
    };
}


const mapDispatchToProps = dispatch => {
    return {
        setCurrentPlace(place) {
            dispatch(setCurrentPlace(place));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GMapsSechBox);

// export default GMapsSechBox;
