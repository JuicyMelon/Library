//testing playground

let formcontainer = document.querySelector('#formcontainer');
let formCancel = document.querySelector('#form-cancel');
let form = document.querySelector('#epic');
let supercont = document.querySelector('#supercontainer')
let submit = document.querySelector('#submit').addEventListener('mousedown', () => {
    let title = document.querySelector('#title');
    let author = document.querySelector('#author');
    let page = document.querySelector('#pages');
    let read = document.querySelector('#read');
    addBookToLibrary(title.value, author.value, page.value, read.value);
    supercont.style.filter = "blur(0)"
    formcontainer.removeChild(form)
})
formcontainer.removeChild(form)

let submitFunc = () => {
    supercont.style.filter = "blur(4px)"
    formcontainer.appendChild(form)
    form.style.opacity = "1";
    form.style.filter = "blur(0) !important"
    formcontainer.style.filter = "blur(0) !important"

}

//allows form to be cancelled

formCancel.addEventListener('mousedown', () => {
    supercont.style.filter = "blur(0)"
    formcontainer.removeChild(form);
})


//array to store library
let myLibrary = [];

//counter
let counter = 0;

//firebase database
let database = firebase.database().ref();
let dbLibrary = database.child('Books').child('myLibrary');

dbLibrary.once('value').then( snapshot => {
    for(let i = 0; i < snapshot.val().length; i++) {
        myLibrary[i] = snapshot.val()[i];
        render();
    }
})


console.log(database.child('Books').child("" + 0))
function updatedb() {
    database.child('Books').child('myLibrary').set(myLibrary);
} 

//card container
let container = document.querySelector('#container');

//constructs new book objects
class Book {
    constructor(Atitle, Bauthor, CnumPages, DreadYet) {
        this.Atitle = Atitle;
        this.Bauthor = Bauthor;
        this.CnumPages = CnumPages;
        if(DreadYet.toLowerCase() == 'yes') {
            this.DreadYet = "has been read";
        } else {
            this.DreadYet = "has not been read";
        }
    }
}

//adds new books to array
function addBookToLibrary(title, author, numPages, readYet) {
    let tempBook = new Book(title, author, numPages, readYet)
    myLibrary[myLibrary.length] = tempBook;
    updatedb();
    render();
}

//renders books onto screen
function render() {
        let card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', myLibrary.length - 1 + "");
        container.appendChild(card);
        let textDiv = document.createElement('div');
        textDiv.classList.add('textDiv')
        card.appendChild(textDiv);
        let img = document.createElement('img');
        img.setAttribute('src', 'images/bookImg.png');
        img.classList.add('bookPic');
        card.appendChild(img)
        for(let key in myLibrary[myLibrary.length - 1]) {
            if(key == 'changeStatus') {
                break;
            }
            let aspect = document.createElement('p');
            aspect.textContent = myLibrary[myLibrary.length - 1][key];
            aspect.setAttribute('id', `${key}${myLibrary.length - 1}`)
            console.log(myLibrary[myLibrary.length - 1][key])
            textDiv.appendChild(aspect);
        }

        //adds removal button
        let removeButton = document.createElement('button')
        
        removeButton.setAttribute('id', `${myLibrary.length - 1}button`);
        removeButton.classList.add('remove')
        removeButton.textContent = 'X';
        removeButton.addEventListener('mousedown', () => {
            card.remove();
            resetCards();
            let cardId = card.getAttribute('id');
            myLibrary.splice(+cardId, 1);
            console.log(cardId)
            updatedb();
        })
        card.appendChild(removeButton)

        //adds read status button
        let readStatus = document.createElement('button')
        readStatus.setAttribute('id', `${myLibrary.length - 1}status`);
        readStatus.classList.add('status')
        readStatus.addEventListener('mousedown', () => {
            let id = card.getAttribute('id')
            let temp = myLibrary[parseInt(id)];
            console.log(temp)
            let currCard = document.querySelector(`#DreadYet${id}`);
            if(temp.DreadYet == 'has been read') {
                temp.DreadYet = "has not been read";
            } else {
                temp.DreadYet = "has been read";
            }
            currCard.textContent = myLibrary[parseInt(id)].DreadYet;
            updatedb();
            console.log('test')
            
        })
        readStatus.textContent = "Change read status";
        card.appendChild(readStatus)


}

//resets cards
function resetCards() {
    let allCards = document.querySelectorAll('.card');
    let i = 0;
    allCards.forEach(element => {
        element.setAttribute('id', "" + i);
        i++;
    })
    console.log('cards reset!')
}

//new book button
let bookAdder = document.querySelector('#newBook');
bookAdder.addEventListener('mousedown', submitFunc);





