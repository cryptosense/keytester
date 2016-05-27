var rsa = require('./rsa.js');
var $ = require('jquery');

function check_ssh_key() {
    var key = $('#form-ssh-key').val();
    var parsed_key = rsa.parse(key);
    if (parsed_key.error === null) {
        $('#key-group').removeClass('has-error');
        $('#key-text-error').hide();
    } else {
        $('#key-group').addClass('has-error');
        $('#key-text-error').text(parsed_key.error);
        $('#key-text-error').show();
    }
}
function trialDivision(key) {
    var parsedKey = rsa.parse(key);
    var n = parsedKey.n;
    var result = rsa.isDivisibleByASmallPrime(n, 1000000);
    return result;
}

function asyncTrialDivision(key, callback) {
    setTimeout(function() {
        var r = trialDivision(key);
        callback(r);
    }, 50);
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

function afterSubmit($form, ga) {
    updateBatchResult();
    $form.find('[name=key]').val('');
    $form.after($('<h1>').addClass('text-center').text('Thanks!'));
    $form.slideUp();
    if (ga !== undefined) {
        ga('send', 'event', 'form', 'submit');
        if ($form.find('[name=newsletter]').is(':checked')) {
            ga('send', 'event', 'newsletter', 'subscribe');
        }
    }
}

function updateBatchResult() {
    var text = "Your key has been submitted to our next batch-GCD run and we will inform you in case your key is sharing a factor with another one.";
    $('#batch-result-text').text(text);
    $('#batch-result-row').removeClass();
    $('#batch-result-row').addClass("bg-warning");
    $('#batch-result-icon').removeClass();
    $('#batch-result-icon').addClass("glyphicon glyphicon-hourglass");

}

function send(form_url, $form, success) {
    if (form_url === undefined) {
        console.log($form.serialize());
        success();
    } else {
        $.ajax({
            method: "POST",
            url: form_url,
            data: $form.serialize(),
            success: function() { success(); },
            error: function(e) { console.log(e); },
            headers: {
                'Accept': "application/javascript",
            }
        });
    }
}

function init_analytics(ga_code) {
    if (ga_code === undefined) {
        return undefined;
    }
    var ga = require('ga-browser');
    ga('create', ga_code, 'auto');
    ga('send', 'pageview');
    return ga;
}

function run(form_url, ga_code) {
    $(document).ready(function() {
        var ga = init_analytics();
        $('#form-ssh-key').change(function() {
            check_ssh_key();
        });
        $('#ssh-form').submit(function(e) {
            e.preventDefault();
            var key = $('#form-ssh-key').val();
            var $form = $(this);

            $form.find('[type=submit]').prop('disabled', true);
            asyncTrialDivision(key, function(result) {
                updateTrialResult(result);
                send(form_url, $form, function() {
                    afterSubmit($form, ga);
                });
            });
        });
        $('#form-github-go').click(function() {
            var user = $('#form-github-username').val();
            var url = "https://api.github.com/users/" + user + "/keys";
            $.getJSON(url, function(data) {
                var key = data[0].key;
                $("#form-ssh-key").val(key);
            });
        });
        $('#fetch-form-link').click(function(e) {
            e.preventDefault();
            $('#github-fetch-form').show();
        });
        var hash = window.location.hash;
        if (hash.startsWith('#key=')){
            var key = decodeURIComponent(hash.substr(5));
            $("#form-ssh-key").val(key);
        }
    });
}

module.exports = {
    run: run
};
