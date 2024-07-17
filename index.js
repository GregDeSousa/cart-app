import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue,remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-8354a-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
let   ImageIcon = document.getElementById("icon")
const EmptyBasketPrompts = ["Nothing to see here... yet👀","Looks like your cart is on a diet🤔"]

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()

})

onValue(shoppingListInDB, function(snapshot) {
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        
        ClearCart()
        fullCartImage()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            
            appendItemToShoppingListEl(currentItem)
        }
    }else{
        console.log("pain")
        emptyCatyImage()
        EmptyCart()
    }
})

function ClearCart(){
    shoppingListEl.innerHTML = ""
}
function EmptyCart(){
    let randomPromptIndex = Math.floor(Math.random()*EmptyBasketPrompts.length)
    shoppingListEl.innerHTML = EmptyBasketPrompts[randomPromptIndex]
}


function emptyCatyImage(){
    ImageIcon.src = "assets/shopping_basket.png"
}

function fullCartImage(){
    ImageIcon.src = "assets/shopping_basket_full.png"
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEntry = document.createElement("li")

    newEntry.textContent = itemValue

    newEntry.addEventListener("click",function(){
        let ReferenceForElement = ref(database,`shoppingList/${itemID}`)

        remove(ReferenceForElement)
    })

    shoppingListEl.append(newEntry)
}