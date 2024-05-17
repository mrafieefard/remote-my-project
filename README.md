## What is Remote my project
Remote My Project is a straightforward tool that allows you to connect your Python projects to a server. With this tool, you can use an API to execute functions in your project in real-time via WebSockets. Additionally, it includes a management panel for overseeing your projects. 

## Installation

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

## Contribution

Contributors are welcome <3