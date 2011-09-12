/*
Copyright (c) 2011 Benjamin J. Regenspan.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($) {

        $.noConflict(); // this is unecessary due to sandboxing, but whatever

        var CHARACTERS = 140;

        var DUMB_ICONS_CLASS = 'f-oa-Bd-Xa';
        var MAIN_PANE_ID = 'contentPane';

        var INPUT_PLACEHOLDER_CLASS = 'f-xe';
        var INPUT_CLASS = 'editable';
        var INPUT_BOTTOM_MENU_CLASS = 'f-A';

        var pane = $('#' + MAIN_PANE_ID);

        // hide dumb icons
        pane.find('.' + DUMB_ICONS_CLASS).hide();

        // listen for click on input placeholder
        var placeholder = pane.find('.' + INPUT_PLACEHOLDER_CLASS);
        placeholder.click(function() {

            $.doWhen(
                // make sure their input has opened
                function() {
                    return !!(pane.find('.' + INPUT_CLASS) &&
                        pane.find('.' + INPUT_CLASS).html());
                },

                // intitialize input modifications
                function() {            
                    var input_menu = pane.find('.' + INPUT_BOTTOM_MENU_CLASS);
                    input_menu.css('color', '#999');

                    var input = pane.find('.' + INPUT_CLASS);

                    var imgURL = chrome.extension.getURL("media/lama.png");
                    var lama = $('<img>', { src: imgURL, id: 'lama' }).appendTo('body');

                    var tag_regex = /<[^>]+>/;
                    var updateRemaining = function() {
                        var stripped_input = input.html().replace(tag_regex, '');
                        if (stripped_input.length > CHARACTERS) {
                            input.html(stripped_input.substr(0, CHARACTERS));     

                            // flash His Holiness The Dalai Lama if He's not already flashing
                            if (!lama.queue('fx').length) {
                                var sound = chrome.extension.getURL("media/airhorn.mp3").replace(/\.mp3$/, '');
                                var alarm = new buzz.sound( sound, {
                                    formats: [ "mp3" ]
                                });
                                alarm.play();
                                lama.fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500);
                            }
                        } else {
                            input_menu.html((CHARACTERS-stripped_input.length) + ' characters remaining');
                        }
                    };

                    // update count and listen for input
                    updateRemaining();
                    input.keyup(updateRemaining);
                }
            );

        });

})(jQuery);
