# CropDarpan Kubernetes Deployment Guide

This guide will help you deploy the CropDarpan frontend application using Kubernetes.

## Prerequisites

Before deploying, ensure you have the following installed:

### 1. Docker
```bash
# Install Docker (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect
```

### 2. Kubernetes (Minikube)
```bash
# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 3. Verify Installation
```bash
docker --version
kubectl version --client
minikube version
```

## Deployment Steps

### Step 1: Start Kubernetes Cluster
```bash
# Start Minikube
minikube start

# Verify cluster is running
kubectl cluster-info
```

### Step 2: Deploy the Application
```bash
# Clone or download the project files
# Navigate to the project directory
cd cropdarpan-web-ui

# Deploy all Kubernetes resources
kubectl apply -f k8s/

# Verify deployment
kubectl get all -l app=cropdarpan-frontend
```

### Step 3: Access the Application
```bash
# Get the service URL
minikube service cropdarpan-frontend-service --url

# The output will be something like:
# http://192.168.49.2:31561
```

### Step 4: Open in Browser
Copy the URL from Step 3 and open it in your web browser to see the CropDarpan application.

## Alternative Access Methods

### Method 1: Port Forwarding
```bash
# Forward local port 8080 to service port 80
kubectl port-forward service/cropdarpan-frontend-service 8080:80

# Access at: http://localhost:8080
```

### Method 2: NodePort (if using NodePort service)
```bash
# Get the NodePort
kubectl get service cropdarpan-frontend-service

# Access at: http://$(minikube ip):<NODEPORT>
```

## Monitoring and Management

### Check Deployment Status
```bash
# View all resources
kubectl get all -l app=cropdarpan-frontend

# Check pod status
kubectl get pods -l app=cropdarpan-frontend

# View pod logs
kubectl logs -l app=cropdarpan-frontend

# Describe service
kubectl describe service cropdarpan-frontend-service
```

### Scaling the Application
```bash
# Scale to 3 replicas
kubectl scale deployment cropdarpan-frontend --replicas=3

# Check scaling status
kubectl get deployment cropdarpan-frontend
```

## Troubleshooting

### Common Issues

#### 1. Pods Not Starting
```bash
# Check pod status
kubectl get pods -l app=cropdarpan-frontend

# Check pod events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

#### 2. Service Not Accessible
```bash
# Check service status
kubectl get service cropdarpan-frontend-service

# Check if pods are ready
kubectl get pods -l app=cropdarpan-frontend

# Verify service selector matches pod labels
kubectl get pods --show-labels
kubectl describe service cropdarpan-frontend-service
```

#### 3. Image Pull Issues
```bash
# Check if image exists
docker pull sddoon/cropdarpan-frontend:latest

# If image doesn't exist, build it locally
docker build -t sddoon/cropdarpan-frontend:latest .
docker push sddoon/cropdarpan-frontend:latest
```

#### 4. Minikube Issues
```bash
# Restart Minikube
minikube stop
minikube start

# Check Minikube status
minikube status

# Reset Minikube (if needed)
minikube delete
minikube start
```

## Cleanup

To remove the deployment:
```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment cropdarpan-frontend
kubectl delete service cropdarpan-frontend-service
kubectl delete namespace cropdarpan

# Stop Minikube
minikube stop
```

## Configuration Files

The deployment uses these files:
- `k8s/namespace.yaml` - Creates the cropdarpan namespace
- `k8s/deployment.yaml` - Defines the application deployment
- `k8s/service.yaml` - Exposes the application via LoadBalancer

## Resource Requirements

- **CPU**: 100m request, 200m limit per pod
- **Memory**: 128Mi request, 256Mi limit per pod
- **Replicas**: 2 (can be scaled up/down)

## Security Notes

- The application runs with default service account
- No special RBAC permissions required
- Uses standard Kubernetes security policies

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check Kubernetes cluster status
4. Review pod logs for specific error messages

---

**Note**: This deployment is configured for development/testing with Minikube. For production deployment, consider using a managed Kubernetes service like EKS, GKE, or AKS.


