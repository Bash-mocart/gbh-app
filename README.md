# GBH - Demo API

# gbh-api

## Stacks 
    * AWS
    * Jenkins
    * Ansible
    * Npm
    * Nodejs 16.13.1


## Goal
The goal of this project is to automate the deployment of `demo-app` into EC2 instance. I used Jenkins to install the dependencies and build the artifacts which then ansible to configure the servers and deploy the application. 

![CI/CD Chart](./images/ci-cd.png?raw=true "ci-cd") 

Ansible runs only after the PR is merged. This was achieved using a Generic Webhook Trigger https://plugins.jenkins.io/generic-webhook-trigger/. I had to parse the contents of the webhook PR payload and extract values that shows a PR is merged. Using those values, I set a when condition for my ansible stage



```
 stage (' Configure server ') {
              when {
                  expression { return params.current_status == "closed" && params.merged == true }
              }
            steps {
               ansiblePlaybook become: true, credentialsId: '22a3984f-4c4e-4139-b1cf-ab1cf7753ddd', disableHostKeyChecking: true, installation: 'ansible-playbook', inventory: 'ansible/inventory.txt', playbook: 'ansible/configure-server.yml', sudoUser: null
            }

        }  // replace the credentialsId with yours

        stage (' Deploy app ') {
              when {
                  expression { return params.current_status == "closed" && params.merged == true }
              }
            steps {
               ansiblePlaybook become: true, credentialsId: '22a3984f-4c4e-4139-b1cf-ab1cf7753ddd', disableHostKeyChecking: true, installation: 'ansible-playbook', inventory: 'ansible/inventory.txt', playbook: 'ansible/deploy-app.yml', sudoUser: null
            }

        } // replace the credentialsId with yours

```

Builds are discarded after one day using a Build Discarder jenkins plugin https://plugins.jenkins.io/build-discarder/

```
pipeline {
    agent any
    options {
    buildDiscarder(logRotator(artifactDaysToKeepStr: '1'))
  }

```

## Steps to reproduce
* Create an EC2 Ubuntu Instance https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html

* Install Jenkins, Npm, and Nodejs v16.13.1 in the instance you just created https://nodejs.org/en/download/package-manager/, https://www.jenkins.io/doc/book/installing/linux/

* Install Generic Webhook Trigger, Ansible and Build Discarder jenkins plugin
https://www.jenkins.io/doc/book/managing/plugins/


* Create a credential containing the Private keys of the target EC2. See here 
https://www.jenkins.io/doc/book/using/using-credentials/

* Get the credential id and replace accordingly check on the below block

```

stage (' Configure server ') {
              when {
                  expression { return params.current_status == "closed" && params.merged == true }
              }
            steps {
               ansiblePlaybook become: true, credentialsId: '22a3984f-4c4e-4139-b1cf-ab1cf7753ddd', disableHostKeyChecking: true, installation: 'ansible-playbook', inventory: 'ansible/inventory.txt', playbook: 'ansible/configure-server.yml', sudoUser: null
            }

        }  // replace the credentialsId with yours

```




* Create a jenkins pipeline and set it up as follows

    * Create a parameter like the below, it should have a default value of your target ec2 instance ip and set the REACT_APP_API_URL

    ![Jenkins 1](./images/jen-1.jpg?raw=true "jenkins") 
    ![Jenkins a](./images/app.jpg?raw=true "jenkins") 

    * Make sure the Generic Webhook Trigger is installed, and then use the below image as guide to configure it to parse the contents of the webhook payload. We will use that as condition for our ansible 

    ![Jenkins 2](./images/jen-2.jpeg?raw=true "jenkins") 
    ![Jenkins 3](./images/jen-3.jpeg?raw=true "jenkins") 
    ![Jenkins 4](./images/jen-4.jpeg?raw=true "jenkins") 
    in the below image, the token should be any random string you would need it in the subsequent steps
    ![Jenkins 5](./images/jen-5.jpeg?raw=true "jenkins") 

    * Here you just set up the github repo with your credentials. This lets jenkins clones the repo from github. See here for how to create github credentials on jenkins https://www.jenkins.io/doc/book/using/using-credentials/. 

    Keep in mind that your password should be your github auth token. You can see this guide on how to create github access token https://www.jenkins.io/doc/book/using/using-credentials/

    ![Jenkins 6](./images/jen-6.jpeg?raw=true "jenkins") 

* Then you need to create a github webhook use http://<JENKINS:PORT>/generic-webhook-trigger/invoke?token=YOURTOKEN as the payload url, and application/json as the content type see here https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks, choose the option "Let me select individual events." and select only "Pull request".

* To test it, on the dashboard, click on the project and click on Build with parameters, and click on build.

    ![Jenkins 7](./images/jen-7.jpeg?raw=true "jenkins") 
