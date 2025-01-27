<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A foundation for a NestJS API

## Project setup

```bash
$ npm install
```

Copy/Paste the .env.example file to .env and the .env.db.example file to .env.db

Change the information inside like as you want.

You can generate a new JWT secret key using the following command:

```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

We need to build and up the database using the following command:

```bash
$ docker compose up -d
```

## Compile and run the project

```bash
# Lauch the database
$ docker compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Define a constraint which has a dependency with an injectable object

You need to add the @Injectable() decorator in your constraint

```ts
@Injectable()
export class MyConstraint implements ValidatorConstraintInterface
```

You need to export your constraint in the module main file

```ts
@Module({
  imports: [],
  controllers: [],
  providers: [MyConstraint],
  exports: [MyConstraint],
})
export class MyModule {}
```

If you need to use it in a DTO, you need to provide it in your module main file where the DTO object is created

```ts
@Module({
  imports: [],
  controllers: [OtherController],
  providers: [OtherService, MyConstraint],
  exports: [OtherService],
})
export class OtherModule {}
```

We've added to the main configuration of the app this code (You can find it in [/src/config/main-config.ts](src\config\main-config.ts)):

```ts
useContainer(app.select(AppModule), { fallbackOnErrors: true });
```

This line allow to NestJS to share the dependency injection container to class-validator in order to use Injectable object to the custom constraint

With the fallbackOnErrors parameter, if the dependencies resolution failed, class-validator will use his default comportment

## Change the validation options for a specific DTO

If you need to change the validation options for a specific DTO you can use the decorators: `ValidationOptions`

```ts
@ValidationOptions({ whitelist: true })
export class MyDto {...}
```

This will override the default configuration that you can change in the file [/src/common/pipes/CustomValidationPipe.pipe.ts](src\common\pipes\CustomValidationPipe.pipe.ts) with the method: `getDefaultValidatorOptions`
