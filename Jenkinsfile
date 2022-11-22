pipeline {
    agent any

    stages {
        stage('Install Web Api') {
            steps {
                dir('demo-api-main') {
                  sh 'npm install'
                }

                sh 'pwd'
                sh 'ls'

                
            }
        }

        stage('Install Web App') {
            // when { changeset "demo-webapp-main/*"}
            steps {
                  sh 'npm install'
            }
        }


        stage('Build Web App'){
            steps {
                  sh 'npm run build'
            }
        }

        stage('Archive Web App'){
            steps {
                sh 'tar -czvf demo-webapp-main.gz demo-webapp-main/build'
            }
        }

        stage('Copy artifacts Web App'){
            steps {
          
                sh 'cp demo-webapp-main.gz task_1/ansible/roles/deploy-web-app/files'
                
            }
        }

        stage (' Configure server ') {
              when {
                  expression { return params.current_status == "closed" && params.merged == true }
              }
            steps {
               ansiblePlaybook become: true, credentialsId: '22a3984f-4c4e-4139-b1cf-ab1cf7753ddd', disableHostKeyChecking: true, installation: 'ansible-playbook', inventory: 'ansible/inventory.txt', playbook: 'ansible/configure-server.yml', sudoUser: null
            }

        }


        stage (' Deploy app ') {
              when {
                  expression { return params.current_status == "closed" && params.merged == true }
              }
            steps {
               ansiblePlaybook become: true, credentialsId: '22a3984f-4c4e-4139-b1cf-ab1cf7753ddd', disableHostKeyChecking: true, installation: 'ansible-playbook', inventory: 'ansible/inventory.txt', playbook: 'ansible/deploy-app.yml', sudoUser: null
            }

        }
        
    }
}
