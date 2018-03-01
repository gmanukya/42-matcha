const geolocator = require('geolocator');

geolocator.config({
	language: "en",
	google: {
		version: "3",
		key: "AIzaSyABXGfYEOVF7jisMTy1wt9xMkEeRD1ceUE"
	}
});

exports.coordsToAddress = function(latitude, longitude, callback) {
	const coords = {
		latitude: parseFloat(latitude),
		longitude: parseFloat(longitude)
	};
	geolocator.reverseGeocode(coords, function (err, location) {
		if (err) return 0;
		callback(location);
	});
};

exports.addressToCoords = function(address, callback) {
	geolocator.geocode(address, function (err, location) {
		if (err) {
			callback("");
		}
		else {
			callback(location);
		}
	});
};

exports.locateMe = function(callback) {
	const options = {
		enableHighAccuracy: false,
		timeout: 5000,
		maximumWait: 10000,
		maximumAge: 0,
		desiredAccuracy: 30,
		fallbackToIP: true,
		addressLookup: true,
		timezone: false,
		map: false,
		staticMap: false
	};
	geolocator.locate(options, function (err, location) {
		if (err) return console.log(err);
		callback(location);
	});
};

exports.calcDistance = function(from_lat, from_lon, to_lat, to_lon, callback) {
	callback(geolocator.calcDistance({
		from: {
			latitude: from_lat,
			longitude: from_lon
		},
		to: {
			latitude: to_lat,
			longitude: to_lon
		},
		formula: geolocator.DistanceFormula.PYTHAGOREAN,
		unitSystem: geolocator.UnitSystem.METRIC
	}));
}
