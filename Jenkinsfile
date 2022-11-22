pipeline {
    agent any

    stages {
        stage('Install Web App') {

            steps {
                dir('demo-webapp') {
                  sh 'npm install'
                   }
            }
        }


        stage('Build Web App'){
            steps {
                   dir('demo-webapp') {
                  sh 'npm run build'
                   }
            }
        }

        stage('Archive Web App'){
            steps {
                sh 'tar -czvf demo-webapp.gz demo-webapp/build'
            }
        }

        stage('Copy artifacts Web App'){
            steps {
          
                sh 'cp demo-webapp.gz ansible/roles/deploy-app/files'
                
            }
        }

          stage('Appending url to inventory'){
            steps {
                sh 'echo $server_url >> ansible/inventory.txt'
                sh "cat ansible/inventory.txt"
                
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
