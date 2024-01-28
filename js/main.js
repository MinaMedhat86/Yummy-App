'use strict'
let search = document.getElementById("SearchItem")
let rowData = document.getElementById("rowData")
let submitBtn

$(document).ready(() => {
    $(".loading-screen").fadeOut(500)
    $("body").css("overflow", "visible")
})
function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0

    }, 500)
    $(".open-close").removeClass("fa-align-justify")
    $(".open-close").addClass("fa-x")

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let navWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -navWidth

    }, 500)
    $(".open-close").removeClass("fa-x")
    $(".open-close").addClass("fa-align-justify")

    $(".links li").animate({
        top: 300
    }, 500)
}
closeSideNav()
$(".side-nav-menu i.open-close").click(() => {
    if ($(".side-nav-menu").css("left") == "0px")
        closeSideNav()
    else
        openSideNav()
})

// display Meals 
function displayMeals(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}

// get categories
async function getCategories() {
    rowData.innerHTML=""
    $('.inner-loading').fadeIn(400)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let getResponse = await response.json()
    
    displayCategories(getResponse.categories)
    $(".inner-loading").fadeOut(400)
}
function displayCategories(arr) {
    let box = ""
    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
        <div onclick="getCategoryMeal('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    </div>`
    }
    rowData.innerHTML = box
}
// get area

async function getArea() {
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    search.innerHTML=""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let getResponse = await response.json()
    
    displayArea(getResponse.meals)
    $(".inner-loading").fadeOut(400)
}
function displayArea(arr) {
    let box = ''
    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
            <div onclick="getAreaMeal('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-3x"></i>
                <h3>${arr[i].strArea}</h3>
            </div>
        </div>
        `
    }
    rowData.innerHTML = box
}
//get ingredients

async function getIngredients() {
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    search.innerHTML=""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let getResponse = await response.json()

    displayIngredients(getResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)
}
function displayIngredients(arr) {
    let box = ''

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
            <div onclick="getIngMeal('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-3x"></i>
                <h3>${arr[i].strIngredient}</h3>
                <p>${arr[i].strDescription ? arr[i].strDescription.split(" ").slice(0, 20).join(' ') : "no desc"}</p>
            </div>
        </div>
        `
    }
    rowData.innerHTML = box
}

// get Meals
async function getCategoryMeal(Cat) {
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Cat}`)
    let getResponse = await response.json()
    
    displayMeals(getResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)
}
async function getAreaMeal(area) {
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let getResponse = await response.json()
    displayMeals(getResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}
async function getIngMeal(ing) {
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`)
    let getResponse = await response.json()
    displayMeals(getResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(400)

}
// get details by id
async function getMealDetails(id) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(400)

    search.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let getResponse = await response.json();

    displayMealDetails(getResponse.meals[0])
    $(".inner-loading").fadeOut(400)

}
//  ingredients Details
function displayMealDetails(meal) {
    
    search.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")

    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let box = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = box
}

// search section
function ShowSearch() {
    search.innerHTML = `
    <div class="row py-4">
    <div class="col-md-6">
    <input class="form-control bg-transparent text-white" type="text"
    placeholder="Search By Name" onkeyup="searchByName(this.value)">
    </div>
    <div class="col-md-6">
    <input class="form-control bg-transparent text-white" type="text"
    placeholder="Search By First letter" onkeyup="searchByFirstLetter(this.value)" maxlength="1">
    </div>
    </div>
    `
    rowData.innerHTML = ""
}
async function searchByName(text) {
    closeSideNav()
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`)
    let getResponse = await response.json()
    console.log(getResponse.meals)
    getResponse.meals ? displayMeals(getResponse.meals) : displayMeal([])
    $(".inner-loading").fadeOut(400)
}
async function searchByFirstLetter(text) {
    closeSideNav()
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)

    text == "" ? text = "a" : ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${text}`)
    let getResponse = await response.json()
    getResponse.meals ? displayMeals
    (getResponse.meals) : displayMeal([])
    $(".inner-loading").fadeOut(400)
}
// start website
async function getMeal() {
    closeSideNav()
    rowData.innerHTML=""
    $(".inner-loading").fadeIn(400)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s`)
    let getResponse = await response.json()
    console.log(getResponse.meals)
    getResponse.meals ? displayMeals(getResponse.meals) : displayMeal([])
    $(".inner-loading").fadeOut(400)
}
getMeal()
//*****  contact section*******///

function showContact() {
    rowData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input type="text" onkeyup="inputValidation()" class="form-control" id="nameInput" placeholder="Enter Your Name">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertName">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="email" class="form-control" onkeyup="inputValidation()" id="emailInput" placeholder="Enter Your Email">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertEmail">
                            Email not valid example@gmail.com
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" onkeyup="inputValidation()" class="form-control" id="phoneInput" 
                        placeholder="Enter Your phone Number">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertPhone">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" onkeyup="inputValidation()" class="form-control" id="ageInput" placeholder="Enter Your Age">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertAge">
                            Enter valid Age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" onkeyup="inputValidation()" class="form-control" id="passInput" placeholder="Enter Your Password">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertPassword">
                            Enter valid password: Minimum eight characters, at least one letter and one number.
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="password" onkeyup="inputValidation()" class="form-control" id="repassInput" placeholder=" Enter Your RepassWord">
                        <div class="alert alert-danger w-100 mt-2 d-none" id="alertRepass">
                            Enter valid match RepassWord
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>`
    submitBtn = document.getElementById("submitBtn")

    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputFocus = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputFocus = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputFocus = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputFocus = true
    })

    document.getElementById("passInput").addEventListener("focus", () => {
        passInputFocus = true
    })

    document.getElementById("repassInput").addEventListener("focus", () => {
        repassInputFocus = true
    })
}
let nameInputFocus = false
let emailInputFocus = false
let phoneInputFocus = false
let ageInputFocus = false
let passInputFocus = false
let repassInputFocus = false

function inputValidation() {
    if (nameInputFocus) {
        if (nameValidation()) {
            document.getElementById("alertName").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertName").classList.replace("d-none", "d-block")
        }
    }
    if (emailInputFocus) {
        if (emailValidation()) {
            document.getElementById("alertEmail").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertEmail").classList.replace("d-none", "d-block")
        }
    }
    if (phoneInputFocus) {
        if (phoneValidation()) {
            document.getElementById("alertPhone").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertPhone").classList.replace("d-none", "d-block")
        }
    }
    if (ageInputFocus) {
        if (ageValidation()) {
            document.getElementById("alertAge").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertAge").classList.replace("d-none", "d-block")
        }
    }
    if (passInputFocus) {
        if (passwordValidation()) {
            document.getElementById("alertPassword").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertPassword").classList.replace("d-none", "d-block")
        }
    }
    if (repassInputFocus) {
        if (repassWordValidation()) {
            document.getElementById("alertRepass").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("alertRepass").classList.replace("d-none", "d-block")
        }
    }

    
    // show submit btn
    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repassWordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}
//Start Of Validation ------------------------------------------------- 

// name validation
function nameValidation() {
    return (/^[a-zA-Z]+$/.test(document.getElementById("nameInput").value))
}
// email validation
function emailValidation() {
    return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(document.getElementById("emailInput").value))
}
// phone validation
function phoneValidation() {
    return (/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(document.getElementById("phoneInput").value))
}
// age validation
function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9]|300)$/.test(document.getElementById("ageInput").value))
}
// password validation
function passwordValidation() {
    return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(document.getElementById("passInput").value))
}
// repassword validation
function repassWordValidation() {
    return document.getElementById("repassInput").value == document.getElementById("passInput").value
}


// End Of Validation ----------------------------------------