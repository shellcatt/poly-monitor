## Building blocks
---
> *[Polymer] is built on top of a set of powerful new web platform primitives called __Web Components__.
> Web Components bring unprecedented composability, interoperability, and consumability to the web platform.
> Polymer is a pioneering javascript library that's currently in __“developer preview”__.
> However, despite the label many people have already had success using Polymer in production.*

---
> *[Node.JS] is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.*

---

## This project

---
> Poly-Monitor is a __proof-of-concept__ Polymer project aiming to demonstrate the basic usage and encapsulation techniques of the library.
> It requires a back-end NodeJS server in order to access [xrandr] from the current user's CLI (i.e. _a NodeJS app you'll have to run yourself_).

---
# Installation / [Xorg] only /


---
### Apache configuration

> The *NodeJS* server provides a REST-ful interface, but in order to access it from your webserver you'll need to bypass the [Same-origin policy]. Specifically for Apache, you need to put the following statements inside the `VirtualHost` directive:

```apache
RewriteEngine On
ProxyPass /nodejs/ http://localhost:9080/
ProxyPassReverse /nodejs/ http://localhost:9080/
```
> * __Note__ that the `monitor-list` component accepts the exact *Pass* URI that you define in the apache configuration. It is recommended that you use the *vhost* configuration instead of *.htaccess*.

---
### Web Components' dependencies

> The installation script should take care of any external dependencies, for some of which it uses `sudo`, so you might be prompted for your password in order to complete the task.

```sh
sh install.sh
```

---
## Run the server
> You'll have to manually run the server from command line in the project directory:

```sh
node server.js 9080
```
> * __Note__ that the *port* is passed as a command line parameter for configurability. You can hardcode it directly in `package.json` as I've done already in order to only use `npm start`.

After you've ran the server, you should be able to open
> [http://localhost:9080/](http://localhost:9080/)

> ![alt tag](https://raw.githubusercontent.com/shellcatt/poly-monitor/master/screenshot.jpg)

Back in teh command line you'll be able to see some of the output from [xrandr] as plain-text JSON.

To verify the connectivity between Apache and the NodeJS server, you should be able to see the same JSON result under
> `http://<your-local-vhost>/nodejs/`.

---
Open the app
---
> You can place the project folder anywhere under your document root's tree as long as you have the `ProxyPass` set on the current *vhost*.

> For example, mine is at `http://test.localhost/poly-monitor/`.

---
Known Issues
---
- Chrome 50+ introduced some changes in their ShadowDOM implementation which won't work with the current version of *paper-elements*, rendering blank screen. An upgrade has been planned for the next season.
---

[Polymer]:http://www.polymer-project.org/
[node.js]:http://nodejs.org
[Xorg]:http://www.x.org/wiki/Projects/XRandR/
[xrandr]:https://wiki.archlinux.org/index.php/xrandr
[Same-origin policy]:http://en.wikipedia.org/wiki/Same-origin_policy
[localnodejs]:http://localhost:9080/