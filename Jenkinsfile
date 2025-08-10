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

            archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: true
            publishHTML(target: [
              reportDir: 'coverage/lcov-report',
              reportFiles: 'index.html',
              reportName: 'Backend Coverage Report',
              keepAll: true,
              alwaysLinkToLastBuild: true,
              allowMissing: false
            ])

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
// This Jenkinsfile defines a CI/CD pipeline for a Node.js application with both backend and frontend components.
// It includes stages for checking out the code, installing dependencies, running tests, building the frontend,
// and archiving artifacts. The pipeline uses Node.js version 20 and ensures that the backend tests
// are run with coverage reporting. It also publishes HTML reports for the backend coverage.
// The pipeline is designed to be robust, with error handling and environment management to ensure smooth execution.
// The backend tests are run in a separate stage, and the frontend build is archived if it exists.
// The pipeline is structured to provide clear feedback on success or failure, making it suitable for continuous integration and deployment scenarios.
// It uses the Node.js tool installed in Jenkins and sets up the environment for both backend and frontend directories.
// The backend tests are run with coverage, and the results are archived and published as HTML reports.
// The pipeline also captures the backend coverage percentage and includes it in the build description for easy reference.
// The frontend build is archived if the dist directory exists, ensuring that the build artifacts are available for further stages or deployment.
// The pipeline is designed to be efficient and maintainable, with clear separation of concerns between backend and frontend tasks.
// It uses the `node -e` command to extract coverage        