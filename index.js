let burger_icon = document.querySelector("header div.burger_icon");
let nav = document.querySelector("header nav");
let toggle_nav = () =>{
    nav.classList.toggle('opened');
}
burger_icon.addEventListener('click', () =>toggle_nav());


// search btn, lable
let search_btn = document.getElementById('search_btn');
let main_input = document.getElementById('main_input');
let main_lable = document.getElementById('main_lable');
search_btn.addEventListener('click', () => check_input());
let check_input = () => {
    if (
      main_input.value == "" ||
      main_input.value == " " ||
      main_input.value == " "
    ) {
      main_lable.classList.add("shown");
    } else {
      shortenLink();
    }
}
let close_nav = () => {
    nav.classList.remove("opened");
}
document.querySelector('section.top').addEventListener('click',()=>close_nav());

// not important, but cool
window.onresize = () => close_nav();

main_input.addEventListener('input', () => {
    main_input.value.length > 3
        ? main_lable.classList.remove('shown') :'';
});
// API
let results_section = document.querySelector('#results');
let API_source = "https://api.shrtco.de/v2/shorten?url=";
let counter = 0;

let arr_short = [];
const shortenLink = async () => {
    try {

        let normal_url = main_input.value;
        let result = await fetch(`${API_source}${normal_url}`);
        let data = await result.json();
        let url_state = data.ok; // if url is valid it will be true
        url_state == true
        ? run_short(data)
        : run_wrongUrl();
    } catch(e) {
        console.log(`error accured: reason:
        ${e}
        `);
    }
}
// copy short url to device clipboard
let copy_url = (url) => {
    let ready_url = url.previousElementSibling.getAttribute('href');
    url.textContent = 'copied!';
    url.classList.add('copied');
    navigator.clipboard.writeText(ready_url);
}

// the main function to generate a url
let run_short = (data) => {
    console.log(data)
    sessionStorage.setItem('All_data_stored',JSON.stringify(data));
    let shortUrl = data.result.full_short_link;
    let result = `<div class="res_${counter}">
      <p class="url">${data.result.original_link}</p>
      <a href="${shortUrl}">${shortUrl}</a>
      <button class="btn" onclick="copy_url(this)" >Copy</button>
    </div>`;
    counter++;
    let results_divs = document.querySelectorAll(".results .result");
    arr_short.unshift(result);
    let new_div = document.createElement('div');
    results_section.innerHTML = '';
    new_div.className = 'result';
    // new_div.classList.add(`res_11`);
    for (let i = 0; i < arr_short.length; i++) {
        let clone = new_div.cloneNode(false);
        results_section.appendChild(clone);
        results_divs = document.querySelectorAll(".results .result");
        results_divs[i].innerHTML = arr_short[i];
    }
    results_divs[0].classList.add('animated');
}
let run_wrongUrl = () => {
    main_lable.textContent = 'Please add a VALID URL';
    main_lable.classList.add('shown');
}
// we will store only the last shorted url
let data_stored = sessionStorage.getItem("All_data_stored");
if (data_stored) {
  console.log("data found in local storage");
    data_stored = JSON.parse(data_stored);
    // console.log(data_stored)
    run_short(data_stored);
}

