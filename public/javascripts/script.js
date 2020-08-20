document.addEventListener('DOMContentLoaded', () => {
    let rightArrow = document.getElementById('right_arrow');
    let leftArrow = document.getElementById('left_arrow');
    // TODO: Lengthen time of scroll
    // TODO: Have auto-scroll stop when arrows clicked on

    // Confirm the button is on the page before adding an event handler
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            let books = document.getElementsByClassName('books');
            let firstBook = books[0]
            let carousel = firstBook.parentNode

            // Move the first node to the end, hide it, and show the new 3rd node.
            books[0].style.display = 'none';
            carousel.removeChild(firstBook);
            books[2].style.display = 'block';
            carousel.appendChild(firstBook);
        });

        // Create a timer to trigger the rightArrow event
        let carouselInterval = window.setInterval(() => {
            rightArrow.dispatchEvent(new MouseEvent('click'))
        }, 4000);
    }

    // Confirm the button is on the page before adding an event handler
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            let books = document.getElementsByClassName('books');
            let lastBook = books[books.length - 1];
            let carousel = lastBook.parentNode

            // Move the last node to the front, show it, and hide the old 3rd node.
            books[2].style.display = 'none';
            carousel.removeChild(lastBook);
            carousel.insertBefore(lastBook, books[0]);
            lastBook.style.display = 'block';
        });
    }

    // Set up handler for contact form submission; confirm the button is on the page
    let submitButton = document.getElementById('submit');

    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();

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

            // Construct the payload
            let fieldset = document.getElementsByClassName('form_type')[0];
            let radioButtons = fieldset.getElementsByTagName('input');
            let messageType;

            // Get the value of the checked radio button
            let i = 0;
            while (!messageType && i < radioButtons.length) {
                if (radioButtons[i].checked) {
                    messageType = radioButtons[i].value;
                }

                i++;
            }

            // Construct the payload
            let payload = {
                type: messageType,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            }

            req.send(JSON.stringify(payload));
        });
    }
});
