pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'node -v && npm -v'
      }
    }
    stage('Backend: Install') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'npm ci || npm install'
        }
      }
    }
    stage('Backend: Test') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'npm test'
        }
      }
    }
    stage('Frontend: Install & Build') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm ci || npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Archive Frontend Build (Optional)') {
      when { expression { return fileExists("${FRONTEND_DIR}/dist") } }
      steps {
        archiveArtifacts artifacts: "${FRONTEND_DIR}/dist/**", fingerprint: true
      }
    }
  }

  post {
    success { echo "✅ Pipeline finished successfully." }
    failure { echo "❌ Pipeline failed. See logs above." }
  }
}
