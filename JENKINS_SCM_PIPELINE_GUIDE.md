# Jenkins SCM Pipeline Setup Guide

Complete step-by-step guide for setting up Jenkins CI/CD pipeline using **Pipeline script from SCM** (Recommended Method).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Jenkins Plugins](#step-1-install-jenkins-plugins)
3. [Step 2: Configure Jenkins Credentials](#step-2-configure-jenkins-credentials)
4. [Step 3: Create SCM Pipeline Job](#step-3-create-scm-pipeline-job)
5. [Step 4: Configure Git Repository](#step-4-configure-git-repository)
6. [Step 5: Run Your First Build](#step-5-run-your-first-build)
7. [Step 6: Configure Webhooks (Optional)](#step-6-configure-webhooks-optional)
8. [Troubleshooting](#troubleshooting)
9. [Pipeline Stages Overview](#pipeline-stages-overview)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Jenkins Server** installed and running (Jenkins 2.x or later)
- ✅ **Docker** installed and running on Jenkins server/agent
- ✅ **kubectl** installed and configured
- ✅ **Docker Hub account** (or access to another container registry)
- ✅ **Git repository** with your code (GitHub, GitLab, Bitbucket, etc.)
- ✅ **Kubernetes cluster** access (Minikube, cloud provider, or on-premise)

---

## Step 1: Install Jenkins Plugins

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Plugins**
2. Click on the **Available** tab
3. Search and install the following plugins:
   - ✅ **Docker Pipeline** (`docker-workflow`)
   - ✅ **Git** (`git`)
   - ✅ **Pipeline** (`workflow-aggregator`)
   - ✅ **Credentials Binding** (`credentials-binding`)
   - ✅ **Kubernetes CLI** (`kubernetes-cli`) - Optional but recommended
   - ✅ **Pipeline Utility Steps** (`pipeline-utility-steps`) - Optional
   - ✅ **HTML Publisher** (`htmlpublisher`) - Optional, for test reports

4. After installation, click **Restart Jenkins when installation is complete and no jobs are running**

---

## Step 2: Configure Jenkins Credentials

### 2.1 Docker Hub Credentials

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Credentials**
2. Click on **Global** → **Add Credentials** (or click **Add Credentials** if in a domain)
3. Configure as follows:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password or access token (recommended)
   - **ID**: `docker-hub-credentials` ⚠️ **Must match exactly**
   - **Description**: `Docker Hub credentials for pushing images`
4. Click **OK**

> **💡 Tip**: For better security, use Docker Hub **Access Tokens** instead of passwords:
> - Go to Docker Hub → Account Settings → Security → New Access Token
> - Use the token as the password

### 2.2 Kubernetes Config Credentials

1. In the same credentials page, click **Add Credentials** again
2. Configure as follows:
   - **Kind**: `Secret file`
   - **Scope**: `Global`
   - **File**: Click **Choose File** and upload your `~/.kube/config` file
   - **ID**: `kubeconfig-credentials` ⚠️ **Must match exactly**
   - **Description**: `Kubernetes config for deployment`
3. Click **OK**

> **📝 Finding your kubeconfig file:**
> - **Default location**: `~/.kube/config` (or `/home/your-username/.kube/config`)
> - **Minikube**: Created automatically at `~/.kube/config` when you run `minikube start`
> - **Verify**: Run `ls -la ~/.kube/config` in your terminal
> - **Copy to temp location** (if needed):
>   ```bash
>   cp ~/.kube/config /tmp/kubeconfig
>   # Then upload /tmp/kubeconfig to Jenkins
>   ```

### 2.3 Git Credentials (If Repository is Private)

If your Git repository is private, add Git credentials:

1. Click **Add Credentials** again
2. Configure as follows:
   - **Kind**: `Username with password` (for HTTPS) or `SSH Username with private key` (for SSH)
   - **Scope**: `Global`
   - **Username**: Your Git username
   - **Password/Private Key**: Your Git password or SSH private key
   - **ID**: `git-credentials` (or any name you prefer)
   - **Description**: `Git repository credentials`
3. Click **OK**

---

## Step 3: Create SCM Pipeline Job

1. Go to **Jenkins Dashboard** → **New Item**
2. Enter a job name (e.g., `cropdarpan-web-ui-pipeline`)
3. Select **Pipeline** (not "Multibranch Pipeline")
4. Click **OK**

---

## Step 4: Configure Git Repository

This is the **most important step**. You must configure the pipeline to use **"Pipeline script from SCM"**.

1. In the job configuration page, scroll down to the **Pipeline** section
2. Under **Pipeline Definition**, select **Pipeline script from SCM** ⚠️ **This is required!**
3. Configure the SCM settings:

   **SCM**: Select **Git**

   **Repository URL**: Enter your Git repository URL
   ```
   Example: https://github.com/your-username/cropdarpan-web-ui.git
   Or SSH: git@github.com:your-username/cropdarpan-web-ui.git
   ```

   **Credentials**: 
   - If repository is **public**: Leave empty
   - If repository is **private**: Select the Git credentials you created in Step 2.3

   **Branch Specifier**: 
   ```
   */main          (for main branch)
   */master        (for master branch)
   */web-migration-btp-25  (for specific branch)
   */**            (for all branches - not recommended)
   ```

   **Script Path**: `Jenkinsfile` ⚠️ **Must match the filename in your repo**

   **Lightweight checkout**: Leave **unchecked** (we need full checkout for Docker build)

4. Click **Save**

> **⚠️ CRITICAL**: You **MUST** use "Pipeline script from SCM" for the `checkout scm` command in Jenkinsfile to work. Using "Pipeline script" (pasting script directly) will cause errors.

---

## Step 5: Run Your First Build

1. Go to your Jenkins job page
2. Click **Build Now**
3. Click on the build number in the **Build History** (left sidebar)
4. Click **Console Output** to watch the build progress

### What to Expect

The pipeline will execute these stages:

1. ✅ **Checkout** - Clones your repository
2. ✅ **Install Dependencies** - Runs `npm ci`
3. ✅ **Lint** - Builds application to check for errors
4. ✅ **Test** - Runs test suite (if tests exist)
5. ✅ **Build Application** - Creates production build
6. ✅ **Build Docker Image** - Builds Docker image tagged with build number
7. ✅ **Push Docker Image** - Pushes to Docker Hub
8. ✅ **Deploy to Kubernetes** - Deploys to K8s cluster (only on configured branches)

### Build Artifacts

After a successful build:
- **Docker Image**: `sddoon/cropdarpan-frontend:BUILD_NUMBER` and `:latest`
- **Build Artifacts**: Available in build page under "Build Artifacts"
- **Test Results**: Available if tests were run

---

## Step 6: Configure Webhooks (Optional)

To trigger builds automatically on Git push:

### For GitHub:

1. Go to your GitHub repository → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Configure:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
     - Replace `your-jenkins-url` with your Jenkins server URL
     - Example: `http://jenkins.example.com:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: (Optional) Add a secret for security
   - **Which events**: Select **Just the push event**
4. Click **Add webhook**

5. In Jenkins job configuration:
   - Go to **Build Triggers** section
   - Check **GitHub hook trigger for GITScm polling**
   - Click **Save**

### For GitLab:

1. Go to your GitLab repository → **Settings** → **Webhooks**
2. Configure:
   - **URL**: `http://your-jenkins-url/project/your-job-name`
   - **Trigger**: Select **Push events**
   - **Secret token**: (Optional) Add a secret
3. Click **Add webhook**

4. In Jenkins job configuration:
   - Go to **Build Triggers** section
   - Check **Build when a change is pushed to GitLab**
   - Enter your GitLab connection details
   - Click **Save**

---

## Troubleshooting

### Error: `Host key verification failed` or `Could not read from remote repository`

**Problem**: Jenkins is trying to use SSH to connect to Git but doesn't have the SSH host keys, or SSH credentials are not configured.

**Quick Fix**: 
- **Switch to HTTPS** (recommended): Change repository URL from `git@github.com:...` to `https://github.com/...`
- If private repo, add username/password credentials in Jenkins

**Detailed Solution**: See **[JENKINS_SSH_FIX.md](JENKINS_SSH_FIX.md)** for complete troubleshooting guide.

### Error: `'checkout scm' is only available when using "Multibranch Pipeline" or "Pipeline script from SCM"`

**Problem**: You configured the job with "Pipeline script" instead of "Pipeline script from SCM"

**Solution**:
1. Go to your Jenkins job → **Configure**
2. Scroll to **Pipeline** section
3. Change **Pipeline Definition** from **Pipeline script** to **Pipeline script from SCM**
4. Configure your Git repository (see Step 4)
5. Click **Save**

### Error: `docker: command not found`

**Problem**: Docker is not installed or not accessible to Jenkins user

**Solution**:
```bash
# Install Docker (if not installed)
sudo apt-get update
sudo apt-get install docker.io

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Verify Docker is accessible
sudo -u jenkins docker ps
```

### Error: `kubectl: command not found`

**Problem**: kubectl is not installed or not in PATH

**Solution**:
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

### Error: Docker login failed

**Problem**: Docker Hub credentials are incorrect

**Solution**:
1. Verify credentials ID is exactly `docker-hub-credentials`
2. Check username and password/token are correct
3. Test manually: `docker login docker.io -u YOUR_USERNAME -p YOUR_PASSWORD`

### Error: Kubernetes deployment failed

**Problem**: kubeconfig is incorrect or cluster is not accessible

**Solution**:
1. Verify kubeconfig file is correct: `kubectl config view`
2. Test cluster access: `kubectl get nodes`
3. Verify credentials ID is exactly `kubeconfig-credentials`
4. Check if namespace exists: `kubectl get namespaces`

### Error: `npm ci` failed

**Problem**: `package-lock.json` is missing or outdated

**Solution**:
```bash
# In your local repository
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Build fails at "Install Dependencies" stage

**Problem**: Node.js version mismatch or network issues

**Solution**:
- Check Node.js version in Dockerfile (currently `node:18-alpine`)
- Ensure Jenkins has internet access
- Check npm registry is accessible

---

## Pipeline Stages Overview

### Stage 1: Checkout
- Clones repository from Git
- Uses `checkout scm` command (requires SCM configuration)

### Stage 2: Install Dependencies
- Runs `npm ci` for clean install
- Uses `package-lock.json` for reproducible builds

### Stage 3: Lint
- Runs `npm run build` to check for compilation errors
- Non-blocking (continues even if errors found)

### Stage 4: Test
- Runs test suite with `npm test`
- Generates coverage reports
- Non-blocking (continues even if tests fail)

### Stage 5: Build Application
- Creates production build with `npm run build`
- Archives build artifacts
- **Blocking** - build fails if this stage fails

### Stage 6: Build Docker Image
- Builds Docker image using `Dockerfile`
- Tags image with build number and `latest`
- **Blocking** - build fails if this stage fails

### Stage 7: Push Docker Image
- Logs into Docker Hub
- Pushes image with both tags
- **Blocking** - build fails if this stage fails

### Stage 8: Deploy to Kubernetes
- Only runs on configured branches (main, master, web-migration-btp-25)
- Updates Kubernetes deployment with new image
- Waits for rollout to complete
- Verifies deployment status
- **Blocking** - build fails if deployment fails

---

## Customization

### Change Docker Image Name

Edit `Jenkinsfile`:
```groovy
environment {
    DOCKER_IMAGE = 'your-dockerhub-username/your-image-name'
}
```

### Change Deployment Branches

Edit `Jenkinsfile` in the "Deploy to Kubernetes" stage:
```groovy
when {
    anyOf {
        branch 'main'
        branch 'develop'
        branch 'production'
    }
}
```

### Change Kubernetes Namespace

Edit `Jenkinsfile` in the "Deploy to Kubernetes" stage:
```groovy
kubectl set image deployment/cropdarpan-frontend-deployment \
    cropdarpan-frontend-container=${DOCKER_IMAGE}:${DOCKER_TAG} \
    -n your-namespace
```

### Add Environment Variables

Edit `Jenkinsfile`:
```groovy
environment {
    DOCKER_IMAGE = 'sddoon/cropdarpan-frontend'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    DOCKER_REGISTRY = 'docker.io'
    NODE_ENV = 'production'
    API_URL = 'https://api.example.com'
}
```

---

## Security Best Practices

1. ✅ **Never commit credentials** - Always use Jenkins credentials
2. ✅ **Use Docker Hub tokens** instead of passwords
3. ✅ **Restrict Jenkins access** to authorized users only
4. ✅ **Use Kubernetes RBAC** for deployment permissions
5. ✅ **Scan Docker images** for vulnerabilities (consider adding security scanning stage)
6. ✅ **Use secrets management** for sensitive environment variables
7. ✅ **Enable HTTPS** for Jenkins web interface
8. ✅ **Regular updates** - Keep Jenkins and plugins updated

---

## Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)
- [Git Plugin](https://plugins.jenkins.io/git/)

---

## Support

For issues or questions:

1. Check **Jenkins Console Output** for detailed error messages
2. Check **Kubernetes cluster logs**: `kubectl logs -l app=cropdarpan-frontend`
3. Check **Docker build logs** in Jenkins console
4. Verify all prerequisites are met
5. Review troubleshooting section above

---

## Quick Reference

### Required Credentials IDs
- Docker Hub: `docker-hub-credentials`
- Kubernetes: `kubeconfig-credentials`
- Git (if private): `git-credentials` (or your custom ID)

### Key Configuration
- **Pipeline Definition**: Pipeline script from SCM
- **Script Path**: `Jenkinsfile`
- **Docker Image**: `sddoon/cropdarpan-frontend`
- **Deployment Namespace**: `default` (change in Jenkinsfile if needed)

---

**Last Updated**: Based on current project structure
**Jenkinsfile Location**: Root of repository (`/Jenkinsfile`)

