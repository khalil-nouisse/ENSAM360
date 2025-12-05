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

## Running with Docker

You can easily run the entire application (frontend + backend) using Docker Compose.

### Prerequisites
- Docker
- Docker Compose

### Start the Application
Run the following command in the root directory:

```bash
docker-compose up --build
```

To run in the background (detached mode):
```bash
docker-compose up --build -d
```

### Access Links
Once the containers are running, you can access the services at:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Stop the Application
To stop the containers:
```bash
docker-compose down
```
