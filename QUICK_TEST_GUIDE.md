# Quick Test Guide - Verify Deployment in 5 Minutes

## 🚀 Fastest Way to Test Your Deployment

### Step 1: Make a Quick Test Change (1 minute)

Add a visible test indicator to verify your code is deployed:

```bash
# Edit HomePage.js
nano src/views/HomePage.js
```

Add this near the top of the return statement (around line 50-60):

```javascript
// Add this inside the component's return, near the top
<div style={{
  position: 'fixed', 
  top: 10, 
  right: 10, 
  background: '#ff0000', 
  color: 'white', 
  padding: '8px 15px', 
  borderRadius: '5px',
  zIndex: 9999,
  fontSize: '12px'
}}>
  🧪 TEST: {new Date().toLocaleString()}
</div>
```

### Step 2: Commit and Push (30 seconds)

```bash
git add src/views/HomePage.js
git commit -m "Test: Verify deployment - $(date +%Y%m%d-%H%M%S)"
git push origin main
```

### Step 3: Wait for Jenkins (2-3 minutes)

- Go to Jenkins dashboard
- Watch the pipeline run
- Wait for "Deploy to Kubernetes" stage to complete

### Step 4: Run Test Script (30 seconds)

```bash
# Make sure you have kubeconfig set
export KUBECONFIG=/path/to/your/kubeconfig

# Run the test script
./test-deployment.sh
```

### Step 5: Verify in Browser (1 minute)

```bash
# Get the service URL
minikube service cropdarpan-frontend-service --url -n cropdarpan

# Or use port forwarding
kubectl port-forward service/cropdarpan-frontend-service 8080:80 -n cropdarpan
```

Open the URL in your browser. You should see the red "TEST" badge in the top-right corner with the current timestamp.

---

## ✅ Success Checklist

- [ ] Jenkins pipeline completed successfully
- [ ] Test script shows all green checkmarks
- [ ] Application loads in browser
- [ ] Red "TEST" badge is visible with timestamp
- [ ] No errors in browser console (F12)

---

## 🔍 Quick Verification Commands

```bash
# Check deployment status
kubectl get deployment cropdarpan-frontend -n cropdarpan

# Check pods
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan

# Check which image is running
kubectl get deployment cropdarpan-frontend -n cropdarpan -o jsonpath='{.spec.template.spec.containers[0].image}'

# Get service URL
minikube service cropdarpan-frontend-service --url -n cropdarpan
```

---

## 🐛 If Something Goes Wrong

### Old code still showing?

```bash
# Force restart pods
kubectl delete pods -l app=cropdarpan-frontend -n cropdarpan

# Or restart deployment
kubectl rollout restart deployment/cropdarpan-frontend -n cropdarpan
```

### Can't access application?

```bash
# Check if pods are running
kubectl get pods -l app=cropdarpan-frontend -n cropdarpan

# Check pod logs
kubectl logs -l app=cropdarpan-frontend -n cropdarpan --tail=20

# Check service
kubectl get service cropdarpan-frontend-service -n cropdarpan
```

---

## 📝 Alternative: Simpler Test Change

If you don't want to modify code, just change some visible text:

```javascript
// In HomePage.js, find the main heading and change it:
<h1>CropDarpan - Deployed Successfully!</h1>
```

This is easier to spot and verify.

---

## 🎯 What to Look For

1. **Jenkins Console**: Should show all stages as ✅
2. **Test Script Output**: Should show green checkmarks
3. **Browser**: Should show your test change
4. **No Errors**: Browser console (F12) should be clean

If all of these are true, your deployment is working! 🎉

