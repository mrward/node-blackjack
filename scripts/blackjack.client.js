
var App = {}

App.deal = function () {
    App.socket.emit('deal');
}

App.hit = function () {
    App.socket.emit('hit');
}

App.stand = function () {
    App.socket.emit('stand');
}

App.getSuitHtml = function (suit) {
    var image = 'club.png';
    if (suit === 'H') {
        image = 'heart.png';
    } else if (suit === 'S') {
        image = 'spade.png';
    } else if (suit === 'D') {
        image = 'diamond.png';
    }
    return "<img class='card' src='img/" + image + "'/>";
}

App.getCardHtml = function (cards) {
    var html = '';
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        html += card.rank;
        html += App.getSuitHtml(card.suit);
    }
    return html;
}

App.updatePlayer = function (player) {
    var html = App.getCardHtml(player.cards);
    $('#player').html(html);
}

App.updateDealer = function (dealer) {
    var html = App.getCardHtml(dealer.cards);
    $('#dealer').html(html);
}

App.updateResult = function (result) {
    if (result != 'None') {
        $('#result').text(result);
    }
}

App.dealResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
}

App.hitResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
}

App.standResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
}

App.socket = {}

App.registerClientActions = function () {
    
    $('#deal').click(function () {
        App.deal();
    });

    $('#hit').click(function () {
        App.hit();
    });

    $('#stand').click(function () {
        App.stand();
    });
}

App.registerServerActions = function () {    
    App.socket.on('stand', function (game) {
        App.standResult(game);
    });
    App.socket.on('deal', function (game) {
        App.dealResult(game);
    });
    App.socket.on('hit', function (game) {
        App.hitResult(game);
    });
}

App.init = function () {
    var socket = io.connect('http://localhost:3000');
    App.socket = socket;
    App.registerClientActions();
    App.registerServerActions();
}

$(document).ready(function () {
    App.init();
});