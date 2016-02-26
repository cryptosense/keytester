var ghpages = require('gh-pages');

var options = {
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/cryptosense/keytester.git',
    src: '{index.html,static/bundle.js}',
};

ghpages.publish(__dirname, options, function() {
    console.log('Deploy succesful');
});
