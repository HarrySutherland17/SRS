let show_button;
let next_card;
let fail_button;
let partial_button;
let recalled_button;
let complete_button;
let deck_id;

document.addEventListener("DOMContentLoaded", function () {
    let new_cards_data = document.getElementById('new-cards-var').dataset.newCards;
    let review_cards_data = document.getElementById('review-cards-var').dataset.reviewCards;
    let new_cards = JSON.parse(new_cards_data);
    let review_cards = JSON.parse(review_cards_data);

    show_button = document.querySelector('#show-answer');
    next_card = document.querySelector('#next-card');
    fail_button = document.querySelector('#fail-button');
    partial_button = document.querySelector('#partial-button');
    recalled_button = document.querySelector('#recalled-button');
    complete_button = document.querySelector('#complete-button');
    deck_id = document.getElementById('deck-id-var').dataset.deckId;


    console.log(new_cards);
    console.log("deck_id: ", deck_id);

    global_load(new_cards, review_cards)
});

function global_load(new_cards, review_cards) {

    if (load_new_cards(new_cards)) {
        load_review_cards(review_cards);
    }
}

function load_review_cards(cards) {
    console.log(cards);
    console.log("Review cards length: ", cards.length);

    let card_index = 0;
    let is_last_card = false;
    let last_card = null;
    let review_n_total = 0;
    let review_complete = false;
    let cards_left = null;


    if (cards.length === 0) {
        show_button.style.display = 'none';
        document.querySelector('.front').innerHTML = 'Review stage finished';
        document.querySelector('.back').innerHTML = '';
        next_card.style.display = 'none';
        fail_button.style.display = 'none';
        partial_button.style.display = 'none';
        recalled_button.style.display = 'none';

        return true;
    }
    else {
        show_button.style.display = 'inline';
        document.querySelector('.front').innerHTML = cards[card_index].front;
        document.querySelector('.back').innerHTML = '';
        next_card.style.display = 'none';
        fail_button.style.display = 'none';
        partial_button.style.display = 'none';
        recalled_button.style.display = 'none';
    }

    function update_card(first_card) {

        function display() {
            show_button.style.display = 'inline';
            document.querySelector('.front').innerHTML = cards[card_index].front;
            document.querySelector('.back').innerHTML = '';
            next_card.style.display = 'none';
            fail_button.style.display = 'none';
            partial_button.style.display = 'none';
            recalled_button.style.display = 'none';
        }

        if (cards.length === 0) {
            review_complete = true;
        }

        if (card_index < cards.length) {
            console.log("Card index: ", card_index);

            if (cards[card_index].review_n === 1) { // calculates n_total
                review_n_total += 1;
                console.log("review_n_total: ", review_n_total)
                if (review_n_total === cards.length) {
                    console.log("Review complete");
                    review_complete = true;
                    return;
                }
            }

            cards_left = cards.length - review_n_total;
            console.log("cards_left: ", cards_left);


            if (first_card === true) {
                last_card = cards.length - 1;
            }

            if (cards_left == 1) {
                is_last_card = true;
            }

            else if (cards[card_index].review_n === 0) { // checks if current card is last_card
                if (card_index === last_card) {
                    is_last_card = true;
                }
                else {
                    is_last_card = false;
                }
            }
            else if (cards[card_index].review_n === 1) {
                if (card_index === last_card) {
                    is_last_card = true;
                }
                else {
                    is_last_card = false;
                }
            }

            else {
                is_last_card = false;
            }
            console.log("is_last_card:", is_last_card);


            if (cards[card_index].review_n === 1) {
                // console.log("Card index (n=1)", card_index)
                console.log("Card is reviewed");

                if (is_last_card) { // last card and n = 1

                    console.log("Last card n=1 logic");
                    for (let i = 0; i < cards.length; i++) { // finds first card
                        if ((cards[i].review_n === 0) && i !== card_index) {
                            card_index = i;
                            console.log(i);
                            break;
                        }

                    }
                }
                else { // not last card and n != 0
                    card_index++
                    console.log("Index incremented, not last card n != 0");
                    if (cards[card_index].review_n === 1) {
                        console.log("n != 0 looking for next card");
                        for (let i = 0; i < cards.length; i++) {

                            if ((cards[i].review_n === 0) && i !== card_index) {
                                card_index = i;
                                break;
                            }

                        }
                    }
                }

            }
            else { // n == 0
                if (is_last_card) {
                    for (let i = 0; i < cards.length; i++) {
                        if ((cards[i].review_n === 0) && i !== card_index) {
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

            if (review_n_total === cards.length) {
                console.log("Review complete");
                review_complete = true;
            }
            else if (cards[card_index].review_n === 0) {
                display();
            }
            else if (cards[card_index].review_n === 1) {
                card_index++
                if (cards[card_index].review_n === 1) {
                    for (let i = 0; i < cards.length; i++) {
                        if ((cards[i].review_n === 0) && i !== card_index) {
                            card_index = i;
                            break;
                        }
                    }
                }
                display();
            }

            for (let i = (cards.length - 1); i >= 0; i--) { // defines last card
                if (cards[i].review_n === 0) {
                    last_card = i;
                    console.log("Last card index: ", i);
                    break;
                }
                else {
                    continue;
                }
            }
        }
        else {
            console.error("card_index is out of bounds", card_index);
            console.log("Number of cards: ", cards.length);
        }

    }

    function is_complete() {
        if (review_complete) {
            document.querySelector('.front').innerHTML = 'Review stage finished';
            document.querySelector('.back').innerHTML = '';
            show_button.style.display = 'none';
            next_card.style.display = 'none';
            fail_button.style.display = 'none';
            partial_button.style.display = 'none';
            recalled_button.style.display = 'none';

            for (let i = 0; i <= cards.length - 1; i++) {
                cards[i].review_n = 0;
            }

            send_reviewed_cards(cards);

            return true
        }
        else {
            return false;
        }
    }

    function send_reviewed_cards(reviewed_cards) {
        const csrftoken = document.cookie.match(/csrftoken=([^;]+)/)[1]; // takes the second index of array as it contains the string from the regex
        console.log(csrftoken);
        fetch(`/learn/${deck_id}/handle_reviewed_cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(reviewed_cards)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Data sent successfully");
                }
                else {
                    console.error("Data failed to send");
                }
            })
            .catch(error => {
                console.error('Error: ', error);
            })
    }

    update_card(true);

    show_button.addEventListener('click', () => {

        document.querySelector('.back').innerHTML = cards[card_index].back;
        show_button.style.display = 'none';
        next_card.style.display = 'inline';
        fail_button.style.display = 'inline';
        partial_button.style.display = 'inline';
        recalled_button.style.display = 'inline';
    })

    fail_button.addEventListener('click', () => {
        cards[card_index].n = 0;
        cards[card_index].review_n = 0;

        cards[card_index].constant_i = cards[card_index].constant_i - 0.2;
        console.log("n: ", cards[card_index].n);
        console.log("constant_i: ", cards[card_index].constant_i);

        update_card(false);
        is_complete();
    })

    partial_button.addEventListener('click', () => {
        if (card_index >= 0 && card_index < cards.length) {
            cards[card_index].n = 0;
            cards[card_index].review_n = 1;
            cards[card_index].constant_i = cards[card_index].constant_i - 0.1;

            console.log("constant_i: ", cards[card_index].constant_i);
            console.log("n: ", cards[card_index].n);

            update_card(false);
            is_complete();
        }
    })
    recalled_button.addEventListener('click', () => {
        console.log("recalled");

        if (card_index >= 0 && card_index < cards.length) {
            cards[card_index].n += 1;
            cards[card_index].review_n = 1;

            console.log("n: ", cards[card_index].n);
            console.log("review_n: ", cards[card_index].review_n);


            update_card(false);
            is_complete();

        }

    })
    if (is_complete()) {
        return true;
    }

}

function load_new_cards(cards) {

    let card_index = 0;
    let is_last_card = false;
    let last_card = null;
    let n_total = 0;
    let learning_complete = false;
    let cards_left = null;


    console.log("Cards length: ", cards.length);

    if (cards.length === 0) {
        show_button.style.display = 'none';
        document.querySelector('.front').innerHTML = 'Learning stage finished';
        document.querySelector('.back').innerHTML = '';
        next_card.style.display = 'none';
        fail_button.style.display = 'none';
        partial_button.style.display = 'none';
        recalled_button.style.display = 'none';

        return true;
    }

    function update_card(first_card) {

        function display() {
            show_button.style.display = 'inline';
            document.querySelector('.front').innerHTML = cards[card_index].front;
            document.querySelector('.back').innerHTML = '';
            next_card.style.display = 'none';
            fail_button.style.display = 'none';
            partial_button.style.display = 'none';
            recalled_button.style.display = 'none';
        }

        if (cards.length === 0) {
            learning_complete = true;
        }

        if (card_index < cards.length) {
            console.log("Card index: ", card_index);

            if (cards[card_index].n === 2) { // calculates n_total
                n_total += 2;
                console.log("n_total: ", n_total)
                if (n_total === (2 * cards.length)) {
                    console.log("Learning complete");
                    learning_complete = true;
                    return;
                }
            }

            cards_left = cards.length - (n_total / 2);
            console.log("cards_left: ", cards_left);


            if (first_card === true) {
                last_card = cards.length - 1;
            }

            if (cards_left == 1) {
                is_last_card = true;
            }

            else if (cards[card_index].n !== 2) { // checks if current card is last_card
                if (card_index === last_card) {
                    is_last_card = true;
                }
                else {
                    is_last_card = false;
                }
            }
            else if (cards[card_index].n === 2) {
                if (card_index === last_card) {
                    is_last_card = true;
                }
                else {
                    is_last_card = false;
                }
            }

            else {
                is_last_card = false;
            }
            console.log("is_last_card:", is_last_card);


            if (cards[card_index].n === 2) {
                console.log("Card index (n=2)", card_index)
                console.log("Card is learnt");

                if (is_last_card) { // last card and n = 2

                    console.log("Last card n=2 logic");
                    for (let i = 0; i < cards.length; i++) { // finds first card
                        if ((cards[i].n !== 2) && i !== card_index) {
                            card_index = i;
                            console.log(i);
                            break;
                        }

                    }
                }
                else { // not last card and n = 2
                    card_index++
                    console.log("Index incremented, not last card n = 2");
                    if (cards[card_index].n === 2) {
                        console.log("n = 2 looking for next card");
                        for (let i = 0; i < cards.length; i++) {

                            if ((cards[i].n !== 2) && i !== card_index) {
                                card_index = i;
                                break;
                            }

                        }
                    }
                }

            }
            else { // n != 2
                if (is_last_card) {
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
            else if (cards[card_index].n !== 2) {
                display();
            }
            else if (cards[card_index].n === 2) {
                card_index++
                if (cards[card_index].n === 2) {
                    for (let i = 0; i < cards.length; i++) {
                        if ((cards[i].n !== 2) && i !== card_index) {
                            card_index = i;
                            break;
                        }
                    }
                }
                display();
            }

            for (let i = (cards.length - 1); i >= 0; i--) { // defines last card
                if (cards[i].n !== 2) {
                    last_card = i;
                    console.log("Last card index: ", i);
                    break;
                }
                else {
                    continue;
                }
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

            send_learnt_cards(cards);

            return true
        }
        else {
            return false;
        }
    }

    function send_learnt_cards(learnt_cards) {
        const csrftoken = document.cookie.match(/csrftoken=([^;]+)/)[1]; // takes the second index of array as it contains the string from the regex
        console.log(csrftoken);
        fetch(`/learn/${deck_id}/handle_learnt_cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(learnt_cards)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Data sent successfully");
                }
                else {
                    console.error("Data failed to send");
                }
            })
            .catch(error => {
                console.error('Error: ', error);
            })
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

        }

    })
    complete_button.addEventListener('click', () => {
        learning_complete = true;

        for (let i = 0; i <= cards.length - 1; i++) {
            cards[i].n = 2;
            cards[i].i = 1;
            cards[i].learnt = true;
        }

        is_complete();
    })

    if (is_complete()) {
        return true;
    }
};

