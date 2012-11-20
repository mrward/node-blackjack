var http = require('http'),
    fs = require('fs'),
    url = require('url');

var Server = {}

Server.getRandomInt = function (max) {
  return Math.floor(Math.random() * (max + 1));
}

Server.getShuffledDeck = function () {
    var cards = [];
    cards[0] = 0;
    for (var i = 1; i < 52; i++) {
        var j = getRandomInt(i);
        cards[i] = cards[j];
        cards[j] = i;        
    }
    return cards;
}

Server.numberToSuit = function (number) {
  var suits = ['C', 'D', 'H', 'S'];
  var index = Math.floor(number / 13);
  return suits[index];
}

Server.numberToCard = function (number) {
  return {
    rank: (number % 13) + 1,
    suit: numberToSuit(number)
  };
}

Server.dealCardsForNewGame = function () {

    var dealerCards = [];
    var playerCards = [];

    return {
        dealer: {
            cards: [{ rank: 9, suit: 'S'}]
        },
        player: {
            cards: [
                { rank: 10, suit: 'H' },
                { rank: 10, suit: 'C' }
            ],
            balance: 102.50
        },
        result: 'None'
    };
}

Server.dealNextCardForPlayer = function () {
    return {
        dealer: {
            cards: [{ rank: 9, suit: 'S'}]
        },
        player: {
            cards: [
                {rank: 10, suit: 'H'},
                {rank: 10, suit: 'C'},
                {rank: 4, suit: 'D'}
            ],
            balance: 102.50
        },
        result: "None"
    };
}

Server.dealerPlays = function () {
    return {
        dealer: {
            cards: [
                { rank: 9, suit: 'S'},
                { rank: 10, suit: 'S'}
            ]
        },
        player: {
            cards: [
                {rank: 10, suit: 'H'},
                {rank: 10, suit: 'C'}
            ],
            balance: 102.50
        },
        result: "Win"
    };
}

Server.deal = function (socket, data) {
    console.log('deal');
    var game = Server.dealCardsForNewGame();
    socket.set('game', game);
    socket.emit('deal', game);
}

Server.hit = function (socket) {
    console.log('hit');
    socket.emit('hit', Server.dealNextCardForPlayer());
}

Server.stand = function (socket) {
    console.log('stand');
    socket.emit('stand', Server.dealerPlays());
}

Server.registerSocketIO = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log('User connected');
        Server.socket = socket;

        socket.on('deal', function (data) {
            Server.deal(socket, socket);
        });

        socket.on('hit', function (data) {
            Server.hit(socket);
        });

        socket.on('stand', function (data) {
            Server.stand(socket);
        });

        socket.on('disconnect', function (socket) {
            console.log('User disconnected');
        });
    });
}

Server.init = function () {
    var httpServer = http.createServer(function (req, res) {
        var path = url.parse(req.url).pathname;
        console.log(path);
        var contentType = 'text/html';
        if (path === '/') {
            path = '/index.html';
        } else if (path.indexOf('.css')) {
            contentType = 'text/css';
        } else if (path.indexOf('.svg')) {
            contentType = 'image/svg+xml';
        }
        fs.readFile(__dirname + path, function (error, data) {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        });
    }).listen(3000);

    var io = require('socket.io').listen(httpServer);
    Server.registerSocketIO(io);
}

Server.init();


