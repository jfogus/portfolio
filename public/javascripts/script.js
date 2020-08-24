document.addEventListener('DOMContentLoaded', () => {
    let rightArrow = document.getElementById('right_arrow');
    let leftArrow = document.getElementById('left_arrow');
    let books = document.getElementsByClassName('books');
    let carouselContainer = document.getElementsByClassName('carousel_container')[0];
    let carousel = document.getElementsByClassName('carousel')[0];
    let submitButton = document.getElementById('submit');

    // Confirm the button is on the page before adding an event handler
    if (rightArrow && leftArrow && books && carouselContainer && carousel) {
        // Handle inc/dec carousel elements when resize
        window.addEventListener('resize', () => {
            if (getFirstHiddenElem(books) === books[3] && window.innerWidth <= 950) {
                books[1].style.display = 'none';
                books[2].style.display = 'none';
            } else if (getFirstHiddenElem(books) === books[1] && window.innerWidth > 950) {
                books[1].style.display = 'block';
                books[2].style.display = 'block';
            }
        });

        // Control rightward movement of the carousel
        rightArrow.addEventListener('click', () => {
            let firstBook = books[0];
            let nextBook = getFirstHiddenElem(books);

            // Move the first node to the end, hide it, and show the next node.
            firstBook.style.display = 'none';
            carousel.removeChild(firstBook);
            nextBook.style.display = 'block';
            carousel.appendChild(firstBook);
        });

        // Control leftward movement of the carousel
        leftArrow.addEventListener('click', () => {
            let firstBook = books[books.length - 1];
            let lastBook = getFirstHiddenElem(books);

            // Get the last displayed book
            lastBook = lastBook.previousElementSibling;

            // Move the previous last node to the front, show it, and hide the previously last visible node
            lastBook.style.display = 'none';
            carousel.removeChild(firstBook);
            carousel.insertBefore(firstBook, books[0]);
            firstBook.style.display = 'block';
        });

        // Create a timer to autoscroll
        let carouselInterval = window.setInterval(() => {
            rightArrow.dispatchEvent(new MouseEvent('click'))
        }, 4000);

        // Stop autoscroll when mouse over the carousel_container
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        // Restart autoscroll after mouse leaves
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = window.setInterval(() => {
                rightArrow.dispatchEvent(new MouseEvent('click'))
            }, 4000);
        });
    }

    // Set up handler for contact form submission; confirm the button is on the page
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Construct the payload
            let radioButtons = document.getElementsByClassName('form_type')[0].getElementsByTagName('input');
            let messageType = getSelectedRadioButton(radioButtons);

            let payload = {
                type: messageType,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            }

            // Create a new request
            let req = new XMLHttpRequest();
            req.open('POST', '/contact', true);
            req.setRequestHeader('Content-Type', 'application/json');

            // Handle the response
            req.addEventListener('load', () => {
                let message = document.getElementById('result_message');

                if (req.status >= 200 && req.status < 400) {
                    message.textContent = 'Thank you for contacting Josh. He will get back to you soon.';
                } else {
                    message.textContent = 'Error in network request' + req.statusText;
                }

                // Remove the form so multiple submissions are not permitted without reload
                let form = document.getElementsByTagName('form')[0];
                let div = form.parentNode;
                div.removeChild(form);
            });

            req.send(JSON.stringify(payload));
        });
    }
});

function getSelectedRadioButton(radioButtonCollection) {
    /* Receives an HTMLCollection of radio button inputs and returns the first element
       that has the checked attribute or null. */
    let messageType;
    let index = 0;

    while (!messageType && index < radioButtonCollection.length) {
        if (radioButtonCollection[index].checked) {
            messageType = radioButtonCollection[index].value;
        }

        index++;
    }

    return messageType || null;
}

function getFirstHiddenElem(htmlCollection) {
    /* Receives an HTMLCollection and returns the first element that has a computed
       display of none or null. */
    let nextBook;
    let index = 0;

    while (!nextBook && index < htmlCollection.length) {
        // Check all styles for display: none
        if (window.getComputedStyle(htmlCollection[index]).display === 'none') {
            nextBook = htmlCollection[index];
        }

        index++;
    }

    return nextBook || null;
}
