# 👾 Brawl Stars Pain League API

This project aims to generate player stats for the mobile game [Brawl Stars](https://play.google.com/store/apps/details?id=com.supercell.brawlstars&hl=fr&pli=1).
This backend retrieves player game data via the official [API](https://developer.brawlstars.com/#/)

## 🛠 Stack

[<img height="40" src="https://raw.githubusercontent.com/github/explore/37c71fdca4e12086faf8c7009793d2eb588c914e/topics/nestjs/nestjs.png" alt="nestjs">](https://docs.nestjs.com/)[<img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" alt="nodejs">](https://nodejs.org/docs/latest/api/)[<img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" alt="typescript">](https://www.typescriptlang.org/fr/docs/)[<img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png" alt="docker" />](https://docs.docker.com/)[<img height="40" src="https://avatars.githubusercontent.com/u/20165699?s=200&v=4" alt="typeorm" />](https://typeorm.io/)[<img height="40" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mysql/mysql.png" alt="mysql" />](https://dev.mysql.com/doc/)

## 👨‍💻 Installation

```bash
git clone https://github.com/DeadInEgg/bs-pain-league-api.git
cd bs-pain-league-api
npm install
```

## 🚀 Getting start

```bash
npm run start:dev
docker-compose up -d --build
```

## 🧪 Run e2e tests

```bash
npm run test:e2e
```

## 🏗️ Migrations

Generate a migration

```bash
npm run migration:generate name-migration
```

Run the migration

```bash
npm run migration:run
```

Revert the last migration

```bash
npm run migration:revert
```
