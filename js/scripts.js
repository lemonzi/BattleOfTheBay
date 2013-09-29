var sfoScore = 0;
var oakScore = 0;

$(function(){

    $('.dial').knob();

    $.getJSON('data/sfo.json', function(data) {

        sfoScore = 0;
        var t = $('.san-francisco .tweets');
        data.forEach(function(tweet) {
            if (! filters.aggressive(tweet)) return;
            if (! tweet.artist_image)
                tweet.artist_image = tweet.album_art || 'img/null.png';
            if (! tweet.message)
                tweet.message = 'Check this out!';
            t.append(_.template($('#tweet').html(), tweet));
            sfoScore++;
        });

        setTimeout(function(){
            animateKnob($('.san-francisco .dial'), sfoScore);
        },1);

    });

    $.getJSON('data/oak.json', function(data) {

        oakScore = 0;
        var t = $(".oakland .tweets");
        data.forEach(function(tweet) {
            if (! filters.aggressive(tweet)) return;
            if (! tweet.artist_image)
                tweet.artist_image = tweet.album_art || 'img/null.png';
            if (! tweet.message)
                tweet.message = 'Check this out!';
            t.append(_.template($('#tweet').html(), tweet));
            oakScore++;
        });

        setTimeout(function() {
            animateKnob($('.oakland .dial'), oakScore);
        },1);

    });

});


function animateKnob (knob, value) {
    $({value: knob.val()}).animate({value: value}, {
        duration: 2000,
        easing:'easeOutCubic',
        step: function() {
            knob.val(Math.ceil(this.value)).trigger('change');
        }
    });
}

var filters = {
    aggressive : function(tweet) {
        //return ['Aggressive', 'Brooding', 'Urgent', 'Defiant'].indexOf(tweet.mood) > -1;
        return tweet.mood == 'Cool';
    }
};
