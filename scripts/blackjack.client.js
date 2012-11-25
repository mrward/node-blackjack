
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

App.getRankHtml = function (rank) {
    if (rank === 1) {
        return 'A';
    } else if (rank === 11) {
        return 'J';
    } else if (rank === 12) {
        return 'Q';
    } else if (rank === 13) {
        return 'K';
    }
    return rank;
}

App.getCardsHtml = function (cards) {
    var html = '';
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        html += App.getRankHtml(card.rank);
        html += App.getSuitHtml(card.suit);
    }
    return html;
}

App.updatePlayer = function (player) {
    var html = App.getCardsHtml(player.cards);
    $('#playerCards').html(html);
    $('#playerScore').text(player.score);
}

App.updateDealer = function (dealer) {
    var html = App.getCardsHtml(dealer.cards);
    $('#dealerCards').html(html);
    $('#dealerScore').text(dealer.score);
}

App.updateResult = function (result) {
    var displayResult = result;
    if (result === 'None') {
        displayResult = '';
    }
    $('#result').text(displayResult);
}

App.disableButton = function (id) {
    $(id).attr('disabled', 'disabled');
}

App.enableButton = function (id) {
    $(id).removeAttr('disabled');
}

App.disableDeal = function () {
    App.disableButton('#deal');
    App.enableButton('#hit');
    App.enableButton('#stand');
}

App.enableDeal = function () {
    App.enableButton('#deal');
    App.disableButton('#hit');
    App.disableButton('#stand');
}

App.enableDealIfGameFinished = function (result) {
    if (result !== 'None') {
        App.enableDeal();
    }
}

App.dealResult = function (game) {
    App.disableDeal();
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
}

App.hitResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
    App.enableDealIfGameFinished(game.result);
}

App.standResult = function (game) {
    App.updateDealer(game.dealer);
    App.updatePlayer(game.player);
    App.updateResult(game.result);
    App.enableDealIfGameFinished(game.result);
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
    App.enableDeal();
}

$(document).ready(function () {
    App.init();
});