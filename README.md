# CropDarpan Frontend

This is the frontend application for CropDarpan, containerized using Docker and deployable with Kubernetes.

## Quick Start with Docker

You can quickly run the application using Docker:

```bash
# Pull the image
docker pull sddoon/cropdarpan-frontend:latest

# Run the container
docker run -d -p 80:80 sddoon/cropdarpan-frontend:latest
```

The application will be available at http://localhost

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Kubernetes](https://kubernetes.io/docs/setup/) (for Kubernetes deployment)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (Kubernetes command-line tool)

## Getting Started

### Docker Deployment

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd cropdarpan-web-ui
   ```

2. **Build and Run with Docker Compose**
   ```bash
   # Build and start the container
   docker-compose up --build
   
   # To run in detached mode (background)
   docker-compose up -d
   ```

3. **Access the Application**
   - Open your browser and navigate to: http://localhost

### Kubernetes Deployment

1. **Build the Docker image**
   ```bash
   docker build -t cropdarpan-frontend:latest .
   ```



## Project Structure

```
cropdarpan-web-ui/
├── src/                # Source code
├── public/            # Static files
├── k8s/               # Kubernetes configurations
│   ├── deployment.yaml
│   ├── service.yaml
│   └── namespace.yaml
├── Dockerfile         # Frontend container configuration
├── nginx.conf         # Nginx server configuration
├── docker-compose.yml # Docker compose configuration
└── package.json       # Project dependencies
```

## Development

For local development without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

The application uses the following environment variables:
- `REACT_APP_API_URL`: Backend API URL (if needed)

## Troubleshooting

### Docker Issues

1. **Port 80 is already in use**
   - Change the port in `docker-compose.yml`:
     ```yaml
     ports:
       - "8080:80"  # Change 8080 to any available port
     ```

2. **Container fails to start**
   - Check logs: `docker-compose logs`
   - Ensure no other container is using the same port
   - Try rebuilding: `docker-compose up --build`

3. **Permission Issues**
   - Run Docker commands with sudo if needed
   - Ensure your user is in the docker group



## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

