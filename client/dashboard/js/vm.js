"use strict";

function vm() {

    var that = this;

    this.players = ko.observableArray();
    this.numPlayers = ko.computed(function() {
	return that.players().length;
    });
};

function player(id, score, nickname) {
    this.id = ko.observable(id);
    this.score = ko.observable(score);
    this.nickname = ko.observable(nickname);
};
