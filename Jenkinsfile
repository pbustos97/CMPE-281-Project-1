pipeline {

    // Where to execute the pipeline script
    agent any

    // Different pipeline stages
    stages {

        stage("build") {

            // Script executes command on Jenkins agent
            steps {
                echo 'building application...'
            }
        }

        stage("test") {

            steps {
                echo 'testing application...'
            }
        }
    }
}

node {
    // groovy script
}