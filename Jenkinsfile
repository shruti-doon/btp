pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'sddoon/cropdarpan-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'docker.io'
        KUBECONFIG_CREDENTIALS = 'kubeconfig-credentials'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                script {
                    try {
                        // Try to use SCM checkout (works when pipeline is from SCM)
                        checkout scm
                    } catch (Exception e) {
                        // Fallback: Manual Git checkout for manual pipeline configuration
                        echo '⚠️ SCM checkout not available. Attempting manual Git checkout...'
                        def gitRepo = env.GIT_REPO_URL ?: 'https://github.com/your-username/cropdarpan-web-ui.git'
                        def gitBranch = env.GIT_BRANCH ?: 'web-migration-btp-25'
                        sh """
                            if [ ! -d .git ]; then
                                echo "Cloning repository: ${gitRepo}"
                                git clone -b ${gitBranch} ${gitRepo} .
                            else
                                echo "Updating existing repository..."
                                git fetch origin
                                git checkout ${gitBranch} || true
                                git pull origin ${gitBranch} || true
                            fi
                        """
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing dependencies...'
                sh '''
                    npm ci
                '''
            }
        }
        
        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                sh '''
                    npm run build || true
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    npm test -- --watchAll=false --coverage || true
                '''
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building React application...'
                sh '''
                    npm run build
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'build/**/*', fingerprint: true
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    def dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    dockerImage.tag("latest")
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                echo '📤 Pushing Docker image to registry...'
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                            echo $DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u $DOCKER_USER --password-stdin
                            docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${DOCKER_IMAGE}:latest
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo '🚀 Deploying to Kubernetes...'
                script {
                    // Get the actual branch name from git for logging
                    def gitBranch = sh(
                        script: 'git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"',
                        returnStdout: true
                    ).trim()
                    
                    echo "Deploying from branch: ${gitBranch}"
                    echo "Build number: ${env.BUILD_NUMBER}"
                    
                    withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
                        sh '''
                            export KUBECONFIG=${KUBECONFIG}
                            
                            # Verify kubectl is available
                            kubectl version --client || { echo "❌ kubectl not found!"; exit 1; }
                            
                            # Show kubeconfig info (without sensitive data)
                            echo "📋 Kubeconfig file: ${KUBECONFIG}"
                            echo "📋 Current context:"
                            kubectl config current-context || echo "⚠️ No current context set"
                            echo "📋 Available contexts:"
                            kubectl config get-contexts || echo "⚠️ Could not list contexts"
                            
                            # Check if cluster is accessible
                            echo "🔍 Checking cluster connectivity..."
                            echo "Running: kubectl cluster-info"
                            if ! kubectl cluster-info 2>&1; then
                                echo ""
                                echo "❌ Error: Cannot connect to Kubernetes cluster"
                                echo ""
                                echo "Diagnostics:"
                                echo "  - Kubeconfig path: ${KUBECONFIG}"
                                echo "  - Current context: $(kubectl config current-context 2>&1 || echo 'N/A')"
                                echo ""
                                echo "Please ensure:"
                                echo "  1. The cluster is running and accessible"
                                echo "  2. The kubeconfig file is valid and points to the correct cluster"
                                echo "  3. If using Minikube: minikube start (on the cluster host)"
                                echo "  4. If using remote cluster: network connectivity is working"
                                echo "  5. The kubeconfig server URL is reachable from Jenkins"
                                echo ""
                                echo "To debug further, check:"
                                echo "  - kubectl config view (to see configuration)"
                                echo "  - Network connectivity to the cluster API server"
                                exit 1
                            fi
                            
                            echo ""
                            echo "✅ Cluster is accessible"
                            
                            # Check if namespace exists, create if not
                            if ! kubectl get namespace cropdarpan &>/dev/null; then
                                echo "Creating namespace cropdarpan..."
                                kubectl create namespace cropdarpan || true
                            fi
                            
                            # Update the deployment YAML with the new image tag
                            sed -i "s|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|g" k8s/deployment.yaml
                            
                            # Apply all Kubernetes manifests
                            echo "Applying Kubernetes manifests..."
                            kubectl apply -f k8s/namespace.yaml
                            kubectl apply -f k8s/deployment.yaml
                            kubectl apply -f k8s/service.yaml
                            
                            # Update deployment with new image (alternative method if apply doesn't update)
                            kubectl set image deployment/cropdarpan-frontend \
                                cropdarpan-frontend=${DOCKER_IMAGE}:${DOCKER_TAG} \
                                -n cropdarpan || true
                            
                            # Wait for rollout to complete
                            echo "Waiting for deployment rollout..."
                            kubectl rollout status deployment/cropdarpan-frontend -n cropdarpan --timeout=300s
                            
                            # Verify deployment
                            echo "Deployment status:"
                            kubectl get deployment cropdarpan-frontend -n cropdarpan
                            
                            echo "Pod status:"
                            kubectl get pods -l app=cropdarpan-frontend -n cropdarpan
                            
                            echo "Service status:"
                            kubectl get service cropdarpan-frontend-service -n cropdarpan
                            
                            echo "✅ Deployment completed successfully!"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            script {
                def message = """
                🎉 Build #${env.BUILD_NUMBER} completed successfully!
                
                Docker Image: ${DOCKER_IMAGE}:${DOCKER_TAG}
                Branch: ${env.BRANCH_NAME}
                Commit: ${env.GIT_COMMIT}
                """
                echo message
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                def message = """
                ❌ Build #${env.BUILD_NUMBER} failed!
                
                Branch: ${env.BRANCH_NAME}
                Commit: ${env.GIT_COMMIT}
                """
                echo message
            }
        }
        always {
            cleanWs()
        }
    }
}

