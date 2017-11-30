$(document).ready(function () {

    initBingo();

    // initializes the bingo with a new seed
    function initBingo() {
        newSeed();
        resetBingo();
    }

    // resets the bingo, keeping the same seed as before
    function resetBingo() {
        clearBingo();
        fillBingo();
    }

    // resets the board state, unselecting every cell
    function clearBingo() {
        $('td').removeClass('selected');
        $('table').removeClass('win');
    }

    // generates a new seed for the bingo
    function newSeed() {
        var engine = Random.engines.mt19937();
        engine.autoSeed();
        var newSeed = Random.integer(0, 2147483647)(engine);
        $('#seed').val(newSeed);
    }

    // fills the cells with unique challenges using a 32-bit seed
    function fillBingo() {
        var seed = $('#seed').val();
        var engine = Random.engines.mt19937();
        engine.seed(seed);
        var game = $('#gameSelection').val();

        $.getJSON("challenges.json", function (challenges) {
            var cards = Random.sample(engine, challenges[game], 25);
            $('td').each(function (index) {
                $(this).html(cards[index]);
            });
        });
    }

    // returns true if a row, column or diagonal has been fully selected
    function isBingo() {
        for (var i = 1; i <= 5; i++) {
            if ($('.row' + i + '.selected').length == 5 || $('.col' + i + '.selected').length == 5) {
                return true;
            }
        }
        if ($('.diag1.selected').length == 5 || $('.diag2.selected').length == 5) {
            return true;
        }
        return false;
    }

    $('td').click(function () {
        $(this).toggleClass('selected');
        if (isBingo()) {
            $('table').addClass('win');
        } else {
            $('table').removeClass('win');
        }
    });

    $('#newSeed').click(initBingo);
    $('#seed').change(resetBingo);
    $('#gameSelection').change(resetBingo);
});
