var config = { };

config.secret = 'secreto';

// should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:3000/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '1244247258997804',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '88b3aa7a477dd4f64942aaab525b0cbb',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'merchar',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + '/login/facebook/return'
};

module.exports = config;