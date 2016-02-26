var ghpages = require('gh-pages');

var options = {
    logger: function(s) { console.log(s); },
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/cryptosense/keytester.git',
    src: '{*.html,static/*.js}',
    clone: 'tmp',
};

ghpages.publish('.', options, function() {
    console.log('Deploy succesful');
});
