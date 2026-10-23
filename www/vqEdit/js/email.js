function sendMail() {
    var message = $("#feedbackInput").val();
    message = "Sent by: " + userData.firstname + " " + userData.lastname + " // " + userData.netID + " // " + userData.email + "\n\n" + message;
    var subject = "IVQ Feedback";
    $.ajax({
        url: "mail.php",
        data: {
            "message": message,
            "subject": subject
        }
    }).done(function (data) {
        
    }).fail(function () {
        console.log("Uh oh! Something went wrong!");
    });
}