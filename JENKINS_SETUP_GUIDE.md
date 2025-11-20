# Jenkins CI/CD Setup Guide for CropDarpan Web UI

This guide will help you set up Jenkins for automated CI/CD pipeline for the CropDarpan Web UI project.

## Prerequisites

1. **Jenkins Server** - Jenkins 2.x or later installed and running
2. **Required Jenkins Plugins:**
   - Docker Pipeline
   - Kubernetes CLI
   - Git
   - Pipeline
   - Credentials Binding
   - HTML Publisher (optional, for test reports)

3. **System Requirements:**
   - Docker installed and running
   - kubectl configured and accessible
   - Node.js (will be used via Docker)
   - Access to Docker Hub or container registry

## Step 1: Install Required Jenkins Plugins

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Plugins**
2. Install the following plugins:
   - **Docker Pipeline**
   - **Kubernetes CLI**
   - **Git**
   - **Pipeline**
   - **Credentials Binding**
   - **Pipeline Utility Steps**
   - **HTML Publisher** (optional)

## Step 2: Configure Jenkins Credentials

### 2.1 Docker Hub Credentials

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Credentials**
2. Click on **Global** → **Add Credentials**
3. Select **Username with password**
4. Fill in:
   - **ID**: `docker-hub-credentials`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password/token
   - **Description**: Docker Hub credentials for pushing images

### 2.2 Kubernetes Config Credentials

1. In the same credentials page, add another credential
2. Select **Secret file**
3. Fill in:
   - **ID**: `kubeconfig-credentials`
   - **File**: Upload your Kubernetes config file
   - **Description**: Kubernetes config for deployment

**Where to find the kubeconfig file:**
- **Default location**: `~/.kube/config` (or `/home/your-username/.kube/config`)
- **For Minikube**: The file is automatically created at `~/.kube/config` when you run `minikube start`
- **To verify the file exists**: Run `ls -la ~/.kube/config` in your terminal
- **To view the file path**: Run `kubectl config view --raw` to see your current config
- **For cloud providers** (AWS EKS, GKE, AKS): The config is usually downloaded via their CLI tools
- **Alternative**: You can also copy the file to a temporary location and upload from there:
  ```bash
  cp ~/.kube/config /tmp/kubeconfig
  # Then upload /tmp/kubeconfig to Jenkins
  ```

## Step 3: Create Jenkins Pipeline Job

### Option A: Using Jenkinsfile from SCM (Recommended - Use This!)

**⚠️ IMPORTANT**: You must use "Pipeline script from SCM" for the Jenkinsfile to work properly. Using "Pipeline script" directly will cause errors.

1. Go to **Jenkins Dashboard** → **New Item**
2. Enter a job name (e.g., `cropdarpan-web-ui-pipeline`)
3. Select **Pipeline** and click **OK**
4. In the job configuration:
   - **Pipeline Definition**: Select **Pipeline script from SCM** ⚠️ (This is required!)
   - **SCM**: Select **Git**
   - **Repository URL**: Your Git repository URL (e.g., `https://github.com/your-username/cropdarpan-web-ui.git`)
   - **Credentials**: Add if repository is private
   - **Branch Specifier**: `*/web-migration-btp-25` (or `*/main`, `*/master`, or `*/**` for all branches)
   - **Script Path**: `Jenkinsfile` (must match the filename in your repo)
5. Click **Save**

**Why this is required**: The `checkout scm` command in the Jenkinsfile only works when Jenkins knows about your SCM configuration. Without it, you'll get the error: `'checkout scm' is only available when using "Multibranch Pipeline" or "Pipeline script from SCM"`

### Option B: Manual Pipeline Configuration

If you prefer to use manual script configuration (pasting the script directly into Jenkins), see the detailed guide: **[JENKINS_MANUAL_SETUP.md](JENKINS_MANUAL_SETUP.md)**

**Quick steps:**
1. Select **Pipeline script** (not "Pipeline script from SCM")
2. Copy contents from `Jenkinsfile.manual`
3. Update `GIT_REPO_URL` and `GIT_BRANCH` environment variables
4. Paste into Jenkins script editor

**Note**: While manual configuration works, using SCM-based configuration (Option A) is recommended for better version control and easier maintenance.

## Step 4: Configure Jenkins Agent (if needed)

If you're using Jenkins agents:

1. Ensure Docker is installed on the agent
2. Ensure kubectl is installed and configured
3. Add the agent to Jenkins:
   - **Manage Jenkins** → **Manage Nodes and Clouds** → **New Node**
   - Configure the node with appropriate labels

## Step 5: Pipeline Stages Overview

The Jenkinsfile includes the following stages:

1. **Checkout**: Clones the repository
2. **Install Dependencies**: Runs `npm ci` to install dependencies
3. **Lint**: Builds the application to check for errors
4. **Test**: Runs test suite
5. **Build Application**: Creates production build
6. **Build Docker Image**: Builds Docker image with tag
7. **Push Docker Image**: Pushes to Docker Hub
8. **Deploy to Kubernetes**: Deploys to K8s cluster (only on main/master branches)

## Step 6: Running the Pipeline

1. Go to your Jenkins job
2. Click **Build Now**
3. Monitor the build progress in the console output
4. Check build artifacts and test results

## Step 7: Configure Webhooks (Optional)

To trigger builds automatically on Git push:

1. In your Git repository (GitHub/GitLab), go to **Settings** → **Webhooks**
2. Add webhook:
   - **URL**: `http://your-jenkins-url/github-webhook/` (for GitHub)
   - **Content Type**: `application/json`
   - **Events**: Select **Push events**
3. In Jenkins job configuration:
   - Enable **GitHub hook trigger for GITScm polling**

## Customization

### Environment Variables

You can customize the pipeline by modifying environment variables in the Jenkinsfile:

```groovy
environment {
    DOCKER_IMAGE = 'sddoon/cropdarpan-frontend'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    DOCKER_REGISTRY = 'docker.io'
}
```

### Deployment Branches

Modify the `when` condition in the "Deploy to Kubernetes" stage to deploy from different branches:

```groovy
when {
    anyOf {
        branch 'main'
        branch 'master'
        branch 'web-migration-btp-25'
    }
}
```

### Kubernetes Namespace

If deploying to a specific namespace, update the kubectl commands:

```groovy
kubectl set image deployment/cropdarpan-frontend-deployment \
    cropdarpan-frontend-container=${DOCKER_IMAGE}:${DOCKER_TAG} \
    -n your-namespace
```

## Troubleshooting

### Error: 'checkout scm' is only available when using "Multibranch Pipeline" or "Pipeline script from SCM"

**Problem**: This error occurs when you've configured the Jenkins job with "Pipeline script" (pasting the script directly) instead of "Pipeline script from SCM".

**Solution**:
1. Go to your Jenkins job configuration
2. Under **Pipeline** section, change **Pipeline Definition** from **Pipeline script** to **Pipeline script from SCM**
3. Configure your Git repository:
   - **SCM**: Git
   - **Repository URL**: Your Git repo URL
   - **Branch**: Your branch name (e.g., `*/web-migration-btp-25`)
   - **Script Path**: `Jenkinsfile`
4. Save and run the pipeline again

**Alternative**: The updated Jenkinsfile now includes a fallback that will work even without SCM, but using "Pipeline script from SCM" is the recommended approach.

### Docker Login Issues
- Verify Docker Hub credentials are correct
- Check if Docker is running on Jenkins agent
- Ensure Jenkins user has permission to use Docker

### Kubernetes Deployment Issues
- Verify kubeconfig file is correct and has proper permissions
- Check if kubectl is accessible from Jenkins
- Verify Kubernetes cluster is accessible
- Check deployment YAML files in `k8s/` directory

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

## Security Best Practices

1. **Never commit credentials** - Always use Jenkins credentials
2. **Use Docker Hub tokens** instead of passwords
3. **Restrict Jenkins access** to authorized users only
4. **Use Kubernetes RBAC** for deployment permissions
5. **Scan Docker images** for vulnerabilities (consider adding a security scanning stage)

## Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)

## Support

For issues or questions, check:
- Jenkins console output for detailed error messages
- Kubernetes cluster logs: `kubectl logs -l app=cropdarpan-frontend`
- Docker build logs in Jenkins console

