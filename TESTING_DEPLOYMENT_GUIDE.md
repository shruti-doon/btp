# Testing Deployment Guide - Verify Your Code Changes

This guide shows you how to test that your deployment works correctly when you make code changes.

---

## 🎯 Quick Test Workflow

```
1. Make a visible code change
2. Commit and push to Git
3. Trigger Jenkins pipeline (or deploy manually)
4. Verify deployment status
5. Access application and verify changes
```

---

## Method 1: Testing with Jenkins CI/CD Pipeline (Automated)

### Step 1: Make a Test Code Change

Let's make a visible change to verify deployment works. We'll add a version indicator to the homepage.

**Example Test Change:**

```bash
# Edit the HomePage component
nano src/views/HomePage.js
```

Add a visible test element (like a version badge) that you can easily spot:

```javascript
// Add this near the top of the component's return statement
<div style={{position: 'fixed', top: 10, right: 10, background: 'red', color: 'white', padding: '5px 10px', zIndex: 9999}}>
  🧪 TEST BUILD - {new Date().toISOString()}
</div>
```

Or make a simpler change - update text that's visible:

```javascript
// Change any visible text, for example:
<h1>CropDarpan - Updated Version</h1>
```

### Step 2: Commit and Push

```bash
# Stage your changes
git add src/views/HomePage.js

# Commit with a descriptive message
git commit -m "Test: Add visible change to verify deployment"

# Push to trigger Jenkins (if webhook is configured)
git push origin main
```

**Note:** If Jenkins is configured with webhooks, pushing will automatically trigger the pipeline. Otherwise, manually trigger it from Jenkins UI.

### Step 3: Monitor Jenkins Pipeline

1. **Go to Jenkins Dashboard**
   - Open Jenkins URL (usually `http://your-jenkins-server:8080`)
   - Find your pipeline job
   - Click on the running build

2. **Watch the Pipeline Stages:**
   - ✅ Checkout
   - ✅ Install Dependencies
   - ✅ Build Application
   - ✅ Build Docker Image
   - ✅ Push Docker Image
   - ✅ Deploy to Kubernetes

3. **Check for Errors:**
   - If any stage fails, check the console output
   - Fix issues and push again

### Step 4: Verify Deployment Status

Once Jenkins completes, verify the deployment:

```bash
# Set your kubeconfig (if not already set)
export KUBECONFIG=/path/to/your/kubeconfig

# Check deployment status
kubectl get deployment cropdarpan-frontend -n cropdarpan

# Check pod status (should show 2 pods running)
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan

# Check rollout history (to see new deployment)
kubectl rollout history deployment/cropdarpan-frontend -n cropdarpan

# View recent events
kubectl get events -n cropdarpan --sort-by='.lastTimestamp' | tail -20
```

**Expected Output:**
```
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
cropdarpan-frontend     2/2     2            2           5m

NAME                                    READY   STATUS    RESTARTS   AGE
cropdarpan-frontend-7d8f9c4b5d-abc12    1/1     Running   0          2m
cropdarpan-frontend-7d8f9c4b5d-xyz34    1/1     Running   0          2m
```

### Step 5: Verify Image Version

Check which Docker image version is running:

```bash
# Get the image being used
kubectl get deployment cropdarpan-frontend -n cropdarpan -o jsonpath='{.spec.template.spec.containers[0].image}'

# Or describe the deployment
kubectl describe deployment cropdarpan-frontend -n cropdarpan | grep Image
```

**Expected:** Should show the new BUILD_NUMBER tag, e.g., `sddoon/cropdarpan-frontend:42`

### Step 6: Access and Verify Changes

**Option A: Using Minikube Service URL**

```bash
# Get the service URL
minikube service cropdarpan-frontend-service --url -n cropdarpan

# Output will be something like:
# http://192.168.49.2:31561
```

Open this URL in your browser and verify your changes are visible.

**Option B: Using Port Forwarding**

```bash
# Forward local port 8080 to service
kubectl port-forward service/cropdarpan-frontend-service 8080:80 -n cropdarpan

# In another terminal, access:
# http://localhost:8080
```

**Option C: Using LoadBalancer (if available)**

```bash
# Get external IP
kubectl get service cropdarpan-frontend-service -n cropdarpan

# Access using the EXTERNAL-IP
```

### Step 7: Verify Pod Logs

Check that the application is running correctly:

```bash
# Get logs from all pods
kubectl logs -l app=cropdarpan-frontend -n cropdarpan --tail=50

# Or get logs from a specific pod
kubectl logs <pod-name> -n cropdarpan
```

**Look for:**
- No error messages
- Application started successfully
- Serving on port 80

---

## Method 2: Manual Testing (Without Jenkins)

If you want to test locally without Jenkins:

### Step 1: Make Your Code Change

Same as above - make a visible change to verify.

### Step 2: Build Docker Image Locally

```bash
# Build the image with a test tag
docker build -t sddoon/cropdarpan-frontend:test-$(date +%s) .

# Also tag as latest for testing
docker tag sddoon/cropdarpan-frontend:test-* sddoon/cropdarpan-frontend:test-latest
```

### Step 3: Test Locally with Docker

```bash
# Run the container locally first
docker run -d -p 8080:80 --name cropdarpan-test sddoon/cropdarpan-frontend:test-latest

# Access at http://localhost:8080
# Verify your changes are visible

# Stop and remove when done
docker stop cropdarpan-test
docker rm cropdarpan-test
```

### Step 4: Deploy to Kubernetes Manually

```bash
# Update the deployment YAML with your test image
sed -i 's|image: sddoon/cropdarpan-frontend:.*|image: sddoon/cropdarpan-frontend:test-latest|g' k8s/deployment.yaml

# Apply the deployment
kubectl apply -f k8s/deployment.yaml -n cropdarpan

# Or use kubectl set image
kubectl set image deployment/cropdarpan-frontend \
  cropdarpan-frontend=sddoon/cropdarpan-frontend:test-latest \
  -n cropdarpan

# Wait for rollout
kubectl rollout status deployment/cropdarpan-frontend -n cropdarpan --timeout=300s
```

### Step 5: Verify (Same as Step 4-7 above)

---

## 🔍 Verification Checklist

Use this checklist to ensure deployment is successful:

### ✅ Pre-Deployment Checks

- [ ] Code changes committed and pushed
- [ ] Jenkins pipeline triggered (or manual build started)
- [ ] No build errors in Jenkins console

### ✅ Deployment Status Checks

- [ ] Deployment shows `READY 2/2` (or expected replica count)
- [ ] All pods show `STATUS Running`
- [ ] No pod restarts (`RESTARTS` should be 0 or low)
- [ ] Image tag matches expected BUILD_NUMBER

### ✅ Application Health Checks

- [ ] Application is accessible via service URL
- [ ] No 404 or 500 errors
- [ ] Your code changes are visible in the UI
- [ ] Application loads without errors
- [ ] No errors in browser console (F12)

### ✅ Kubernetes Health Checks

- [ ] Readiness probe passing (pod is ready)
- [ ] Liveness probe passing (pod is alive)
- [ ] Service endpoints are correct
- [ ] No error events in `kubectl get events`

---

## 🧪 Quick Test Script

Create a test script to automate verification:

```bash
#!/bin/bash
# test-deployment.sh

NAMESPACE="cropdarpan"
DEPLOYMENT="cropdarpan-frontend"
SERVICE="cropdarpan-frontend-service"

echo "🔍 Testing Deployment..."
echo "========================"

# Check deployment status
echo -e "\n1. Deployment Status:"
kubectl get deployment $DEPLOYMENT -n $NAMESPACE

# Check pod status
echo -e "\n2. Pod Status:"
kubectl get pods -l app=$DEPLOYMENT -n $NAMESPACE

# Check service
echo -e "\n3. Service Status:"
kubectl get service $SERVICE -n $NAMESPACE

# Check rollout status
echo -e "\n4. Rollout Status:"
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE

# Get image version
echo -e "\n5. Running Image:"
kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}'
echo ""

# Check if pods are ready
READY=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
DESIRED=$(kubectl get deployment $DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.replicas}')

if [ "$READY" == "$DESIRED" ]; then
    echo "✅ All pods are ready!"
else
    echo "❌ Not all pods are ready ($READY/$DESIRED)"
fi

# Get service URL
echo -e "\n6. Service URL:"
minikube service $SERVICE --url -n $NAMESPACE 2>/dev/null || echo "Use: kubectl port-forward service/$SERVICE 8080:80 -n $NAMESPACE"
```

Save as `test-deployment.sh`, make executable, and run:

```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## 🐛 Troubleshooting Failed Deployments

### Issue: Pods Not Starting

```bash
# Check pod status
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan

# Describe pod to see errors
kubectl describe pod <pod-name> -n cropdarpan

# Check pod logs
kubectl logs <pod-name> -n cropdarpan

# Common issues:
# - Image pull errors: Check if image exists in Docker Hub
# - Resource limits: Pod might be OOMKilled
# - Health check failures: Application not responding on port 80
```

### Issue: Old Code Still Running

```bash
# Force delete pods to trigger recreation
kubectl delete pods -l app=cropdarpan-frontend -n cropdarpan

# Or restart deployment
kubectl rollout restart deployment/cropdarpan-frontend -n cropdarpan

# Verify new image is pulled
kubectl get deployment cropdarpan-frontend -n cropdarpan -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### Issue: Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints cropdarpan-frontend-service -n cropdarpan

# Should show pod IPs. If empty, selector might be wrong.

# Check service selector matches pod labels
kubectl get service cropdarpan-frontend-service -n cropdarpan -o yaml | grep selector
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan --show-labels
```

### Issue: Image Not Updating

```bash
# Force pull new image
kubectl set image deployment/cropdarpan-frontend \
  cropdarpan-frontend=sddoon/cropdarpan-frontend:NEW_TAG \
  -n cropdarpan

# Or delete pods to force recreation
kubectl delete pods -l app=cropdarpan-frontend -n cropdarpan

# Check image pull policy (should be Always or IfNotPresent)
kubectl get deployment cropdarpan-frontend -n cropdarpan -o yaml | grep imagePullPolicy
```

---

## 📊 Monitoring Deployment Progress

### Watch Deployment in Real-Time

```bash
# Watch pods being created/updated
watch -n 2 'kubectl get pods -l app=cropdarpan-frontend -n cropdarpan'

# Watch deployment status
kubectl get deployment cropdarpan-frontend -n cropdarpan -w

# Watch events
kubectl get events -n cropdarpan --watch
```

### Check Rollout History

```bash
# View rollout history
kubectl rollout history deployment/cropdarpan-frontend -n cropdarpan

# View details of a specific revision
kubectl rollout history deployment/cropdarpan-frontend -n cropdarpan --revision=2

# Rollback if needed
kubectl rollout undo deployment/cropdarpan-frontend -n cropdarpan
```

---

## 🎯 Best Practices for Testing

1. **Make Visible Changes First**
   - Add a version badge or timestamp
   - Change visible text
   - Add console.log with unique identifier

2. **Test Incrementally**
   - Make small changes first
   - Verify each deployment works
   - Then make larger changes

3. **Use Version Tags**
   - Each build should have unique tag
   - Makes it easy to identify what's running
   - Enables easy rollback

4. **Check Logs Regularly**
   - Monitor pod logs for errors
   - Check Jenkins console for build issues
   - Review Kubernetes events

5. **Verify End-to-End**
   - Don't just check deployment status
   - Actually access the application
   - Test functionality, not just deployment

---

## 🔄 Complete Test Workflow Example

Here's a complete example workflow:

```bash
# 1. Make a test change
echo "// TEST: $(date)" >> src/App.js
git add src/App.js
git commit -m "Test deployment - $(date +%Y%m%d-%H%M%S)"
git push origin main

# 2. Wait for Jenkins (or trigger manually)
# Monitor Jenkins console

# 3. Once complete, verify
export KUBECONFIG=/path/to/kubeconfig

# Check status
kubectl get deployment cropdarpan-frontend -n cropdarpan
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan

# Get service URL
minikube service cropdarpan-frontend-service --url -n cropdarpan

# 4. Access and verify
# Open URL in browser
# Check that your changes are visible

# 5. Check logs
kubectl logs -l app=cropdarpan-frontend -n cropdarpan --tail=20

# 6. Clean up test change (optional)
git revert HEAD
git push origin main
```

---

## 📝 Testing Checklist Template

Copy this for each deployment test:

```
Deployment Test - [Date/Time]
==============================

Code Change:
[ ] Description of change made
[ ] File(s) modified: ___________
[ ] Commit hash: ___________

Jenkins Build:
[ ] Build number: ___________
[ ] Build status: [ ] Success [ ] Failed
[ ] Build URL: ___________

Deployment:
[ ] Image tag: ___________
[ ] Deployment status: [ ] Ready [ ] Not Ready
[ ] Pods running: ___/___
[ ] Service accessible: [ ] Yes [ ] No

Verification:
[ ] Application loads: [ ] Yes [ ] No
[ ] Changes visible: [ ] Yes [ ] No
[ ] No errors in console: [ ] Yes [ ] No
[ ] Functionality works: [ ] Yes [ ] No

Notes:
_________________________________
_________________________________
```

---

## 🚀 Quick Commands Reference

```bash
# Check everything at once
kubectl get all -l app=cropdarpan-frontend -n cropdarpan

# Get service URL
minikube service cropdarpan-frontend-service --url -n cropdarpan

# Port forward
kubectl port-forward service/cropdarpan-frontend-service 8080:80 -n cropdarpan

# View logs
kubectl logs -l app=cropdarpan-frontend -n cropdarpan -f

# Restart deployment
kubectl rollout restart deployment/cropdarpan-frontend -n cropdarpan

# Rollback
kubectl rollout undo deployment/cropdarpan-frontend -n cropdarpan

# Delete and recreate
kubectl delete -f k8s/ && kubectl apply -f k8s/
```

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Jenkins pipeline completes without errors
2. ✅ Deployment shows `READY 2/2` (or expected replicas)
3. ✅ All pods show `STATUS Running`
4. ✅ Service is accessible
5. ✅ Application loads in browser
6. ✅ Your code changes are visible
7. ✅ No errors in browser console
8. ✅ No errors in pod logs

If all these are true, your deployment worked! 🎉

