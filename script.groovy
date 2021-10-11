def buildApp() {
    echo 'building application...'
    echo "version ${params.VERSION}"
}

def testApp() {
    echo 'testing application...'
    echo "version ${params.VERSION}"
}

def deployApp() {
    echo 'deploying application...'
    echo "version ${params.VERSION}"
}

return this