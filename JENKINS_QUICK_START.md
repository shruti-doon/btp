# Jenkins Quick Start - Manual Configuration

## ✅ Pre-Setup Checklist

- [ ] Jenkins is installed and running
- [ ] Docker Hub credentials created in Jenkins (`docker-hub-credentials`)
- [ ] Kubernetes config file uploaded to Jenkins (`kubeconfig-credentials`)
- [ ] Git repository URL: `https://github.com/cropdarpan/cropdarpan-web-ui.git`
- [ ] Branch name: `web-migration-btp-25`

## 🚀 Quick Setup (5 Steps)

### 1. Create Pipeline Job
- Jenkins Dashboard → **New Item**
- Name: `cropdarpan-web-ui-pipeline`
- Type: **Pipeline** → **OK**

### 2. Configure Pipeline
- Scroll to **Pipeline** section
- **Pipeline Definition**: Select **Pipeline script**
- Open `Jenkinsfile.manual` file
- Copy entire contents

### 3. Paste Script
- Paste into Jenkins **Script** text area
- The script already has your repository URL configured!

### 4. Verify Settings
Check these lines in the script match your setup:
```groovy
GIT_REPO_URL = 'https://github.com/cropdarpan/cropdarpan-web-ui.git'
GIT_BRANCH = 'web-migration-btp-25'
DOCKER_IMAGE = 'sddoon/cropdarpan-frontend'
```

### 5. Save & Run
- Click **Save**
- Click **Build Now**
- Watch the console output!

## 📋 What Happens Next

The pipeline will:
1. ✅ Clone your Git repository
2. ✅ Install npm dependencies
3. ✅ Run tests
4. ✅ Build React application
5. ✅ Build Docker image
6. ✅ Push to Docker Hub
7. ✅ Deploy to Kubernetes

## 🔧 If Something Goes Wrong

**Repository Access Issues?**
- If repo is private, see "Private Repository Setup" in `JENKINS_MANUAL_SETUP.md`

**Docker Issues?**
- Verify Docker Hub credentials ID is `docker-hub-credentials`
- Check Docker is running: `docker ps`

**Kubernetes Issues?**
- Verify kubeconfig credentials ID is `kubeconfig-credentials`
- Test kubectl: `kubectl get nodes`

## 📚 Full Documentation

- **Detailed Manual Setup**: See `JENKINS_MANUAL_SETUP.md`
- **SCM-based Setup**: See `JENKINS_SETUP_GUIDE.md`
- **Troubleshooting**: Both guides have troubleshooting sections

## 🎯 Next Steps After First Successful Build

1. Set up webhooks for automatic builds on Git push
2. Configure build notifications (email, Slack, etc.)
3. Add more stages (security scanning, performance testing)
4. Consider migrating to SCM-based configuration for better version control

