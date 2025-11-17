# ENSAM360

## Backend Flow 

Request Flow Summary
	1.	The frontend sends a request to GET /api/map/locations.
	2.	app.js receives the request and routes all /api paths to mainApiRouter.
	3.	In api/routes/index.js, the /map route is detected and forwarded to mapRoutes.
	4.	In api/routes/map.js, the /locations endpoint triggers mapController.getAllLocations.
	5.	The controller calls mapService.getAllLocations.
	6.	The service executes the Cypher query on Neo4j AuraDB and returns cleaned JSON data.
	7.	The controller sends this JSON back to the frontend with a 200 OK response.
