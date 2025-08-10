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
            // Enforces coverage thresholds via jest.config.js
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

            // ⬇️ Compute coverage % and stamp it onto the build summary
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
      // ⬇️ Stage-level email if BACKEND fails
      post {
        failure {
          emailext(
            subject: "❌ AI Sentiment CI – Backend FAILED (Build #${env.BUILD_NUMBER})",
            to: "jayadeguzman@gmail.com,jdsony1126@gmail.com",
            body: """\
    Build URL: ${env.BUILD_URL}
    Job: ${env.JOB_NAME}
    Stage: Backend: Test

    The backend test/coverage stage failed. Open the build page for logs and the HTML coverage report.
    """
          )
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
      // ⬇️ Stage-level email if FRONTEND fails
      post {
        failure {
          emailext(
            subject: "❌ AI Sentiment CI – Frontend FAILED (Build #${env.BUILD_NUMBER})",
            to: "jayadeguzman@gmail.com,jdsony1126@gmail.com",
            body: """\
    Build URL: ${env.BUILD_URL}
    Job: ${env.JOB_NAME}
    Stage: Frontend: Install & Build

    Frontend build failed. Check console output for details.
    """
          )
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
