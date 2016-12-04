# Bullshit Generator : [poop.moro.es](http://poop.moro.es)

**alterebro/bullshit-generator** : Codebase for the Bullshit Generator website ( [poop.moro.es](http://poop.moro.es) )

Google Suggest making suggestions of its own suggestions based on the input suggested suggestions.


### Development

```sh
$ npm install # Dependencies ...

# Start a PHP local server on http://localhost:8000
$ npm start

# or Start the PHP server on your local IP (i.e. http://192.168.1.134:8000) with:
$ npm run dev

# Development files are located on /src folder and the
# html template is located on the root folder (_app.html)
# > http://192.168.1.134:8000/_app.html
```

### Build the `/dist` folder

```sh
# Default Gulp task
$ gulp

# This will create the /dist folder with:
# index.html, q.php and /images folder
```

### Deploy / Update Server

```sh
# Execs the script that rsyncs index file to the server
$ sh update.sh
```

---

&mdash; [@alterebro](https://twitter.com/alterebro)
