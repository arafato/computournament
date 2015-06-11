"use strict";

function vm() {

    var that = this;

    this.players = ko.observableArray();
    this.numPlayers = ko.computed(function() {
	return that.players().length;
    });
};

function player(id, score) {
	this.id = ko.observable(id);
	this.score = ko.observable(score);
};
