$(function(){

    $('.dial').knob();

    processTweets('data/sfo.json', $('.san-francisco'));
    processTweets('data/oak.json', $('.oakland'));

    $('.play').click(function() {
        console.log('playing...');
        R.ready(function() {
            R.player.play({source: this.attr('data-key')});
            this.addClass('hidden');
            this.parent().find('.stop').removeClass('hidden');
            this.parent().find('.loading').addClass('hidden');
        });
    });

    $('.stop').click(function() {
        console.log('stopping...');
        R.ready(function() {
            R.player.paus();
            this.addClass('hidden');
            this.parent().find('.play').removeClass('hidden');
            this.parent().find('.loading').addClass('hidden');
        });
    });

    $('.filter').change(function() {
        var f = filters[this.val()];
        processTweets('data/sfo.json', $('.san-francisco'), f);
        processTweets('data/oak.json', $('.oakland'), f);
    });

});

function processTweets(endpoint, container, filter) {

    container.find('.tweets').html('');
    $.getJSON(endpoint, function(data) {
        filter || (filter = filters.aggressive);
        var score = 0;
        var t = container.find('.tweets');
        data.forEach(function(tweet) {
            if (! filter(tweet)) return;
            if (! tweet.artist_image)
                tweet.artist_image = tweet.album_art || 'img/null.png';
            if (! tweet.message)
                tweet.message = '';
            var $tweet = $(_.template($('#tweet').html(), tweet));
            t.append($tweet);
            var success = function(tracks) {
                var track = tracks.result.results[0];
                var play = $tweet.find('.play');
                play.attr('data-key', track.key);
                play.removeClass('hidden');
                $tweet.find('.stop').addClass('hidden');
                $tweet.find('.loading').addClass('hidden');
            };
            R.ready(function() {
                if (tweet.isrc) {
                    R.request({
                        method: 'getTracksByISRC',
                        content: {
                            isrc: tweet.isrc,
                            start: 0,
                            count: 1
                        },
                        success: success
                    });
                } else {
                    R.request({
                        method: 'search',
                        content: {
                            query: tweet.artist_name + ' - ' + tweet.track_title,
                            types: 'Track',
                            never_or: false,
                            start: 0,
                            count: 1
                        },
                        success: success
                    });
                }
            });
            score++;
        });
        setTimeout(function(){
            animateKnob(container.find('.dial'), score);
        },1);

    });
}

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
        return tweet.mood == 'Aggressive';
    },
    cool: function(tweet) {
        return tweet.mood == 'Cool';
    },
    rap: function(tweet) {
        return tweet.genre.indexOf('Rap') > -1;
    }

};
