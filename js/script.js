const galley = document.getElementById('gallery');
const body = document.getElementsByTagName('body')[0];
const galleryContent = galley.childNodes;



let peopleArray =[]; // store the retuen data in this array for future use 
let peopleIndex;  // used to track displayed profile on the overlay

const searchContainer = document.querySelector('.search-container');
const searchForm = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;
searchContainer.insertAdjacentHTML('afterbegin', searchForm);
 
// check status of the response
function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }


  // function fetches data from the API website 
function fetchData(url) {
    return fetch(url)
             .then(checkStatus)  
             .then(response => response.json())
             .catch(error => console.log('Error occured fetching data!', error))
  }

  fetchData('https://randomuser.me/api/?results=12&inc=name,gender,location,email,picture,cell,dob,nat&nat=ca,us')
  .then(data => {
    const people = data.results;
    generateHTML(people);
    people.forEach(person => {
        peopleArray.push(person);
    });
        
}    );



// for each profile returned, a div is dynamicall created to hold the dfata

function generateHTML (people){
    let eachPerson;

    for(let i=people.length-1; i>=0; i--){
        eachPerson = `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src=${people[i].picture.thumbnail} alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${people[i].name.first} ${people[i].name.last}</h3>
            <p class="card-text">${people[i].email}</p>
            <p class="card-text cap">${people[i].location.city}, ${people[i].location.state}</p>
        </div>
        </div>`;
           galley.insertAdjacentHTML('afterbegin', eachPerson);
    }
    
}

const cards = document.querySelectorAll('.card');


// when a profile is selected , the profile is pushed to the overlay to be displeyd 
galley.addEventListener('click', (e)=>{
    const cards = document.querySelectorAll('.card');
    
    for(let i=0;i< cards.length; i++){
        const img = cards[i].querySelector('.card-img');
        const id = cards[i].querySelector('.card-name ');
        const email = cards[i].querySelectorAll('.card-text')[0];
        const city = cards[i].querySelectorAll('.card-text')[1];

        
        if(e.target === cards[i] || e.target === img || e.target === id || e.target === email || e.target === city ){
           
            createModal(i);
            peopleIndex =i;
        }
    }
   
})


// create a modal on the overlay to hold the clicked profile for display
function createModal(i){
    let birthday = peopleArray[i].dob.date.substr(0, 10);
    birthday= `${birthday.substr(5,2)}/${birthday.substr(8,2)}/${birthday.substr(2,2)}`;
    
    const overlay = `<div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="${peopleArray[i].picture.large}" alt="picture of ${peopleArray[i].name}">
                                <h3 id="name" class="modal-name cap">${peopleArray[i].name.first} ${peopleArray[i].name.last}</h3>
                                <p class="modal-text">${peopleArray[i].email}</p>
                                <p class="modal-text cap">${peopleArray[i].location.city}</p>
                                <hr> 
                                <p class="modal-text">${peopleArray[i].cell}</p>
                                <p class="modal-text">${peopleArray[i].location.street.number} ${peopleArray[i].location.street.name}, ${peopleArray[i].location.city} ${peopleArray[i].location.postcode}</p>
                                <p class="modal-text">Birthday: ${birthday}</p>
                            </div>
                        </div>

                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
                    </div>`;

                galley.insertAdjacentHTML('afterend', overlay);
 }


 // add an event listener to the close button to close the modal display
 body.addEventListener('click', (event)=>{
    const closeX = document.getElementsByTagName('strong')[0];
    const closeButton = document.getElementById('modal-close-btn');
    const overlay  = document.querySelector('.modal-container');
    
    if(event.target === closeButton || event.target === closeX){
        overlay.remove();
    }
 });

 // cycles the displayed profile when next pr back button is clicked 
 body.addEventListener('click', (e)=>{
    const next = document.getElementById('modal-next');
    const prev = document.getElementById('modal-prev');


    if(e.target === next){
        if(peopleIndex < peopleArray.length-1){ 
            peopleIndex ++;
        }else {
            peopleIndex=0;  // returns to first profile if next is clicked on last profile 
        }
        addData(peopleIndex);
    }

    if(e.target === prev){

        if(peopleIndex > 0){
            peopleIndex --;
        }else {
            peopleIndex= peopleArray.length-1; // returns to last profile if back is clicked on first profile 
        }
        addData(peopleIndex);
    }
})

function addData(i){

    let birthday = peopleArray[i].dob.date.substr(0, 10);
    const image = document.querySelector('.modal-img');
    let modalName = document.querySelector('.modal-name');
    let modalEmail = document.querySelectorAll('.modal-text')[0];
    let modalCity = document.querySelectorAll('.modal-text')[1];
    let modalPhone = document.querySelectorAll('.modal-text')[2];
    let modalAddress = document.querySelectorAll('.modal-text')[3];
    let modalBirthday = document.querySelectorAll('.modal-text')[4];
    image.setAttribute('src', peopleArray[i].picture.large);
    modalName.innerText = `${peopleArray[i].name.first} ${peopleArray[i].name.last} ` ;
    modalEmail.innerText = peopleArray[i].email;
    modalCity.innerText = peopleArray[i].location.city;
    modalPhone.innerText = peopleArray[i].cell;
    modalAddress.innerText = `${peopleArray[i].location.street.number} ${peopleArray[i].location.street.name} ${peopleArray[i].location.city} ${peopleArray[i].location.postcode}`;
    modalBirthday.innerText= ` Birhday: ${birthday.substr(5,2)}/${birthday.substr(8,2)}/${birthday.substr(2,2)}`;
 
 
}




// event listener to the search field to seatcj for profile
searchContainer.addEventListener('keyup', (e) => {
    
    const cards = document.querySelectorAll('.card');
            const input = document.getElementById('search-input');

    cards.forEach(card =>{
        if(e.target === input){
        let search = input.value.toLowerCase();
        const nameToFind = card.querySelector('#name').textContent.toLowerCase();
        if(nameToFind.includes(search)) {
            card.style.display = 'block';
        }
        else {
            card.style.display = 'none';
        }
        }
    });
    
    
 });
 


 