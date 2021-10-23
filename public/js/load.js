let brokerSelect = document.getElementsByClassName('card-addBroker')[0]
let brokerOptions = document.getElementsByClassName('card-SelectBroker')[0]  
let brokerBG = document.getElementsByClassName('card-SelectBroker-Bg')[0]
let differenBrokerBtn  = document.getElementsByClassName('differenBrokerBtn')[0]
let detailsCard =  document.querySelector('.brokerDetails')
let editBtn = document.getElementById('edit-Details')


// Broker Section
brokerSelect.addEventListener('click', ()=>{
    brokerOptions.classList.toggle('d-none')
    brokerSelect.classList.toggle('d-none')
})


brokerBG.addEventListener('click',()=>{
  brokerOptions.classList.toggle('d-none')
  if(brokerSelect.classList.contains('active')){
    brokerSelect.classList.remove('d-none')
  }else{
    detailsCard.classList.remove('d-none')
  }

})


differenBrokerBtn.addEventListener('click',()=>{
    brokerSelect.classList.add('d-none')
    detailsCard.classList.add('d-none')
    brokerOptions.classList.remove('d-none')
})


editBtn.addEventListener('click',()=>{
  detailsCard =  document.querySelector('.brokerDetails')
  id =   detailsCard.querySelector('.brokerId').value

  fetch(`/app/api/company/${id}`).then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      // Work with JSON data here
      console.log(data);
      tabContent = document.getElementById('edit-brokerTabContent')
      // Broker - Details Tab
      tabContent.querySelector('#edit-brokerName').value = data.name
      tabContent.querySelector('#edit-brokerEmail').value = data.email
      tabContent.querySelector('#edit-brokerTollFree').value = data.tollFree
      tabContent.querySelector('#edit-brokerMC').value = data.mc
      tabContent.querySelector('#edit-brokerDOT').value = data.dot
      //Broker - Billing Tab  
      tabContent.querySelector('#edit-brokerBillingAddress1').value = data.billing.address1
      tabContent.querySelector('#edit-brokerBillingAddress2').value = data.billing.address2
      tabContent.querySelector('#edit-brokerBillingCity').value = data.billing.city
      tabContent.querySelector('#edit-brokerBillingState').value = data.billing.state
      tabContent.querySelector('#edit-brokerBillingPostal').value = data.billing.postal
      // Broker - More Tab
      tabContent.querySelector('#edit-brokerMobile').value = data.mobile
      tabContent.querySelector('#edit-brokerFax').value = data.fax
      tabContent.querySelector('#edit-brokerWebsite').value = data.website
      tabContent.querySelector('#edit-brokerNotes').innerText = data.note

      document.getElementById('edit-BrokerDetails').setAttribute('action',`../broker/${data._id}/edit`)




    }).catch(err => {
      // Do something for an error here
      console.log("Error Reading data " + err);
    });
})


for( li of brokerOptions.querySelectorAll('li')){
    displayAPI(li)
}


function displayAPI(el){
    el.addEventListener('click',()=>{
        id= el.querySelector('.brokerId').innerText.trim()
        fetch(`/app/api/company/${id}`).then(response => {
            console.log(response);
            return response.json();
          }).then(data => {
            // Work with JSON data here
            console.log(data);

            detailsCard =  document.querySelector('.brokerDetails')
            console.log(detailsCard)
            detailsCard.querySelector('.brokerId').value = data._id
            detailsCard.querySelector('.brokerName').innerText = data.name
            detailsCard.querySelector('.edit-brokerName').innerText = data.name
            detailsCard.querySelector('.address1').innerText = data.billing.address1
            detailsCard.querySelector('.address2').innerText = data.billing.address2
            detailsCard.querySelector('.city').innerText = data.billing.city
            detailsCard.querySelector('.state').innerText = data.billing.state
            detailsCard.querySelector('.postal').innerText = data.billing.postal
          }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
          });
          setTimeout(() => { 
            brokerSelect.classList.add('d-none')
            brokerOptions.classList.add('d-none')
            detailsCard.classList.remove('d-none')

            brokerSelect.classList.remove('active')
            detailsCard.classList.add('active')
          }, 50);

        
          
    })
}

function validator(){
  let loadForm = document.getElementById('loadForm')
  let inputForms = loadForm.getElementsByTagName('input')
  let validateArr = []
  
  // Obtain all Inputs.
  for(let item of inputForms){
    validateArr.push(item.value.length > 0)
  }
  validateArr.push(loadForm.querySelector('textarea').innerHTML.length > 0)

  console.log("Array: ",validateArr)
  // Obtain Text Array.
  let checker = arr => arr.every(v => v === true);
  checker(validateArr)? document.getElementById('formSubmit').classList.remove('disabled'):document.getElementById('formSubmit').classList.add('disabled');

 
}

let loadForm = document.getElementById('loadForm')
let inputForms = loadForm.getElementsByTagName('input')
for(let i of inputForms){
  i.addEventListener('keyup',()=>{
    validator()
  })
}



// Addresses Section


// Address Col
let deleteLaneBtn = document.querySelector('.deleteLane')
let optionBtn = document.getElementById('optionBtn')


deleteLaneBtn.addEventListener('click',()=>{
  deleteLane(deleteLaneBtn)
})
optionBtn.addEventListener('click',()=>{
  let tableBody = document.querySelector('tbody')
  createNewLane(tableBody)
  updateNames()
})


function deleteLane(el){
  el.parentElement.parentElement.remove()
  updateNames()
}

function createNewLane(parentEl){
  let tableBody = parentEl
  let tableRow  = document.createElement('tr')
  // Type Col
  let typeCol = document.createElement('td')
  typeCol.classList.add('fw-bold','type')
  typeCol.innerText = "Load"
  // Quantity Col
  quantityCol = document.createElement('td')
  quantityCol.classList.add('quantity')
  quantityCol.innerText = '1'
  // Description Col
  descriptionCol = document.createElement('td')
  descriptionCol.classList.add('description')
  descriptionRow = document.createElement('div')
  descriptionRow.classList.add('row')


  // Pickup
  pickupRow = document.createElement('div')
  pickupRow.classList.add('col-12','col-md-6')
  pickupInputGroup = document.createElement('div')
  pickupInputGroup.classList.add('input-group')
  pickupLabel = document.createElement('span')
  pickupLabel.classList.add('input-group-text')
  pickupLabel.innerText = 'Pickup'
  // Pickup-City
  pickupCityInput = document.createElement('input')
  pickupCityInput.setAttribute('type', 'text')
  pickupCityInput.setAttribute('aria-label', 'Pickup-city')
  pickupCityInput.classList.add('form-control')
  pickupCityInput.setAttribute('placeholder','City')

// ! Dev Only -value
    pickupCityInput.value = 'Jacksonville'

  // Pickup-State
  pickupStateInput = document.createElement('input')
  pickupStateInput.setAttribute('type', 'text')
  pickupStateInput.setAttribute('aria-label', 'Pickup-state')
  pickupStateInput.classList.add('form-control')
  pickupStateInput.setAttribute('placeholder','State')


  //! Dev Only - Value
  pickupStateInput.value = 'FL'
  
  pickupInputGroup.appendChild(pickupLabel)
  pickupInputGroup.appendChild(pickupCityInput)
  pickupInputGroup.appendChild(pickupStateInput)
  pickupRow.appendChild(pickupInputGroup)
  descriptionRow.appendChild(pickupRow)

  // Delviery
  deliveryRow = document.createElement('div')
  deliveryRow.classList.add('col-12','col-md-6')
  deliveryInputGroup = document.createElement('div')
  deliveryInputGroup.classList.add('input-group')
  deliveryLabel = document.createElement('span')
  deliveryLabel.classList.add('input-group-text')
  deliveryLabel.innerText = 'Delivery'
  // Deliovery-City
  delvieryCityInput = document.createElement('input')
  delvieryCityInput.setAttribute('type', 'text')
  delvieryCityInput.setAttribute('aria-label', 'Delivery-city')
  delvieryCityInput.classList.add('form-control')
  delvieryCityInput.setAttribute('placeholder','City')

  // ! Dev Only  - Value
  delvieryCityInput.value = 'Orlando'

  // Deliery-State
  delvieryStateInput = document.createElement('input')
  delvieryStateInput.setAttribute('type', 'text')
  delvieryStateInput.setAttribute('aria-label', 'Delivery-state')
  delvieryStateInput.classList.add('form-control')
  delvieryStateInput.setAttribute('placeholder','State')

  // ! Dev Only
  delvieryStateInput.value = 'FL'
  
  deliveryInputGroup.appendChild(deliveryLabel)
  deliveryInputGroup.appendChild(delvieryCityInput)
  deliveryInputGroup.appendChild(delvieryStateInput)
  deliveryRow.appendChild(deliveryInputGroup)
  descriptionRow.appendChild(deliveryRow)


  // Delete Icon
  let deleteCol = document.createElement('td')
  deleteCol.classList.add('action')
  deleteCol.classList.add('align-middle')
  let deleteIcon = document.createElement('i')
  deleteIcon.classList.add('fas','fa-trash-alt','text-danger','deletLane')
  deleteIcon.addEventListener('click',()=>{
    deleteLane(deleteIcon)
  })
  deleteCol.appendChild(deleteIcon)
  descriptionCol.appendChild(descriptionRow)

  tableRow.appendChild(typeCol)
  tableRow.appendChild(quantityCol)
  tableRow.appendChild(descriptionCol)
  tableRow.appendChild(deleteCol)
  tableBody.appendChild(tableRow)

}


function updateNames(){
  let tbody = document.querySelector('tbody')
  tr = tbody.querySelectorAll('tr')
  for(let i=0;i<tr.length;i++){
    descriptionRow = tr[i].querySelector('.description')
    rows = tr[i].querySelectorAll('.input-group')
    pickupinputs = rows[0].querySelectorAll('input')
    pickupinputs[0].setAttribute('name',`load[stop][${i}][pickup][city]`)
    pickupinputs[1].setAttribute('name',`load[stop][${i}][pickup][state]`)
    deliveryInputs = rows[1].querySelectorAll('input')
    deliveryInputs[0].setAttribute('name',`load[stop][${i}][delivery][city]`)
    deliveryInputs[1].setAttribute('name',`load[stop][${i}][delivery][state]`)


    console.log(i,': Description Rows: ', descriptionRow)


  }
}


