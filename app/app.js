let app = angular.module('app', [])

app.controller('AppController', function($scope, $http) {
    $scope.search = ""
    $scope.email = {}
    $scope.emails = []
    $scope.emailSaved = false
    $scope.errors = []

    $http.get('https://emails-api-v1.herokuapp.com/api/v1/emails')
        .then((response) => {
            $scope.emails = response.data
        })
        .catch((_) => {})

    $scope.removeEmail = function(email) {
        $http.delete(`https://emails-api-v1.herokuapp.com/api/v1/emails/${email._id}`)
            .then((_) => {
                const index = $scope.emails.indexOf(email)
                $scope.emails.splice(index, 1)
            })
            .catch((_) => {})
    }

    $scope.createEmail = function(email) {
        $http.post('https://emails-api-v1.herokuapp.com/api/v1/emails', email)
            .then((response) => {
                $scope.emails.push(response.data)
                $scope.emailSaved = true
            })
            .catch((err) => {
                $scope.errors = err.data
            })
    }

    $scope.updateEmail = function(email) {
        $http.put(`https://emails-api-v1.herokuapp.com/api/v1/emails/${email._id}`, email)
            .then((response) => {
                const found = $scope.emails.find(item => item._id === email._id)
                const index = $scope.emails.indexOf(found)
                $scope.emails[index] = Object.assign(found, response.data)
                $scope.emailSaved = true
            })
            .catch((err) => {
                $scope.errors = err.data
            })
    }

    $scope.openForm = function() {
        $('#emailForm').modal('show')
        $scope.email = {}
        $scope.emailSaved = false
        $scope.errors = []
    }

    $scope.closeForm = function() {
        $('#emailForm').modal('hide')
        $scope.email = {}
        $scope.emailSaved = false
        $scope.errors = []
    }

    $scope.editEmail = function(email) {
        $scope.openForm()
        $scope.email = Object.assign({}, email)
    }

    $scope.submitForm = function() {
        $scope.emailSaved = false
        $scope.errors = []
        $scope.email._id ? $scope.updateEmail($scope.email) : $scope.createEmail($scope.email)
    }
})
