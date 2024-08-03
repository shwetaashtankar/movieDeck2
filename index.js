let page = 1;
let data1 = [];
let displayScreen = document.querySelector("#movieList");

async function fetchData() {
  let res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`
  );
  let data = await res.json();
  data1 = data.results;
  //   console.log(data1);
  DisplayData(data1);
}
fetchData();

// display data

function DisplayData(data1) {
  displayScreen.innerHTML = "";
  data1.map((e) => {
    const posterImage = e.poster_path
      ? `https://image.tmdb.org/t/p/original/${e.poster_path}`
      : "https://via.placeholder.com/150";
    const card = `
        <div class="card"> 
            <div class='images'>
            <img height='100px' width='100px' src="${posterImage}" alt="${e.title}">
            </div>
            <h1>${e.original_title}</h1>
            <h2>${e.release_date}</h2>
            <h2>Rating⭐: ${e.vote_average}</h2>
            <button onclick="save('${posterImage}', '${e.title}', '${e.release_date}', '${e.vote_average}')">Save</button>
        </div>
        `;
    displayScreen.innerHTML += card;
  });
}

// save

function save(image, title, date, rating) {
  let movie = {
    Image: image,
    Title: title,
    Date: date,
    Rating: rating,
  };
  let getData = JSON.parse(localStorage.getItem("movieData")) || [];
  getData.push(movie);
  localStorage.setItem("movieData", JSON.stringify(getData));
  console.log(getData);
}

// favBtn display save items

function favBtn() {
  displayScreen.innerHTML = "";
  let getMovie = JSON.parse(localStorage.getItem("movieData")) || [];
  getMovie.map((e) => {
      // console.log(e)
    const image = e.Image
      ? `https://image.tmdb.org/t/p/original/${e.Image}`
      : "https://via.placeholder.com/150";
    const card = `
      <div class="card">
          <div class='images'>
          <img height='100px' width='100px' src="${image}" alt="${e.Title}">
          </div>
          <h1>${e.Title}</h1>
          <h2>${e.Date}</h2>
          <h2>Rating⭐: ${e.Rating}</h2>
          <button class='deletBtn' onclick="deleteBtn('${e.Title}')">Delete</button>
      </div>
      `;
    displayScreen.innerHTML += card;
  });
}

function deleteBtn(title) {
  let movies = JSON.parse(localStorage.getItem("movieData")) || [];
  let updatedMovies = movies.filter((movie) => movie.Title !== title);
  localStorage.setItem("movieData", JSON.stringify(updatedMovies));
  favBtn();
}

//search by title
let searchByTitle = document.querySelector(".input");
function searchBtn() {
  if (searchByTitle === "") {
    alert("Please enter a name");
  } else {
    let searchValue = searchByTitle.value.toLowerCase();
    console.log(searchValue);
    let searchResult = data1.filter((val) => {
      return val.title.toLowerCase().includes(searchValue);
    });
    console.log(searchResult);
    DisplayData(searchResult);
    document.querySelector(".input").value = "";
  }
}

// sorting by date oldest to new

function sortBydate() {
  let sortedDate = data1.sort(
    (a, b) => new Date(a.release_date) - new Date(b.release_date)
  );
  DisplayData(sortedDate);
}

// sorting by rating least to most
function sortByrating() {
  let sortedRating = data1.sort((a, b) => a.vote_average - b.vote_average);
  DisplayData(sortedRating);
}

// all
function allBtn() {
  fetchData();
}

// pagination
let next = document.querySelector(".nextPage");
let prev = document.querySelector(".previousPage");
let currentPage = document.querySelector("#currentPage");

//next page
function nextPage() {
  page += 1;
  fetchData();
  currentPage.innerHTML = `Current Page: ${page}`;
  if (page === 3) {
    next.disabled = true;
  } else {
    prev.disabled = false;
  }
}

// Previous page
function previousPage() {
  if (page > 1) {
    page -= 1;
    fetchData();
    currentPage.innerHTML = `Current Page: ${page}`;
    next.disabled = false;
  }
  if (page === 1) {
    prev.disabled = true;
  }
}
