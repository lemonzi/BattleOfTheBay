var isPlaying = null;

$(function() {

    $('.dial').knob();

    $('.filter').change(function() {
        R.player.pause();
        isPlaying = null;
        var f = filters[$(this).val()];
        console.log(f);
        processTweets('data/sfo_merged.json', $('.san-francisco'), f);
        processTweets('data/oak_merged.json', $('.oakland'), f);
    });

});


function processTweets(endpoint, container, filter) {

    //container.find('.tweets').html('');
    $.getJSON(endpoint, function(data) {
        filter || (filter = filters.aggressive);
        var score = 0;
        var t = container.find('.tweets');
        t.html('');
        data.forEach(function(tweet) {
            if (! filter(tweet)) return;
            score++;
            if (score > 10) return;
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
        });
        setTimeout(function(){
            score = 100 * score / data.length;
            animateKnob(container.find('.dial'), score);
        },1);

        $('.play').unbind('click');
        $('.play').click(function() {
            var that = $(this);
            console.log('playing...');
            R.ready(function() {
                R.player.play({source: that.attr('data-key')});
                that.addClass('hidden');
                that.parent().find('.stop').removeClass('hidden');
                if (isPlaying && isPlaying != that) {
                    isPlaying.parent().find('.stop').addClass('hidden');
                    isPlaying.removeClass('hidden');
                }
                isPlaying = that;
            });
        });

        $('.stop').unbind('click');
        $('.stop').click(function() {
            var that = $(this);
            console.log('stopping...');
            R.ready(function() {
                R.player.pause();
                that.addClass('hidden');
                that.parent().find('.play').removeClass('hidden');
                isPlaying = null;
            });
        });

    });
}

function animateKnob (knob, value) {
    $({value: knob.val()}).animate({value: value}, {
        duration: 2000,
        easing:'easeOutCubic',
        step: function() {
            knob.val(Math.round(this.value)).trigger('change');
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
    brooding : function(tweet) {
        return tweet.mood == 'Brooding';
    },
    defiant : function(tweet) {
        return tweet.mood == 'Defiant';
    },
    urgent : function(tweet) {
        return tweet.mood == 'Urgent';
    },
    yearning : function(tweet) {
        return tweet.mood == 'Yearning';
    },
    sensual : function(tweet) {
        return tweet.mood == 'Sensual';
    },
    upbeat : function(tweet) {
        return tweet.mood == 'Upbeat';
    },
    rowdy : function(tweet) {
        return tweet.mood == 'Rowdy';
    },
    energizing : function(tweet) {
        return tweet.mood == 'Energizing';
    },
    peaceful: function(tweet) {
        return ['Easygoing','Tender','Romantic','Peaceful'].indexOf(tweet.mood) > -1;
    },
    indie : function (tweet) {
        return tweet.genre.indexOf('Indie') > -1;
    },
    rb : function (tweet) {
        return tweet.genre.indexOf('R&B') > -1;
    },
    alternative : function (tweet) {
        return tweet.genre.indexOf('Alternative') > -1;
    },
    rock : function (tweet) {
        return tweet.genre.indexOf('Rock') > -1;
    },
    hiphop : function (tweet) {
        return tweet.genre.indexOf('Hip-Hop') > -1;
    },
    electronica : function (tweet) {
        return tweet.genre.indexOf('Electronica') > -1;
    },
    country : function (tweet) {
        return tweet.genre.indexOf('Country') > -1;
    },
    folk : function (tweet) {
        return tweet.genre.indexOf('Folk') > -1;
    },
    reggae : function (tweet) {
        return tweet.genre.indexOf('Reggae') > -1;
    },
    classical : function (tweet) {
        return tweet.genre.indexOf('Classical') > -1;
    },
    dance : function (tweet) {
        return tweet.genre.indexOf('Dance') > -1;
    },
    rap: function(tweet) {
        return tweet.genre.indexOf('Rap') > -1;
    },
    pandora : function(tweet) {
        return tweet.service == 'Pandora';
    },
    rdio : function(tweet) {
        return tweet.service == 'Rdio';
    },
    soundtracking : function(tweet) {
        return tweet.service == 'Soundtracking';
    },
    spotify : function(tweet) {
        return tweet.service == 'Spotify';
    },
    empty: function(tweet) {
        return false;
    }

};
