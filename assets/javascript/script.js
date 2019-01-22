// Initialize Firebase
let config = {
    apiKey: "AIzaSyBgZRbvx5876P0dtSJeYjvDpemivVIaKeo",
    authDomain: "rps-online-f16e9.firebaseapp.com",
    databaseURL: "https://rps-online-f16e9.firebaseio.com",
    projectId: "rps-online-f16e9",
    storageBucket: "rps-online-f16e9.appspot.com",
    messagingSenderId: "721649027901"
};
firebase.initializeApp(config);

// Initialize Globals
let db = firebase.database();
let logsSwitch = true;

// Game Functions
function showLogs(str) {
    // console logs that can be switch ON or OFF
    if (logsSwitch) {
        console.log(str)
    }
    return;
}

function isPlayerNameNull(player, number) {
    // check if playerName is null
    // this is just to prevent firebase store undefined

    if (player === undefined || player === "" || player === null) {
        showLogs("player name is empty, default name will be: anonymous player" + number);
        return "anonymous player" + number;
    } else {
        showLogs("Player name is set to " + player);
        return player;
    }
}

function hideEnterGameForm(player) {
    // this functions hides the Enter Game Button and Textbox
    $("#" + player + "-name-btn").hide();
    $("#" + player + "-name-txt").hide();
}

function showEnterGameForm(player) {
    // this functions hides the Enter Game Button and Textbox
    $("#" + player + "-name-btn").show();
    $("#" + player + "-name-txt").show();
}

function resetPlayerNames() {
    // this will set the player1.name and player2.name 
    // in the firebase to empty string
    showLogs("resetPlayerNames initiated");
    db.ref("player1").update({ name: "" });
    db.ref("player2").update({ name: "" });
    showLogs("player.names are set to null!");
}

function isPlayerOnline(name, player) {
    // this handles the empty name in firebase
    // it returns waiting for a player instead of a null value
    if (name === "") {
        showLogs("No active player, Waiting for player now initiated");
        showEnterGameForm(player);
        return "Waiting for a Player";
    } else {
        // hide the enter game field when user is online
        hideEnterGameForm(player);
        return name;
    }
}

function enableActionBTNs() {

}

// Event Handlers
$(".enter-game-btn").on("click", function (e) {
    // this is called when enter btn is pressed
    // this will push the name to the firebase db
    e.preventDefault();

    if ($(this).attr("id") == "player1-name-btn") {
        showLogs("Player1 enter btn is clicked");

        // get the textbox value for player1
        let player1Name = $("#player1-name-txt").val();

        // add player1 name to the database
        db.ref("player1").update({ name: isPlayerNameNull(player1Name, 1) });

        // logs for degubbing
        showLogs("Player1 name: " + isPlayerNameNull(player1Name, 1));

    } else if ($(this).attr("id") == "player2-name-btn") {
        showLogs("Player2 enter btn is clicked");

        // get the textbox value for player1
        let player2Name = $("#player2-name-txt").val();

        // add player1 name to the database
        db.ref("player2").update({ name: isPlayerNameNull(player2Name, 2) });

        // logs for degubbing
        showLogs("Player2 name: " + isPlayerNameNull(player2Name, 2));

    }
});

db.ref().on("value", function (snap) {
    // show player names, cathirebase
    $("#player1").text(isPlayerOnline(snap.val().player1.name, "player1"));
    $("#player2").text(isPlayerOnline(snap.val().player2.name, "player2"));

}, function (err) {
    showLogs("there's an error on value event");
    showLogs(err);
});

db.ref(".info/connected").on("value", function (snap) {
    // detects if user is connected to database
    if (snap.val() === true) {
        showLogs("connected");
    } else {
        showLogs("not connected");
    }
}, function (err) {
    showLogs(err);
});