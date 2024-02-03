document.addEventListener("DOMContentLoaded", function () {
    let new_cards_data = document.getElementById('new-cards-var').dataset.newCards;
    let review_cards_data = document.getElementById('review-cards-var').dataset.reviewCards
    let new_cards = JSON.parse(new_cards_data);
    let review_cards = JSON.parse(review_cards_data)

    global_load(new_cards, review_cards)
});

function global_load(new_cards, review_cards) {

    load_new_cards(new_cards);





}

function load_new_cards(cards /*handleLearningComplete*/) {
    // return new Promise((resolve) => {


    let show_button = document.querySelector('#show-answer');
    let next_card = document.querySelector('#next-card');
    let fail_button = document.querySelector('#fail-button');
    let partial_button = document.querySelector('#partial-button');
    let recalled_button = document.querySelector('#recalled-button');

    let card_index = 0;
    let last_card = false;
    let n_total = 0;
    let learning_complete = false;


    console.log("Cards length: ", cards.length);

    function update_card(first_card) {

        function display() {
            show_button.style.display = 'inline';
            document.querySelector('.front').innerHTML = cards[card_index].front;
            document.querySelector('.back').innerHTML = '';
            next_card.style.display = 'none';
            fail_button.style.display = 'none';
            partial_button.style.display = 'none';
            recalled_button.style.display = 'none';
            console.log("Card index: ", card_index);
        }

        if (card_index < cards.length) {
            if (card_index === cards.length - 1) {
                last_card = true;
            }

            if (cards[card_index].n === 2) {
                console.log("Card is learnt");
                if (last_card) { // last card and n = 2
                    last_card = false;
                    for (let i = 0; i < cards.length; i++) {
                        if ((cards[i].n !== 2) && i !== card_index) {
                            card_index = i;
                            console.log(i);
                            break;
                        }

                    }
                }
                else { // not last card and n = 2
                    card_index++
                    if (cards[card_index].n === 2) {
                        for (let i = 0; i < cards.length; i++) {

                            if ((cards[i].n !== 2) && i !== card_index) {
                                card_index = i;
                                break;
                            }

                        }
                    }
                }
                n_total += 2;
                console.log("n_total: ", n_total)

            }
            else { // n != 2
                if (last_card) {
                    for (let i = 0; i < cards.length; i++) {
                        if ((cards[i].n !== 2) && i !== card_index) {
                            card_index = i;
                            break;
                        }
                    }
                }
                else if (first_card) {
                    first_card = false;
                    card_index = 0;
                }
                else {
                    card_index++;
                }

            }

            if (n_total === (2 * cards.length)) {
                console.log("Learning complete");
                learning_complete = true;
            }
            else {
                display();
            }
        }
        else {
            console.error("card_index is out of bounds", card_index);
            console.log("Number of cards: ", cards.length);
        }

    }

    function is_complete() {
        if (learning_complete) {
            document.querySelector('.front').innerHTML = 'Learning stage finished';
            document.querySelector('.back').innerHTML = '';
            show_button.style.display = 'none';
            next_card.style.display = 'none';
            fail_button.style.display = 'none';
            partial_button.style.display = 'none';
            recalled_button.style.display = 'none';
            return true
        }
        else {
            return false;
        }
    }

    update_card(true); // show first card

    show_button.addEventListener('click', () => {

        document.querySelector('.back').innerHTML = cards[card_index].back;
        show_button.style.display = 'none';
        next_card.style.display = 'inline';
        fail_button.style.display = 'inline';
        partial_button.style.display = 'inline';
        recalled_button.style.display = 'inline';
    })

    next_card.addEventListener('click', () => {
        if (card_index < cards.length - 1) {
            card_index++;
        }
        else {
            card_index = 0;
        }
        update_card(false);
        is_complete();
    })

    fail_button.addEventListener('click', () => {
        if (card_index >= 0 && card_index < cards.length) {

            cards[card_index].n = 0;
            console.log("n: ", cards[card_index].n);
        }

        update_card(false);
        is_complete();
    })

    partial_button.addEventListener('click', () => {
        if (card_index >= 0 && card_index < cards.length) {
            if (cards[card_index].n < 0) {
                cards[card_index].n = cards[card_index].n - 1;
            }

            console.log("n: ", cards[card_index].n);
            update_card(false);
            is_complete();
        }
    })
    recalled_button.addEventListener('click', () => {
        console.log("recalled");

        if (card_index >= 0 && card_index < cards.length) {
            if (cards[card_index].n < 2) {
                cards[card_index].n += 1;
            }

            if (cards[card_index].n == 2) {
                cards[card_index].i = 1;
                cards[card_index].learnt = true;
            }

            console.log("n: ", cards[card_index].n);

            update_card(false);
            is_complete();
            console.log("n_total", n_total);

        }

    })
};


function format(string) {
    let remove = ['[', ']', ',', "'"];
    let fstring = '';

    for (let i = 0; i < string.length; i++) {
        if (remove.includes(string[i])) {
            fstring += '';
        }
        else {
            fstring += string[i];
        }
    }

    return fstring;
};
