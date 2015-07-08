function check_ssh_key() {
    var key = $('#form-ssh-key').val();
    var is_key = key.match(/ssh-rsa/);
    if (is_key) {
        $('#key-group').removeClass('has-error');
        $('#key-text-error').hide();
    } else {
        $('#key-group').addClass('has-error');
        $('#key-text-error').show();
    }
}
function trialDivision(key) {
    var parsedKey = parse(key);
    var n = parsedKey.n;
    var result = isDivisibleByASmallPrime(n, 1000000);
    return result;
}
function updateTrialResult(result) {
    var text;
    var cls;
    var icon;
    if (result === false) {
        text = "This key does not have small factors (< 1000000).";
        cls = "bg-success";
        icon = "glyphicon glyphicon-ok";
    } else {
        text = "This key is divisible by " + result + ".";
        cls = "bg-danger";
        icon = "glyphicon glyphicon-remove";
    }
    $('#trial-result-text').text(text);
    $('#trial-result-row').removeClass();
    $('#trial-result-row').addClass(cls);
    $('#trial-result-icon').removeClass();
    $('#trial-result-icon').addClass(icon);
}
function updateBatchResult() {
    var text = "Your key has been submitted to out next batch-GCD run and will inform you in case your key is sharing a factor with another one.";
    $('#batch-result-text').text(text);
    $('#batch-result-row').removeClass();
    $('#batch-result-row').addClass("bg-warning");
    $('#batch-result-icon').removeClass();
    $('#batch-result-icon').addClass("glyphicon glyphicon-hourglass");

}
$(document).ready(function() {
    $('#form-ssh-key').change(function() {
        check_ssh_key();
    });
    $('#ssh-form').submit(function(e) {
        e.preventDefault();
        var key = $('#form-ssh-key').val();
        var result = trialDivision(key);
        updateTrialResult(result);

        $.ajax({
            method: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: updateBatchResult,
            error: function(e) { console.log(e) },
            headers: {
                'Accept': "application/javascript",
                'Content-Type': "application/javascript"
            }
        });
    });
});
