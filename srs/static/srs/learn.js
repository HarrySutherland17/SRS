document.addEventListener("DOMContentLoaded", function () {
    let new_cards_data = document.getElementById('new-cards-var').dataset.newCards;
    let review_cards_data = document.getElementById('review-cards-var').dataset.reviewCards
    let new_cards = JSON.parse(new_cards_data);
    let review_cards = JSON.parse(review_cards_data)

    global_load(new_cards, review_cards)
});

async function global_load(new_cards, review_cards) {

    await load_new_cards(new_cards, handleLearningComplete);





}

function load_new_cards(cards, handleLearningComplete) {
    return new Promise((resolve) => {


        let show_button = document.querySelector('#show-answer');
        let next_card = document.querySelector('#next-card');
        let fail_button = document.querySelector('#fail-button');
        let partial_button = document.querySelector('#partial-button');
        let recalled_button = document.querySelector('#recalled-button');

        let learning_complete = '';
        let card_index = 0;
        let last_card = false;


        console.log("Cards length: ", cards.length);

        function update_card() {
            last_card = false;
            if (card_index < cards.length) {
                if (cards[card_index].learnt === false) { // only shows learnt cards

                }
                else { // Card is learnt
                    console.log("Card is learnt");
                    if (card_index !== cards.length - 1) {
                        card_index++;
                    }
                    else {
                        card_index = 0;
                    }
                }

                show_button.style.display = 'inline';
                document.querySelector('.front').innerHTML = cards[card_index].front;
                document.querySelector('.back').innerHTML = '';
                next_card.style.display = 'none';
                fail_button.style.display = 'none';
                partial_button.style.display = 'none';
                recalled_button.style.display = 'none';
                console.log("Card index: ", card_index);

            }
            else {
                console.error("card_index is out of bounds", card_index);
                console.log("Number of cards: ", cards.length);
            }

        }



        function is_complete() {
            function is_cards_learnt() {
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].learnt !== true) {
                        return false;
                    }
                }
                return true;
            }

            if (is_cards_learnt()) {
                console.log("All cards are learnt");
                learning_complete = true;
                document.querySelector('.front').innerHTML = 'Learning stage finished';
                document.querySelector('.back').innerHTML = '';
                show_button.style.display = 'none';
                next_card.style.display = 'none';
                handleLearningComplete(learning_complete);
            } else if (card_index === cards.length - 1) {
                last_card = true;
                console.log("Last card", card_index);
            }
        }

        update_card(); // show first card

        show_button.addEventListener('click', () => {
            if (last_card) {
                document.querySelector('.back').innerHTML = cards[cards.length - 1].back;
            }
            else {
                document.querySelector('.back').innerHTML = cards[card_index].back;
            }
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
            update_card();
            is_complete();
        })

        fail_button.addEventListener('click', () => {
            card_index++;
            update_card();
            is_complete();
        })

        partial_button.addEventListener('click', () => {
            if (card_index >= 0 && card_index < cards.length) {
                if (cards[card_index].n < 0) {
                    cards[card_index].n = cards[card_index].n - 1;
                }

                console.log("n: ", cards[card_index].n);

                if (card_index == cards.length - 1) {
                    card_index = 0;
                    console.log("Card index reset");

                }
                else {
                    card_index++;
                    console.log("Card index incremented");
                }
                console.log(card_index, cards[card_index].n)
                update_card();
                is_complete();
                update_card();
                is_complete();
            }
        })
        recalled_button.addEventListener('click', () => {
            console.log("recalled");

            if (card_index >= 0 && card_index < cards.length) {
                cards[card_index].n += 1;

                if (cards[card_index].n == 2) {
                    cards[card_index].i = 1;
                    cards[card_index].learnt = true;
                }

                console.log("n: ", cards[card_index].n);

                if (card_index == cards.length - 1) {
                    card_index = 0;
                    console.log("Card index reset");

                }
                else {
                    card_index++;
                    console.log("Card index incremented");
                }
                update_card();
                is_complete();
            }

        })
    });

}
function handleLearningComplete(learning_complete) { // if this is true then the learning stage has been complete
    if (learning_complete == true) {
        console.log(learning_complete);
        return true;
    }
    else {
        console.log(learning_complete);
        return false;
    }
}



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
