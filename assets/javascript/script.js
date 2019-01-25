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
let player1Name = "";
let player2Name = "";
let logsSwitch = true;

// Game Functions
function showLogs(str) {
    // console logs that can be switch ON or OFF
    if (logsSwitch) {
        console.log(str)
    }
    return;
}

function readCookie(name) {
    // read the stored cookie
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
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
        showLogs("Cookie Name: " + readCookie("name"));

        if (readCookie("name") !== "none") {
            showEnterGameForm(player);
        }
        return "Waiting for a Player";
    } else {
        // hide the enter game field when user is online
        hideEnterGameForm(player);
        return name;
    }
}

// Event Handlers
$(".enter-game-btn").on("click", function (e) {
    // this is called when enter btn is pressed
    // this will push the name to the firebase db
    e.preventDefault();

    if ($(this).attr("id") === "player1-name-btn") {
        showLogs("Player1 enter btn is clicked");

        // get the textbox value for player1
        let getPlayer1Name = $("#player1-name-txt").val();
        player1Name = isPlayerNameNull(getPlayer1Name, 1);

        // add player1 name to the database
        db.ref("player1").update({ name: player1Name });

        //save this player in the cookie
        // change this to local storage instead
        // easier to test
        document.cookie = "name=" + player1Name;

        // logs for degubbing
        showLogs("Player1 name: " + player1Name);

    } else if ($(this).attr("id") === "player2-name-btn") {
        showLogs("Player2 enter btn is clicked");

        // get the textbox value for player2
        let getPlayer2Name = $("#player2-name-txt").val();
        player2Name = isPlayerNameNull(getPlayer2Name, 2);

        // add player2 name to the database
        db.ref("player2").update({ name: player2Name });

        //save this player in the cookie
        document.cookie = "name=" + player2Name;

        // logs for degubbing
        showLogs("Player2 name: " + player2Name);

    }
});

db.ref().on("value", function (snap) {
    // show player names, cathirebase
    $("#player1").text(isPlayerOnline(snap.val().player1.name, "player1"));
    $("#player2").text(isPlayerOnline(snap.val().player2.name, "player2"));

    // delete cookies if player name is empty
    if (snap.val().player1.name === "" || snap.val().player2.name === "") {
        document.cookie = "name=none";
    }

    if (readCookie("name") === "none") {
        showLogs("cookie is now none");
    } else {
        showLogs("not none yet");
    }

    // re-check cookie changes



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