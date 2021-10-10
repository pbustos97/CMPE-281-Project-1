def gv

pipeline {

    // Where to execute the pipeline script
    agent any
    tools {
        node = 'Node-16.11'
    }
    parameters {
        choice(name: 'VERSION', choices: ['1.1.0', '1.2.0', '1.3.0'], description: '')
        booleanParam(name: 'executeTests', defaultValue: true, description: 'should jenkins execute tests')
    }
    environment {
        NEW_VERSION = '1.0.1'
    }
    // Different pipeline stages
    stages {
        stage("init") {
            steps {
                script {
                    gv = load "script.groovy"
                }
            }
        }
        stage("build frontend") {
            // Script executes command on Jenkins agent
            steps {
                script {
                    gv.buildApp()
                }
                dir('frontend') {
                    nodejs('Node-16.11') {
                        sh 'npm i'
                        sh 'npm build'
                    }
                }
            }
        }
        stage("build backend") {
            steps {
                script {
                    gv.buildApp()
                }
            }
        }

        stage("test") {
            when {
                expression {
                    (env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'main')  && params.executeTests == true
                }
            }
            steps {
                gv.testApp()
            }
        }
    }
}

// equivalent to lines 1-3
node {
    // groovy script
}