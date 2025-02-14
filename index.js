import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import firebaseConfig from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Use credentials from config.js
signInWithEmailAndPassword(auth, firebaseConfig.userEmail, firebaseConfig.userPassword)
    .then((userCredential) => {
        console.log("Signed in successfully");
    })
    .catch((error) => {
        console.log("Error signing in:", error);
    });

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    if (inputValue.trim() !== "") {
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
    }
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArr = Object.entries(snapshot.val());
        clearShoppingListEl();

        for (let i = 0; i < itemsArr.length; i++) {
            appendItemToShoppingListEl(itemsArr[i]);
        }
    } else {
        shoppingListEl.innerHTML = "No items in the list";
    }
});

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemId = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");
    newEl.textContent = itemValue;

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);
        remove(exactLocationOfItemInDB);
    });

    shoppingListEl.append(newEl);
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}
