# Jenkins Manual Pipeline Setup Guide

This guide shows you how to set up Jenkins using **Pipeline script** (manual configuration) instead of SCM-based configuration.

## Prerequisites

1. Jenkins installed and running
2. Required plugins installed (see main setup guide)
3. Credentials configured (Docker Hub and Kubernetes)
4. Git repository URL available

## Step-by-Step Manual Setup

### Step 1: Create New Pipeline Job

1. Go to **Jenkins Dashboard**
2. Click **New Item**
3. Enter job name: `cropdarpan-web-ui-pipeline`
4. Select **Pipeline**
5. Click **OK**

### Step 2: Configure Pipeline Script

1. In the job configuration page, scroll to **Pipeline** section
2. Under **Pipeline Definition**, select **Pipeline script** (NOT "Pipeline script from SCM")
3. Open the `Jenkinsfile.manual` file from your project
4. Copy the entire contents
5. Paste into the **Script** text area in Jenkins

### Step 3: Update Git Repository Details

In the pasted script, find these lines and update them with your actual repository information:

```groovy
environment {
    DOCKER_IMAGE = 'sddoon/cropdarpan-frontend'
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    DOCKER_REGISTRY = 'docker.io'
    // Update these with your Git repository details
    GIT_REPO_URL = 'https://github.com/cropdarpan/cropdarpan-web-ui.git'  // ← Update this
    GIT_BRANCH = 'web-migration-btp-25'  // ← Update this if needed
}
```

**Your Repository:**
- **Repository URL**: `https://github.com/cropdarpan/cropdarpan-web-ui.git` (HTTPS)
  - Or use SSH: `git@github.com:cropdarpan/cropdarpan-web-ui.git` (requires SSH key setup)
- **Current Branch**: `web-migration-btp-25`

**Note**: 
- If your repository is **private**, you'll need to add Git credentials (see Troubleshooting section)
- For SSH URLs, you'll need to configure SSH keys in Jenkins
- HTTPS is recommended for easier setup

### Step 4: Verify Credentials IDs

Make sure the credential IDs in the script match what you created in Jenkins:

1. **Docker Hub credentials ID**: Should be `docker-hub-credentials`
2. **Kubernetes config credentials ID**: Should be `kubeconfig-credentials`

If you used different IDs, update them in the script:
- Look for `credentialsId: 'docker-hub-credentials'`
- Look for `credentialsId: 'kubeconfig-credentials'`

### Step 5: Save Configuration

1. Click **Save** at the bottom of the page
2. You'll be redirected to the job page

### Step 6: Run the Pipeline

1. Click **Build Now** on the job page
2. Click on the build number (#1) in the Build History
3. Click **Console Output** to see the build progress

## How It Works

The manual pipeline:
1. **Checkout Stage**: Clones your Git repository using `git clone`
2. **Install Dependencies**: Runs `npm ci`
3. **Lint**: Builds the app to check for errors
4. **Test**: Runs test suite
5. **Build Application**: Creates production build
6. **Build Docker Image**: Builds Docker image
7. **Push Docker Image**: Pushes to Docker Hub
8. **Deploy to Kubernetes**: Deploys to your K8s cluster

## Troubleshooting

### Error: "Repository not found" or "Permission denied"

**Problem**: Git repository URL is incorrect or private repository needs authentication.

**Solution**:
1. If repository is private, you need to add Git credentials:
   - Go to **Manage Jenkins** → **Manage Credentials**
   - Add **SSH Username with private key** or **Username with password**
   - Update the checkout stage in the script:

```groovy
stage('Checkout') {
    steps {
        echo '📦 Checking out source code...'
        script {
            withCredentials([usernamePassword(
                credentialsId: 'git-credentials',
                usernameVariable: 'GIT_USER',
                passwordVariable: 'GIT_PASS'
            )]) {
                sh '''
                    git clone -b ${GIT_BRANCH} https://${GIT_USER}:${GIT_PASS}@github.com/your-username/cropdarpan-web-ui.git .
                '''
            }
        }
    }
}
```

### Error: "npm: command not found"

**Problem**: Node.js/npm is not installed on Jenkins agent.

**Solution**:
1. Install Node.js on your Jenkins agent, OR
2. Use a Docker agent that has Node.js:

```groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    // ... rest of pipeline
}
```

### Error: "docker: command not found"

**Problem**: Docker is not installed or Jenkins user doesn't have permission.

**Solution**:
1. Install Docker on Jenkins agent
2. Add Jenkins user to docker group: `sudo usermod -aG docker jenkins`
3. Restart Jenkins: `sudo systemctl restart jenkins`

### Error: "kubectl: command not found"

**Problem**: kubectl is not installed on Jenkins agent.

**Solution**:
1. Install kubectl on Jenkins agent
2. Or use a Docker image with kubectl pre-installed

## Alternative: Using Pre-checked Code

If you want to skip Git checkout and use code that's already in the workspace:

1. Remove or comment out the Checkout stage
2. Ensure your code is already in the Jenkins workspace (you can manually copy it there)
3. The pipeline will use the existing files

**Modified Checkout Stage:**
```groovy
stage('Checkout') {
    steps {
        echo '📦 Using existing workspace files...'
        sh '''
            if [ ! -f package.json ]; then
                echo "Error: Source code not found. Please ensure code is in workspace."
                exit 1
            fi
            echo "Found package.json, proceeding..."
        '''
    }
}
```

## Advantages of Manual Configuration

✅ Full control over the pipeline script
✅ Easy to modify without committing to Git
✅ Good for testing and experimentation
✅ Can use different scripts for different branches

## Disadvantages

❌ Script changes are not version controlled
❌ Need to manually update script in Jenkins UI
❌ Can't easily track changes to pipeline
❌ More prone to configuration drift

## Next Steps

1. Test the pipeline with a build
2. Monitor the console output for any errors
3. Adjust the script as needed
4. Once stable, consider migrating to SCM-based configuration for better version control

## Quick Reference

**Key Environment Variables to Update:**
- `GIT_REPO_URL`: Your Git repository URL
- `GIT_BRANCH`: Your branch name
- `DOCKER_IMAGE`: Your Docker image name (already set to `sddoon/cropdarpan-frontend`)

**Key Credential IDs:**
- `docker-hub-credentials`: Docker Hub login
- `kubeconfig-credentials`: Kubernetes config file

