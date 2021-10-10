pipeline {

    // Where to execute the pipeline script
    agent any
    parameters {
        choice(name: 'VERSION', choices: ['1.1.0', '1.2.0', '1.3.0'], description: '')
        booleanParam(name: 'executeTests', defaultValue: true, description: 'should jenkins execute tests')
    }
    environment {
        NEW_VERSION = '1.0.1'
    }
    // Different pipeline stages
    stages {

        stage("build") {
            // Script executes command on Jenkins agent
            steps {
                echo 'building application...'
                echo "version ${NEW_VERSION}"
            }
        }

        stage("test") {
            when {
                expression {
                    (env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'main')  && params.executeTests == true
                }
            }
            steps {
                echo 'testing application...'
                echo "version ${params.VERSION}"
                withCredentials([
                    usernamePassword(credentials: 'server-credentials', usernameVariable: 'USER', passwordVariable: 'PWD')
                ]) {
                    echo "${USER} ${PWD}"
                }
            }
        }
    }
}

// equivalent to lines 1-3
node {
    // groovy script
}