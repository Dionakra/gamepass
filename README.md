# GamePass
Simple web app that scrapes data from the [GamePass Library](https://www.xbox.com/en-US/xbox-game-pass/games), retrieves each game's duration from [HowLongToBeat](https://howlongtobeat.com/) _Main Story_ duration and auto updates itself using GitHub Actions (or try to do so).


## Prerequisites
* NodeJS LTS

## Installation
```sh
$ git clone https://github.com/Dionakra/gamepass.git
$ cd gamepass
$ npm install
```

## Information retrieval
As we need information from several sources, and it should be retrieved automatially, the `npm run update` command tries to do that by querying the Game Pass library, deleting games that are no longer present in the service and obtaining the duration for the new ones.

This command will fail (so GitHub Actions notifies me) when trying to get the duration of a new game it cannot find one. It usually happens when the name provided by the game library is not the exact same name of the game, as they usually add _Standard Edition_, _WINDOWS 10 Edition_ or so to game titles just to differentiate the different versions between consoles and PC, but those names don't return anything from HowLongToBeat.

## Development
```sh
$ npm run dev
```

## Deployment
If you don't have them, please install firebase tools by typing `npm i -g firebase-tools`.
```
$ npm run build
$ firebase deploy
```
