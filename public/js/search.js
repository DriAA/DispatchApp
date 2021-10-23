let searchItem = document.getElementById('loadSearch')
let searchSelect = searchItem.getElementsByClassName('form-select')[0]
let searchInput = document.getElementById('searchInput')


searchSelect.addEventListener('change',()=>{
    searchInput.value = ''
})



searchInput.addEventListener('keyup',()=>{
    let cardItems = document.getElementsByClassName('loadItem');
    let criteria = searchSelect[searchSelect.selectedIndex].value;
    let filter = document.getElementsByClassName(criteria)
    for(let card of cardItems){
        filtered = card.getElementsByClassName(criteria)[0]
        filtered.innerText.toLowerCase().includes(searchInput.value.toLowerCase())? card.classList.remove('d-none'): card.classList.add('d-none')
    }
})



