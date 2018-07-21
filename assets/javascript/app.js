$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyDbPtwKvzA17cZVIHhN0GDTTYD5aqA-d7Y',
    authDomain: 'train-schedule-app-997c9.firebaseapp.com',
    databaseURL: 'https://train-schedule-app-997c9.firebaseio.com',
    projectId: 'train-schedule-app-997c9',
    storageBucket: 'train-schedule-app-997c9.appspot.com',
    messagingSenderId: '397219715685'
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $('#submit').on('click', function() {
    database.ref().push({
      trainname: $('#trainname')
        .val()
        .trim(),
      destination: $('#destination')
        .val()
        .trim(),
      firsttraintime: $('#firsttraintime')
        .val()
        .trim(),
      frequency: $('#frequency')
        .val()
        .trim()
    });
  });

  database.ref().on(
    'child_added',
    function(snapshot) {
      var value = snapshot.val();
      var row = $('<tr>');

      row.append($('<td>)').text(value.trainname));
      row.append($('<td>)').text(value.destination));
      row.append($('<td>)').text(value.frequency));
      row.append($('<td>)').text(value.firsttraintime));
      row.append($('<td>)').text(10));

      $('#tabledisplay').append(row);
    },
    function(errorObject) {
      console.log('Error: ' + errorObject.code);
    }
  );
});
