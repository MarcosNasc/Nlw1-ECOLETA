function populatrUfs(){
    const ufSelect = document.querySelector("select[name=uf]");

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json())
    .then(states => {
        for(let state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome} </option>`;
        }
    })
}

populatrUfs();


function getCities(event){
    const citySelect = document.querySelector("[name=city]");
    const stateInput = document.querySelector("[name=state]");

    const ufValue  = event.target.value;

    const indexOfSelectedState = event.target.selectedIndex;

    stateInput.value = event.target.options[indexOfSelectedState].text;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

    citySelect.innerHTML = "<option value> Selecione a Cidade </option>";
    citySelect.disabled = true;

    fetch(url)
    .then(res => res.json())
    .then(cities => {
        
        for(let city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome} </option>`;
        }
        citySelect.disabled = false;
    })

}



document
.querySelector("select[name=uf]")
.addEventListener("change" , getCities);

// Itens de coleta 
// pegar todos os Li's

const itemsToCollect = document.querySelectorAll(".items-grid li");

for(let item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const collectedIems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target;

    // Adcionar ou remover uma classe com JS
    itemLi.classList.toggle("selected");


    const itemId  = itemLi.dataset.id;
    console.log("ITEM-ID:",itemId);

    //verificar se existe itens selecionados  
    //Se sim pegar os itens seleionados 
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId;
        return itemFound;
    });

    //Se já estiver selecionado , tirar da selecao
    if (alreadySelected >= 0) {
        //tirar da selecao
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId;
            return itemIsDifferent ;
        });

        selectedItems = filteredItems;
        
    }else{
        //Se não estiver selecionado, adcionar a seleçao
        selectedItems.push(itemId);
    }
    
    console.log("SELECTED ITEMS:",selectedItems);

    //Atualizar o campo escondido com os itens selecionados 
    collectedIems.value = selectedItems;

}