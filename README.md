## What is Remote my project
Remote My Project is a straightforward tool that allows you to connect your Python projects to a server. With this tool, you can use an API to execute functions in your project in real-time via WebSockets. Additionally, it includes a management panel for overseeing your projects. 

## One-click Installation

```bash 
bash <(curl -Ls https://raw.githubusercontent.com/mrafieefard/remote-my-project/master/install.sh)
```

## Manual Installation

1. first clone repository

```bash
https://github.com/mrafieefard/remote-my-project
```

2. build the project with docker

```bash
docker build -t rmp remote-my-project/
```

3. run docker

```bash
docker run -d -p 3000:3000 rmp
```

## Todo
- [ ] Optimization
- [ ] Allow create widget for overview page
- [ ] Add an authentication page to manage users and permissions
- [ ] Add python sdk to pypi page
- [x] Migrate sqlite to postgresql


## Contributors

Right now there is no contributors in this project. you can be first :)

If you want to contribute email me at mrafieefard@gmail.com

