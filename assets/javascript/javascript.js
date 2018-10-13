

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAH30VXubfjaUU17ei15wGniUdYLLoDYh8",
    authDomain: "train-data-298f7.firebaseapp.com",
    databaseURL: "https://train-data-298f7.firebaseio.com",
    projectId: "train-data-298f7",
    storageBucket: "train-data-298f7.appspot.com",
    messagingSenderId: "748524509459"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //---------------------------------------------------------

  $("#submit").on("click", function(event) {
    event.preventDefault();

    // Text input variables
    var trainName  = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    database.ref().push({
        dataTrainName: trainName,
        dataDestination: destination,
        dataTime: time,
        dataFrequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  // Clear the form after submitting
  $("#submit").on("click", function(event) {
    $('#myForm')[0].reset();
  });

  database.ref().on("child_added", function(childSnapShot) {  

    var trainName  = childSnapShot.val().dataTrainName;
    var destination = childSnapShot.val().dataDestination;
    var time = childSnapShot.val().dataTime;
    var frequency = childSnapShot.val().dataFrequency;

    // Converting time with Moment.js
    // Subtracting 1 year from the time variable to not overlap the current time variable
    var timeConverted = moment(time, "hh:mm").subtract(1, "years");
    // Current time
    var currentTime = moment();
    console.log("The current time is: " + moment(currentTime).format("hh:mm"));
    // Difference between the current time and the time variable
    var difference = moment().diff(moment(timeConverted), "minutes");
    // Remainder of the difference and frequency
    var remainder = difference % frequency;
    // Minutes until the train
    var minutesAway = frequency - remainder;
    // Calculated arrival time
    var arrivalTime = moment().add(minutesAway, "minutes");

    // Adding a new table row
    var newTr = $("<tr>");

    // Creating TD displays for the html
    var nameDisplay = $("<td>").text(childSnapShot.val().dataTrainName);
    var destinationDisplay = $("<td>").text(childSnapShot.val().dataDestination);
    var frequencyDisplay = $("<td>").text(childSnapShot.val().dataFrequency);
    var arrivalDisplay = $("<td>").text(moment(arrivalTime).format("hh:mm"));
    var minutesDisplay = $("<td>").text(minutesAway);

    if(minutesAway == NaN) {
      var minutesDisplay = $("<td>").text("Unavailable");
    }

    // Appending the user input to the html
    newTr.append(nameDisplay, destinationDisplay, frequencyDisplay, arrivalDisplay, minutesDisplay);
    $("#information").append(newTr);

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


   // Clears out the database when clicking clear
  $("#clear").on("click", function() {
    database.ref().remove();
  });

  