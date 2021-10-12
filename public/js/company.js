let loadSearch = document.getElementById('loadSearch')
let loadItems = document.getElementsByClassName('loadItem')
let searchInput = document.getElementById('searchInput')
let searchRemove = document.getElementById('searchRemove')



searchInput.addEventListener('keydown',()=>{
    for(item of loadItems){
       item.classList.add('d-none')
    }
})

searchRemove.addEventListener('click',()=>{
    for(item of loadItems){
        item.classList.remove('d-none')
     }
})