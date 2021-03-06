var express = require('express');
var app = express();
var requestClient = require('request');
var port = process.env.PORT || 3000;

var gitLabDomain = process.env.GITLAB_DOMAIN;

var cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Webhook is running at /webhook');
});

app.get('/webhook', (request, response) => {
  if (!gitLabDomain) {
    response.status(500).send('Gitlab domain not configured');
    return;
  }
  var cookie = request.cookies['_gitlab_session'];
  if (!cookie) {
    response.json({'x-hasura-role': 'anonymous'});
    return;
  }
  var options = {
    method: 'GET',
    url: `${gitLabDomain}/api/v4/user`,
    headers: {
      'Cookie': '_gitlab_session=' + cookie
    }
  };
  requestClient(options, (err, resp, respBody) => {
    if (!err && resp.statusCode == 200) {
      const respObj = JSON.parse(respBody);
      const hasuraVariables = {
        'x-hasura-user-id': respObj.id.toString(),
        'x-hasura-role': 'user'
      };
      console.log('Hasura Variables');
      console.log(hasuraVariables);
      response.json(hasuraVariables);
    } else {
      console.log(err);
      response.json({'x-hasura-role': 'anonymous'});
    }
  })
});

var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
