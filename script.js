let filterColors = [ { name:"pink" , code:"#fd79a8"} , { name:"blue" , code:"#0984e3"},{ name:"green" , code:"#00a055"},{ name:"black" , code:"#b2bec3"}];


let selectedFilter = "black";

let allFilter = document.querySelectorAll(".ticket-filter div")
let ticketContainer = document.querySelector(".tickets-container");
let openModalBtn = document.querySelector(".open-modal");
let closeModalBtn = document.querySelector(".close-modal")
//let ticketContainer = document.querySelector(".tickets-container");




function loadTickets(){

    if(localStorage.getItem("allTickets")){
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));

        for(let i=0;i<allTickets.length;i++){

            //object destructuring
            let {ticketId, ticketFilter, ticketContent } = allTickets[i];
            
            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
        
            //set html of ticket div
            ticketDiv.innerHTML= `
            <div class="ticket-filter ${ticketFilter}"></div>    
            <div class="ticket-info">
                <div class="ticket-id">#${ticketId}</div>
                <div class = "ticket-delete><i class="fa fa-trash" aria-hidden="true"></i></div>
            </div>
            <div class="ticket-content"> ${ticketContent}</div>`;
        
            //append ticket on UI

            
            ticketContainer.append(ticketDiv);


     
    
        }
    }
}
loadTickets();





for(let i=0; i<allFilter.length;i++){

    allFilter[i].addEventListener("click", chooseFilter);
}

function chooseFilter(e){

 // let filter = e.target.classList[1];
//   let filtercode;
//   for(let i=0;i<filterColors.length ; i++){
//         if(filterColors[i].name == filter){
//             filterCode = filterColors[i].code;
//         }
//   }

//  ticketContainer.style.background = filterCode;
 // filter.classList.add("active-filter");



 if(e.target.classList.contains("active-filter")){

    e.target.classList.remove("active-filter");
    loadTickets();
    return;
 }

    if(document.querySelector(".filter.active-filter")){
        document.querySelector(".filter.active-filter").classList.remove("active-filter");

    }

    e.target.classList.add("active-filter");

    let ticketFilter = e.target.classList[1];
    loadSelectedTickets(ticketFilter);
}


openModalBtn.addEventListener("click", handleOpenModal);
closeModalBtn.addEventListener("click",handleCloseModal);

function handleCloseModal(e){
    if(document.querySelector(".modal"))
    document.querySelector(".modal").remove();
}


function handleOpenModal(e){

    let modal = document.querySelector(".modal");
    //if modal already exists in document then return!!
    if(modal){
            return;
    }

    //else create a div with class modal
    let modalDiv = createModal();



    //to add ticket on enter press
     modalDiv.querySelector(".modal-textbox").addEventListener("click", clearModalTextBox);
     modalDiv.querySelector(".modal-textbox").addEventListener("keypress", addTicket);
     
     
     //get all modal filters
     let allModalFilters =  modalDiv.querySelectorAll(".modal-filter");

     for(let i=0;i<allModalFilters.length;i++){

        //add a click event on every modal filter
         allModalFilters[i].addEventListener("click", chooseModalFilter);
     }

     //append modal div on ui
     ticketContainer.append(modalDiv);
}


function createModal(){
    let modalDiv =   document.createElement("div");

    modalDiv.classList.add("modal");

    modalDiv.innerHTML = 
    `<div class="modal-textbox" data-typed = "false" contenteditable="true">Enter Your Task Here
    </div>
        <div class="modal-filter-options">
            <div class="modal-filter pink"></div>
            <div class="modal-filter blue">
            </div><div class="modal-filter green"></div>
            <div class="modal-filter black active-filter"></div>
        </div>`;

    return modalDiv;

}

function chooseModalFilter(e){


    //get the filter name which is clicked
    let selectedModalFilter = e.target.classList[1];
   
    //check if it is black (deafault)
    if(selectedModalFilter == selectedFilter)
    {
        return;
    }

    //else select changed filter
    selectedFilter= selectedModalFilter;
    document.querySelector(".modal-filter.active-filter").classList.remove("active-filter");

    e.target.classList.add("active-filter");
}

function clearModalTextBox(e){
    if(e.target.getAttribute("data-typed")=="true"){
        return;
    }

    e.target.innerHTML="";
    e.target.setAttribute("data-typed","true");

}


function addTicket(e){


    if(e.key == "Enter") {


        //get content of modal text box
        let modalText = e.target.textContent;
        let ticketId= uid();
        //create a div and add class ticket
        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
    
        //set html of ticket div
        ticketDiv.innerHTML= `
        <div class="ticket-filter ${selectedFilter}"></div>    
        <div class="ticket-info">
        <div class="ticket-id">#${ticketId}</div>
        <div class = "ticket-delete><i class="fa fa-trash" aria-hidden="true"></i></div>
         </div>
          <div class="ticket-content"> ${modalText}</div>`;
    
        //append ticket on UI
        ticketContainer.append(ticketDiv);

        fetch("https://api.telegram.org/bot1895603627:AAF12TCae32KgvfippvGT1U9X8cf-Hwt-P0/sendMessage?chat_id=-531960093&text="+`${modalText}`)
        .then(function (response) {
          return response.json();
        });

        
    
        //remove modal from ui
        e.target.parentNode.remove();

        //ticket has been appended on the document
        if(!localStorage.getItem(`allTickets`))
        {


            let allTickets = [];
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets" , JSON.stringify(allTickets));
        }
        else{

            let allTickets = JSON.parse(localStorage.getItem("allTickets"));
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets" , JSON.stringify(allTickets));
        }

        //again set by default filter as black
        selectedFilter =  "black";


    }

   
}

function loadSelectedTickets(ticketFilter){

    if(localStorage.getItem("allTickets")){
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let filteredTickets = allTickets.filter( function(filterObject){
    
            return filterObject.ticketFilter == ticketFilter;
    
        });
      //  console.log(filteredTickets);
    
      ticketContainer.innerHTML = "";
    
      for(let i=0; i<filteredTickets.length; i++){
        let {ticketId, ticketFilter, ticketContent } = filteredTickets[i];
                
        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
    
        //set html of ticket div
        ticketDiv.innerHTML= `
        <div class="ticket-filter ${ticketFilter}"></div>    
        <div class="ticket-info">
        <div class="ticket-id">#${ticketId}</div>
        <div class = "ticket-delete><i class="fa fa-trash" aria-hidden="true"></i></div>
    </div>
        <div class="ticket-content"> ${ticketContent}</div>`;
    
        //append ticket on UI
        ticketContainer.append(ticketDiv);
    
      }
    
     }
    }



//part by part
//create static Ui
//on enter press the ticket should be added 
