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
      var obj = snapshot.val();

      var firsttraintime = moment(obj.firsttraintime, 'HH:mm');
      var current = moment();
      var diff = current.diff(firsttraintime, 'minutes');
      var nextArrival;

      var frequency = parseInt(obj.frequency);

      if (diff <= 0) {
        nextArrival = firsttraintime.format('hh:mm a');
      } else if (diff % frequency === 0) {
        nextArrival = current.format('hh:mm a');
      } else {
        nextArrival = firsttraintime
          .add(Math.ceil(diff / frequency) * frequency, 'minutes')
          .format('hh:mm a');
      }

      console.log('Arrival:', nextArrival);
      console.log('Current:', current);
      var minutesAway = moment(nextArrival, 'hh:mm a').diff(
        current.startOf('minute'),
        'minutes'
      );

      var row = $('<tr>');

      row.append($('<td>').text(obj.trainname));
      row.append($('<td>').text(obj.destination));
      row.append($('<td>').text(frequency));
      row.append($('<td>').text(nextArrival));
      row.append($('<td>').text(minutesAway));

      $('#tabledisplay').append(row);
    },
    function(errorObject) {
      console.log('Error: ' + errorObject.code);
    }
  );
});
