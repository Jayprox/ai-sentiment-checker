pipeline {
  agent any

  tools {
    nodejs 'node20'
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
        tool name: 'node20', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        withEnv(["PATH+NODE=${tool(name: 'node20', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation')}/bin"]) {
          dir('backend') {
            sh 'npm ci || npm install'
            sh 'npm test'

            // Archive coverage and publish HTML
            archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: true
            publishHTML(target: [
              reportDir: 'coverage/lcov-report',
              reportFiles: 'index.html',
              reportName: 'Backend Coverage Report',
              keepAll: true,
              alwaysLinkToLastBuild: true,
              allowMissing: false
            ])

            // Compute coverage % and add to build description
            script {
              def cov = sh(
                returnStdout: true,
                script: 'node -e "console.log(require(\'./coverage/coverage-summary.json\').total.lines.pct)"'
              ).trim()
              echo "Backend line coverage: ${cov}%"
              currentBuild.description = "Backend coverage: ${cov}%"
            }
          }
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
    success {
      echo "✅ Pipeline finished successfully."
    }
    failure {
      echo "❌ Pipeline failed. See logs above."
    }
  }
}
