$(document).ready(function () {

    // populates the dropdown
    $.ajax({
        dataType: "json",
        url: "challenges.json",
        mimeType: "application/json",
        success: function (challenges) {
            var bingoSelection = $('#bingoSelection');
            $.each(challenges, function (key, value) {
                bingoSelection.append($('<option />').val(value.name).text(value.name));
            });
            initBingo();
        }
    });

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
        var bingoMode = $('#bingoSelection').val();

        $.ajax({
            dataType: "json",
            url: "challenges.json",
            mimeType: "application/json",
            success: function (challenges) {
                $.each(challenges, function (key, value) {
                    if (bingoMode == value.name) {
                        var cards = Random.sample(engine, value.challenges, 25);
                        $('td').each(function (index) {
                            $(this).html(cards[index]);
                        });
                        return false;
                    }
                });
            }
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

    // color cells when clicked and the board when you've won
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
    $('#bingoSelection').change(resetBingo);
});
