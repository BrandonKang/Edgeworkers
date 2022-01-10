/* Edgeworkers - Origin Routing based on user location sample
sangjinn@gmail.com, 1st version released on Jan 9th 2022
https://tech.brandonkang.net/
*/

import {logger} from 'log';

export function onClientRequest(request) {
	//Finding client's access country information based on Akamai EdgeScape databased
	const country = (request.userLocation.country) ? request.userLocation.country : 'Not Found';
	const region = (request.userLocation.region) ? request.userLocation.region : 'Not Found';
	logger.log('asccess country is : %s', country);
	logger.log('asccess region is : %s', region);
	
	//Short list of the states of USA
	const us_east = ['VA', 'MA', 'NJ', 'MD', 'DE', 'GA', 'SC', 'WV', 'NY', 'PA', 'VT', 'SC', 'NC'];
	const us_west = ['WA', 'OR', 'ID', 'NV', 'CA', 'ID', 'UT', 'AZ', 'MT', 'WY', 'CO', 'NM', 'SD'];
	const IsUsEast = us_east.includes(region);
	const IsUsWest = us_west.includes(region);
	
	//default origin id
	let origin_id = 'origin-kr';
	logger.log('IsUsEast? : %s', IsUsEast);
	logger.log('IsUsWest? : %s', IsUsWest);

	//Define Origin Routing
	switch(country) {
		case 'KR':
			origin_id = 'origin-kr';
			break;
		case 'US':
			if (IsUsEast) 
				origin_id = 'origin-us-east';
			else if (IsUsWest)
				origin_id = 'origin-us-west';
			else
				origin_id = 'origin-us-etc';
			break;
		default:
			request.respondWith(
				200, 
				{'Content-Type': ['text/html;charset=utf-8']}, 
				'<html><body><h1>The access country is not Korea or the United States.</h1></body></html>');
			break;
	}

	//go to origin to fetch contents
	logger.log('origin_id is : %s', origin_id);
	logger.log('Request path is : %s', request.path);
	logger.log('Request query is : %s', request.query);
	request.route({origin: origin_id, path: request.path, query: request.query});
} 