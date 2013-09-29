$(function() {

    $('.dial').knob();

    $('.filter').change(function() {
        var f = filters[$(this).val()];
        console.log(f);
        processTweets('data/sfo.json', $('.san-francisco'), f);
        processTweets('data/oak.json', $('.oakland'), f);
    });

    $('.filter').val('aggressive');

});


function processTweets(endpoint, container, filter) {

    //container.find('.tweets').html('');
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

        $('.play').click(function() {
            var that = this;
            console.log('playing...');
            R.ready(function() {
                R.player.play({source: $(that).attr('data-key')});
                $(that).addClass('hidden');
                $(that).parent().find('.stop').removeClass('hidden');
                $(that).parent().find('.loading').addClass('hidden');
            });
        });

        $('.stop').click(function() {
            var that = this;
            console.log('stopping...');
            R.ready(function() {
                R.player.pause();
                $(that).addClass('hidden');
                $(that).parent().find('.play').removeClass('hidden');
                $(that).parent().find('.loading').addClass('hidden');
            });
        });

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
