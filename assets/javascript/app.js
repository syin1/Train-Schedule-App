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
    var trainname = $('#trainname')
      .val()
      .trim();

    var destination = $('#destination')
      .val()
      .trim();

    var firsttraintime = $('#firsttraintime')
      .val()
      .trim();

    var frequency = $('#frequency')
      .val()
      .trim();

    if (
      trainname === '' ||
      destination === '' ||
      firsttraintime === '' ||
      frequency === ''
    ) {
      alert('No field can be empty!');
      return false;
    } else if (!moment(firsttraintime, 'HH:mm', true).isValid()) {
      alert('First train time must be in military format!');
      return false;
    } else if (isNaN(parseInt(frequency))) {
      alert('Frequency must be a number!');
      return false;
    } else {
      database.ref().push({
        trainname: trainname,
        destination: destination,
        firsttraintime: firsttraintime,
        frequency: frequency
      });
    }
  });

  function updateList(snapshot) {
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

    var minutesAway = moment(nextArrival, 'hh:mm a').diff(
      current.startOf('minute'),
      'minutes'
    );

    var row = $("<tr id='" + snapshot.key + "'>");

    row.append($('<td>').text(obj.trainname));
    row.append($('<td>').text(obj.destination));
    row.append($('<td>').text(frequency));
    row.append($('<td>').text(nextArrival));
    row.append($('<td>').text(minutesAway));
    row.append(
      $('<td>').html(
        "<button type='button' data-key='" +
          snapshot.key +
          "' class='btn btn-outline-danger remove'>Remove</button><span> </span><button type='button' data-key='" +
          snapshot.key +
          "' class='btn btn-outline-warning update'>Update</button>"
      )
    );

    $('#tabledisplay').append(row);
  }

  database.ref().on(
    'child_added',
    function(snapshot) {
      updateList(snapshot);
    },
    function(errorObject) {
      console.log('Error: ' + errorObject.code);
    }
  );

  database.ref().on(
    'child_removed',
    function(snapshot) {
      $('#' + snapshot.key).remove();
    },
    function(errorObject) {
      console.log('Error: ' + errorObject.code);
    }
  );

  $(document.body).on('click', '.remove', function() {
    database
      .ref()
      .child($(this).attr('data-key'))
      .remove();
  });
});
