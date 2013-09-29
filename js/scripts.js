$(function(){

    $('.dial').knob({

    });

    var tweets = [{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    },{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    },{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    },{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    },{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    },{
        title: "song1",
        artist: "artist1",
        img: "img/null.png",
        message: "Woow check this out!"
    }];

    tweets.forEach(function(tweet) {
        $(".tweets").append(_.template($('#tweet').html(), tweet));
    });

    var oaklandKnob = $(".oakland").find(".dial");
    animateKnob(oaklandKnob, 50);
    
    var sfKnob = $(".san-francisco").find(".dial");
    animateKnob(sfKnob, 50);

});


function animateKnob (knob, value) {
    $({value: knob.val()}).animate({value: value}, {
        duration: 1000,
        easing:'swing',
        step: function() {
            knob.val(Math.ceil(this.value)).trigger('change');
        }
    });
}

function getScore(tweets, map) {
    var score = 0;
    _.each(tweets, function(tweet) {
        if (map(tweet)) score++;
    });
    return score;
}

var aggressive = function(tweet) {
    return ['Aggressive', 'Brooding', 'Urgent', 'Defiant'].indexOf(tweet.mood) != -1;
}


