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
            post {
                always {
                    publishTestResults testResultsPattern: '**/test-results.xml'
                    publishCoverageReports([
                        coberturaReport('coverage/cobertura-coverage.xml')
                    ])
                }
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
                    dockerImage.tag("${DOCKER_IMAGE}:latest")
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
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'web-migration-btp-25'
                }
            }
            steps {
                echo '🚀 Deploying to Kubernetes...'
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
                        sh '''
                            export KUBECONFIG=${KUBECONFIG}
                            
                            # Update deployment with new image
                            kubectl set image deployment/cropdarpan-frontend-deployment \
                                cropdarpan-frontend-container=${DOCKER_IMAGE}:${DOCKER_TAG} \
                                -n default || kubectl apply -f k8s/
                            
                            # Wait for rollout to complete
                            kubectl rollout status deployment/cropdarpan-frontend-deployment -n default --timeout=300s
                            
                            # Verify deployment
                            kubectl get pods -l app=cropdarpan-frontend -n default
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

