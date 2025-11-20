#!/bin/bash

# CropDarpan Deployment Testing Script
# This script helps verify that your deployment is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="cropdarpan"
DEPLOYMENT="cropdarpan-frontend"
SERVICE="cropdarpan-frontend-service"
LABEL="app=cropdarpan-frontend"

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    print_success "kubectl is available"
}

# Check if namespace exists
check_namespace() {
    if kubectl get namespace $NAMESPACE &>/dev/null; then
        print_success "Namespace '$NAMESPACE' exists"
    else
        print_error "Namespace '$NAMESPACE' does not exist"
        print_info "Create it with: kubectl create namespace $NAMESPACE"
        exit 1
    fi
}

# Check deployment status
check_deployment() {
    print_header "Deployment Status"
    
    if kubectl get deployment $DEPLOYMENT -n $NAMESPACE &>/dev/null; then
        # Get deployment info
        READY=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
        DESIRED=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")
        AVAILABLE=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.availableReplicas}' 2>/dev/null || echo "0")
        UPDATED=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.updatedReplicas}' 2>/dev/null || echo "0")
        
        echo "Deployment: $DEPLOYMENT"
        echo "Ready: $READY/$DESIRED"
        echo "Available: $AVAILABLE/$DESIRED"
        echo "Updated: $UPDATED/$DESIRED"
        
        if [ "$READY" == "$DESIRED" ] && [ "$AVAILABLE" == "$DESIRED" ]; then
            print_success "Deployment is ready and available"
        else
            print_warning "Deployment is not fully ready"
        fi
        
        # Show deployment details
        kubectl get deployment $DEPLOYMENT -n $NAMESPACE
    else
        print_error "Deployment '$DEPLOYMENT' does not exist in namespace '$NAMESPACE'"
        exit 1
    fi
}

# Check pod status
check_pods() {
    print_header "Pod Status"
    
    PODS=$(kubectl get pods -l $LABEL -n $NAMESPACE --no-headers 2>/dev/null | wc -l)
    
    if [ "$PODS" -eq 0 ]; then
        print_error "No pods found with label '$LABEL'"
        exit 1
    fi
    
    print_info "Found $PODS pod(s)"
    kubectl get pods -l $LABEL -n $NAMESPACE
    
    # Check each pod status
    ALL_RUNNING=true
    while IFS= read -r line; do
        POD_NAME=$(echo "$line" | awk '{print $1}')
        STATUS=$(echo "$line" | awk '{print $3}')
        RESTARTS=$(echo "$line" | awk '{print $4}')
        
        if [ "$STATUS" != "Running" ]; then
            ALL_RUNNING=false
            print_warning "Pod $POD_NAME is not running (Status: $STATUS)"
        fi
        
        if [ "$RESTARTS" != "0" ] && [ "$RESTARTS" != "0" ]; then
            print_warning "Pod $POD_NAME has restarted $RESTARTS time(s)"
        fi
    done < <(kubectl get pods -l $LABEL -n $NAMESPACE --no-headers)
    
    if [ "$ALL_RUNNING" = true ]; then
        print_success "All pods are running"
    fi
}

# Check service status
check_service() {
    print_header "Service Status"
    
    if kubectl get service $SERVICE -n $NAMESPACE &>/dev/null; then
        kubectl get service $SERVICE -n $NAMESPACE
        
        # Check endpoints
        ENDPOINTS=$(kubectl get endpoints $SERVICE -n $NAMESPACE -o jsonpath='{.subsets[0].addresses[*].ip}' 2>/dev/null || echo "")
        
        if [ -z "$ENDPOINTS" ]; then
            print_warning "Service has no endpoints (pods might not be ready)"
        else
            print_success "Service has endpoints: $ENDPOINTS"
        fi
    else
        print_error "Service '$SERVICE' does not exist"
        exit 1
    fi
}

# Check image version
check_image() {
    print_header "Running Image Version"
    
    IMAGE=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null)
    
    if [ -n "$IMAGE" ]; then
        print_info "Current image: $IMAGE"
        echo "$IMAGE"
    else
        print_error "Could not determine image version"
    fi
}

# Check rollout status
check_rollout() {
    print_header "Rollout Status"
    
    if kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=5s &>/dev/null; then
        print_success "Rollout is complete"
    else
        print_warning "Rollout might still be in progress or failed"
        print_info "Check with: kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE"
    fi
    
    # Show rollout history
    echo -e "\nRollout History:"
    kubectl rollout history deployment/$DEPLOYMENT -n $NAMESPACE 2>/dev/null || print_warning "Could not get rollout history"
}

# Get service URL
get_service_url() {
    print_header "Access Information"
    
    # Try to get Minikube service URL
    if command -v minikube &> /dev/null; then
        URL=$(minikube service $SERVICE --url -n $NAMESPACE 2>/dev/null || echo "")
        if [ -n "$URL" ]; then
            print_success "Service URL (Minikube):"
            echo -e "${GREEN}$URL${NC}"
            echo ""
        fi
    fi
    
    # Show port forwarding command
    print_info "Or use port forwarding:"
    echo -e "${BLUE}kubectl port-forward service/$SERVICE 8080:80 -n $NAMESPACE${NC}"
    echo "Then access at: http://localhost:8080"
    echo ""
    
    # Show LoadBalancer info if available
    EXTERNAL_IP=$(kubectl get service $SERVICE -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$EXTERNAL_IP" ]; then
        print_success "External IP: $EXTERNAL_IP"
    fi
}

# Check recent events
check_events() {
    print_header "Recent Events"
    
    kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -10 || print_warning "Could not get events"
}

# Check pod logs (last 10 lines)
check_logs() {
    print_header "Recent Pod Logs (last 10 lines)"
    
    PODS=$(kubectl get pods -l $LABEL -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}' 2>/dev/null)
    
    if [ -z "$PODS" ]; then
        print_warning "No pods found to check logs"
        return
    fi
    
    for POD in $PODS; do
        echo -e "\n${BLUE}--- Logs from $POD ---${NC}"
        kubectl logs $POD -n $NAMESPACE --tail=10 2>/dev/null || print_warning "Could not get logs from $POD"
    done
}

# Health check
health_check() {
    print_header "Health Check"
    
    # Try to access the service
    if command -v curl &> /dev/null; then
        # Try port forwarding in background
        PORT=8080
        kubectl port-forward service/$SERVICE $PORT:80 -n $NAMESPACE &>/dev/null &
        PF_PID=$!
        sleep 2
        
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200\|301\|302"; then
            print_success "Application is responding (HTTP 200/301/302)"
            kill $PF_PID 2>/dev/null || true
        else
            print_warning "Application might not be responding correctly"
            kill $PF_PID 2>/dev/null || true
        fi
    else
        print_info "curl not available, skipping HTTP health check"
    fi
}

# Main function
main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║  CropDarpan Deployment Test Script    ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_kubectl
    check_namespace
    check_deployment
    check_pods
    check_service
    check_image
    check_rollout
    get_service_url
    check_events
    check_logs
    health_check
    
    print_header "Test Summary"
    print_success "Deployment test completed!"
    print_info "If all checks passed, your deployment is working correctly."
    print_info "Access the application using the URL/commands shown above."
}

# Run main function
main "$@"

