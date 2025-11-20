#!/bin/bash

# CropDarpan Kubernetes Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 CropDarpan Kubernetes Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    if ! command -v minikube &> /dev/null; then
        print_error "Minikube is not installed. Please install Minikube first."
        exit 1
    fi
    
    print_status "All prerequisites are installed ✓"
}

# Start Minikube
start_minikube() {
    print_status "Starting Minikube cluster..."
    
    if minikube status | grep -q "Running"; then
        print_warning "Minikube is already running"
    else
        minikube start
        print_status "Minikube started successfully ✓"
    fi
}

# Deploy the application
deploy_application() {
    print_status "Deploying CropDarpan application..."
    
    # Check if k8s directory exists
    if [ ! -d "k8s" ]; then
        print_error "k8s directory not found. Please run this script from the project root."
        exit 1
    fi
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/
    print_status "Kubernetes resources deployed ✓"
}

# Wait for deployment to be ready
wait_for_deployment() {
    print_status "Waiting for deployment to be ready..."
    
    kubectl wait --for=condition=available --timeout=300s deployment/cropdarpan-frontend
    print_status "Deployment is ready ✓"
}

# Get service URL
get_service_url() {
    print_status "Getting service URL..."
    
    URL=$(minikube service cropdarpan-frontend-service --url)
    echo ""
    echo "🎉 Deployment successful!"
    echo "=========================================="
    echo "Your CropDarpan application is available at:"
    echo -e "${GREEN}$URL${NC}"
    echo ""
    echo "You can also access it using port forwarding:"
    echo "kubectl port-forward service/cropdarpan-frontend-service 8080:80"
    echo "Then open: http://localhost:8080"
    echo ""
}

# Show status
show_status() {
    print_status "Current deployment status:"
    kubectl get all -l app=cropdarpan-frontend
    echo ""
}

# Main execution
main() {
    check_prerequisites
    start_minikube
    deploy_application
    wait_for_deployment
    get_service_url
    show_status
    
    print_status "Deployment completed successfully! 🎉"
}

# Run main function
main "$@"


