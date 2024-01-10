/** @format */

// our tmdb api key
const Api_Key = "cd091f14bd53b1bad20889ad20e4b6ea";
let now_playing_arr;
let related_movies_arr;
let new_image_path = "";
let top_rated_arr = [];
let popular_arr = [];
let trending_arr = [];
let all_array_items = [];
let cast_array = [];
let crew_array = [];

// now playing api
const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`;

// getting all movie image path from the tmdb api
const movie_image_base_url = "http://image.tmdb.org/t/p/w500/";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDA5MWYxNGJkNTNiMWJhZDIwODg5YWQyMGU0YjZlYSIsInN1YiI6IjY1OGM4ZDkwMjIxYmE2MDE1OWRiNGMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkYwzUX100__25r_Qb92H72_5E0NyxbhvJsVec2_TV0",
  },
};

fetch(url, options)
  .then((response) => response.json())
  .then((response) => {
    // abover we created an array called now_playing_arr and then passed the results gotten from the tmdb api
    now_playing_arr = response.results;
    // we created a random data by using the Math object and the random method and also we round the figure to a whole number to achieve our result.
    const random_movie = Math.floor(Math.random() * now_playing_arr.length);
    // after creating the random data which we passed it into the random_movie variable, the now_playing_arr new need to collect the new result. which means only one random data is gotten fro the now_playing_arr
    const new_movie = now_playing_arr[random_movie];
    // we also want to check for the length of the movie title so if it length is greater than 25 we wanna trim it and also check if the movie have a title if not we pass our default title to it.
    let title = new_movie.title;
    if (title.length >= 25) {
      const trimmedOverview = title.slice(0, 25) + "...";
      title = trimmedOverview;
    } else if (title.trim() === "") {
      title = "Movie title unavailable";
    }
    // passing the title to the html element
    document.querySelector(".detail-wrapper hgroup .banner-title").textContent =
      new_movie.title;
    // check the length of the overview and also check if the overview is empty
    /*
      some of the movie overviews are empty so instead of leaving it empty we input our own default text
    */
    let overview = new_movie.overview;
    if (overview.length >= 110) {
      const trimmedOverview = overview.slice(0, 110) + "...";
      overview = trimmedOverview;
    } else if (overview.trim() === "") {
      overview =
        "Movie summary for this isn't available at the moment or simply check out their official website";
    }
    /*
      setting for the banner using the random dta gotten form the tmdb
    */
    document.querySelector(".detail-wrapper .overview").textContent = overview;
    // end - overview
    const image_path = movie_image_base_url + new_movie.backdrop_path;
    document
      .querySelector(":root")
      .style.setProperty("--url-banner", `url(${image_path})`);
    const movie_banner = document.querySelector(".movie-banner");
    const createId = document.createAttribute("data-id");
    const genreId = document.createAttribute("data-genreId");
    createId.value = new_movie.id;
    genreId.value = new_movie.genre_ids;
    movie_banner.setAttributeNode(createId);
    movie_banner.setAttributeNode(genreId);

    // ntofication
    /*
      since we already created the random data from the tmdb api and we also used it above for the banner then we also use it for the notification so that whatsoever result we are getting from the random array we also use it for both the banner and notification
    */
    const html = `<div class="card" data-id="${new_movie.id}">
                <img src="${image_path}" alt="" />
                <div class="summary">
                  <h2 class="title">${new_movie.title}</h2>
                  <p>
                    ${overview}
                  </p>
                  <span>${new_movie.release_date}</span>
                </div>
              </div>`;
    document.querySelector(".not-list-wrapper").innerHTML = html;
  })
  .catch((err) => console.error(err));

// the search increase input
/*
  once the search icon is clicked we increase the height of the search input.
*/
const search_icon = document.querySelector(".search-bar span");

search_icon.addEventListener("click", (e) => {
  e.preventDefault();

  const input = document.querySelector("#Open-search");

  input.classList.toggle("active");
  if ((screen.width = "500px")) {
    input.classList.toggle("active_770px");
  } else if ((screen.width = "360px")) {
    input.classList.toggle("active_360px");
  } else {
    console.log("settings for screen width was blocked due to some errors");
  }
});

function getHeight() {
  const not_list = document.querySelector(".not-list");
  // used this to determine the height of the not-list height
  const height = not_list.clientHeight;

  not_list.style.height = 352 + "px";
}

getHeight();

const logo = document.querySelector(".logo");
const logo_copy = document.querySelectorAll(".logo-copy");

// remove the box modal
const overlay = document.querySelector(".overlay");
const remove_overlay = document.querySelector(".box-overlay .fa-xmark");
// remove the overlay if the it has the class of animte__fadeIn
remove_overlay.onclick = () => {
  if (overlay.classList.contains("animate__fadeIn")) {
    overlay.classList.remove("animate__fadeIn");
    overlay.classList.add("animate__fadeOut");
    overlay.style.display = "none";
  }
};

// using the button in the banner to open the overlay and also fetch the data and also the related movies in it as well
const now_playing = document.querySelector(".details button");
now_playing.addEventListener("click", (e) => {
  e.preventDefault();
  // make overlay show so that we can see our results
  if (overlay.classList.contains("animate__fadeOut")) {
    overlay.classList.remove("animate__fadeOut");
    overlay.classList.add("animate__fadeIn");
    overlay.style.display = "block";
  }

  // let fetch the movie-banner info and dsiplay it in the modal

  // get the movie-banner id
  const parent_id =
    e.target.parentElement.parentElement.parentElement.dataset.id;
  // get the genreId
  const Parent_genreId =
    e.target.parentElement.parentElement.parentElement.getAttribute(
      "data-genreId"
    );

  // place the movie banner id in the url as well as ur api key
  const banner_url_info = `https://api.themoviedb.org/3/movie/
${parent_id}?api_key=${Api_Key}&language=en-US&append_to_response=credits`;
  // now we fetch
  fetch(banner_url_info)
    .then((res) => res.json())
    .then((data) => {
      // setting the image path and replacing the root(css)
      const image_path = movie_image_base_url + data.poster_path;
      document
        .querySelector(":root")
        .style.setProperty("--url-box-modal", `url(${image_path})`);
      // end
      // check the length of the overview
      let overview = data.overview;
      if (overview.length >= 150) {
        const trimmedOverview = overview.slice(0, 150) + "...";
        overview = trimmedOverview;
      }
      // end
      // converting the runtime for the video
      const totalMinutes = data.runtime;

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(totalMinutes / 60) + "hr";
      const minutes = totalMinutes % 60;
      const seconds = minutes / 60;
      const correctedSeconds = Math.floor(seconds % 60);

      const time_in_text = `${hours} ${minutes + "mins"} ${
        correctedSeconds + "sec"
      }`;
      // get our html structure for the overlay
      const html = `<div class="card-overlay" data-id="${data.id}">
            <div class="backdrop-image-modal">


              <div class="detail">
                <hgroup>
                  <h1 class="logo-copy"></h1>
                  <h1>${data.title}</h1>
                </hgroup>
              </div>
            </div>
            <div class="cast">
              <div class="separate-cast">
                <div class="year-time">
                  <span class="year">${data.release_date}</span>
                  <span class="time">${time_in_text}</span>
                </div>
                <p class="overview-text">
                  ${overview}
                </p>
                <button class="banner-info" style="padding:13px 16px; background:#fff;font-family:sans-serif;font-size:1em; margin-top:10px;border-radius:6px;border:none;cursor:pointer;" type="button">more info</button>
              </div>
            </div>
          </div>`;
      document.querySelector(".card-holder").innerHTML = html;
    })
    .catch((err) => console.log(err));

  // fetch the for more like this using tmdb api endpoint and also we pass the genreId we got from the card.
  /*
  so actually what we did here is that we are getting the related movies of the available movie in the banner using the genreId
  */
  const get_related_movies = `https://api.themoviedb.org/3/discover/movie?api_key=${Api_Key}&language=en-US&sort_by=release_date.desc&page=1&with_genres=${Parent_genreId}`;

  fetch(get_related_movies)
    .then((res) => res.json())
    .then((data) => {
      // we created an array called the related_movies_arr ad pass in the result
      related_movies_arr = data.results;
      // now we would create a function called relatedMovies and pass in the related_movies_arr as an argument.
      relatedMovies(related_movies_arr);
    })
    .catch((err) => console.log(err));
});

// make the header fixed
window.addEventListener("scroll", (e) => {
  const header = document.querySelector("header");
  header.classList.toggle("fixed-header", scrollY > -0);
});

// using the top-rated api from tmdb
const top_rated = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDA5MWYxNGJkNTNiMWJhZDIwODg5YWQyMGU0YjZlYSIsInN1YiI6IjY1OGM4ZDkwMjIxYmE2MDE1OWRiNGMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkYwzUX100__25r_Qb92H72_5E0NyxbhvJsVec2_TV0",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      // we created an array called the top_rated_arr ad pass in the result
      top_rated_arr = response.results;
      // now we would create a function called TopRated and pass in the top_rated_arr as an argument.
      TopRated(top_rated_arr);
    })
    .catch((err) => console.error(err));
};

function TopRated(Prop) {
  // we want to create a number because remember we are getting our top 20 movies in tmdb api.
  /*
  now what we are doing here is we created an array of numbers from 1-20 base on the desire result which is our top 20 best movies
  */
  let arr_of_numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  // now remeber we passed in the top_rated_arr as an argument in the top_rated function and now we wanna map using the fop of map. map returns a new array unlike forEach.
  const top_rated = Prop.map((item, index) => {
    // in here we are setting up the image path using the tmdb api movie path which we passed to the variable of movie_image_base_url then we add it to our desire movie image name
    const image_path = movie_image_base_url;
    // in here we use the position of the data in the array, which we know that array are zero base but in here we use their index which is also their position to loop through the arr_of_numbers to get their individual rating.
    let number_of_rated = arr_of_numbers[index];
    // we return the result in our html  structure
    return `<div class="top-rated_cover" data-id="${item.id}" data-genreId="${
      item.genre_ids
    }">
          <div class="top-rated_box">
            <h1 class="number">${number_of_rated}</h1>
            <img src="${image_path + item.backdrop_path}" alt="" />
          </div>
          <div class="modal-box" data-id="${item.id}" data-genreId="${
      item.genre_ids
    }">
            <div class="modal-image">
              <img src="${image_path + item.backdrop_path}" alt="" />
            </div>
            <div class="more-info">
              <span class="date">${item.release_date}</span>
              <span class="info" title="more info"
                ><i class="fa-solid fa-circle-chevron-down"></i
              ></span>
            </div>
          </div>
        </div>`;
  }).join("");
  document.querySelector(".rated-wrapper").innerHTML = top_rated;
}

top_rated();

// popular
const Popular_ = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDA5MWYxNGJkNTNiMWJhZDIwODg5YWQyMGU0YjZlYSIsInN1YiI6IjY1OGM4ZDkwMjIxYmE2MDE1OWRiNGMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkYwzUX100__25r_Qb92H72_5E0NyxbhvJsVec2_TV0",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      popular_arr = response.results;
      Popular(popular_arr);
    })
    .catch((err) => console.error(err));
};

function Popular(Prop) {
  const popular = Prop.map((item) => {
    const image_path = movie_image_base_url;
    return `<div class="popular-cover" data-id="${item.id}" data-genreId="${
      item.genre_ids
    }">
          <div class="popular_box">
            <img src="${image_path + item.backdrop_path}" alt="" />
          </div>
          <div class="modal-box"  data-id="${item.id}" data-genreId="${
      item.genre_ids
    }">
            <div class="modal-image">
              <img src="${image_path + item.poster_path}" alt="" />
            </div>
            <div class="more-info">
              <span class="date">${item.release_date}</span>
              <span class="info" title="more info"
                ><i class="fa-solid fa-circle-chevron-down"></i
              ></span>
            </div>
          </div>
        </div>`;
  }).join("");
  document.querySelector(".popular-wrapper").innerHTML = popular;
}

Popular_();

function GetRelatedPouplarMovie() {
  // get the related movies for popular mvies

  const popular_wrapper = document.querySelector(".popular-wrapper");
  const items_in_popular_wrapper =
    popular_wrapper.querySelectorAll(".modal-box");
  items_in_popular_wrapper.forEach((item) => {
    // click function for the overlay-detail box
    item.addEventListener("click", (e) => {
      e.preventDefault();

      if (overlay.classList.contains("animate__fadeOut")) {
        overlay.classList.remove("animate__fadeOut");
        overlay.classList.add("animate__fadeIn");
        overlay.style.display = "block";
      }

      // get the id and genreId
      const Parent_id = e.target.parentElement.parentElement.dataset.id;
      console.log(Parent_id);
      // get the genreId
      const genre_id =
        e.target.parentElement.parentElement.getAttribute("data-genreId");
      console.log(genre_id);

      // Now using the tmdb api to get the specific details for the movie
      const url = `https://api.themoviedb.org/3/movie/
    ${Parent_id}?api_key=${Api_Key}&language=en-US&append_to_response=credits`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          // setting the image path and replacing the root(css)
          const image_path = movie_image_base_url + data.poster_path;
          document
            .querySelector(":root")
            .style.setProperty("--url-box-modal", `url(${image_path})`);
          // end
          // check the length of the overview
          let overview = data.overview;
          if (overview.length >= 150) {
            const trimmedOverview = overview.slice(0, 150) + "...";
            overview = trimmedOverview;
          }
          // end
          // converting the runtime for the video
          const totalMinutes = data.runtime;

          // Calculate hours, minutes, and seconds
          const hours = Math.floor(totalMinutes / 60) + "hr";
          const minutes = totalMinutes % 60;
          const seconds = minutes / 60;
          const correctedSeconds = Math.floor(seconds % 60);

          const time_in_text = `${hours} ${minutes + "mins"} ${
            correctedSeconds + "sec"
          }`;

          const html = `<div class="card-overlay" data-id="${data.id}">
            <div class="backdrop-image-modal">


              <div class="detail">
                <hgroup>
                  <h1 class="logo-copy"></h1>
                  <h1>${data.title}</h1>
                </hgroup>
              </div>
            </div>
            <div class="cast">
              <div class="separate-cast">
                <div class="year-time">
                  <span class="year">${data.release_date}</span>
                  <span class="time">${time_in_text}</span>
                </div>
                <p class="overview-text">
                  ${overview}
                </p>
                <button class="banner-info" style="padding:13px 16px; background:#fff;font-family:sans-serif;font-size:1em; margin-top:10px;border-radius:6px;border:none;cursor:pointer;" type="button">more info</button>
              </div>
            </div>
          </div>`;
          document.querySelector(".card-holder").innerHTML = html;
        })
        .catch((err) => console.error(err));

      // fetch the for more like this using tmdb api endpoint
      const get_related_movies = `https://api.themoviedb.org/3/discover/movie?api_key=${Api_Key}&language=en-US&sort_by=release_date.desc&page=1&with_genres=${genre_id}`;

      fetch(get_related_movies)
        .then((res) => res.json())
        .then((data) => {
          related_movies_arr = data.results;
          relatedMovies(related_movies_arr);
        })
        .catch((err) => console.log(err));
    });
  });
}

// setting the hover feature for the images

// open the search area when the search-input is on focus
const open_search = document.querySelector("#Open-search");
const search_area = document.querySelector(".search-bar-for-search");
open_search.onfocus = (e) => {
  e.preventDefault();

  if (search_area.classList.contains("animate__fadeOut")) {
    search_area.classList.remove("animate__fadeOut");
    search_area.classList.add("animate__fadeIn");
    search_area.style.display = "block";
  }
};

function trending() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDA5MWYxNGJkNTNiMWJhZDIwODg5YWQyMGU0YjZlYSIsInN1YiI6IjY1OGM4ZDkwMjIxYmE2MDE1OWRiNGMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkYwzUX100__25r_Qb92H72_5E0NyxbhvJsVec2_TV0",
    },
  };

  fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      trending_arr = response.results;

      TrendingMovies(trending_arr);
    })
    .catch((err) => console.error(err));
}

function TrendingMovies(Prop) {
  const trending = Prop.map((item) => {
    const image_path = movie_image_base_url + item.backdrop_path;
    return `<div class="trending-box" data-id="${item.id}" data-genreId="${item.genre_ids}">
            <img src="${image_path}" alt="" />
            <h3>${item.title}</h3>
          </div>`;
  }).join("");
  document.querySelector(".trending-grid").innerHTML = trending;
}

trending();

// remove the search area
const remove_search_area = document.querySelector(".search-padding .fa-xmark");

remove_search_area.onclick = () => {
  if (search_area.classList.contains("animate__fadeIn")) {
    search_area.classList.remove("animate__fadeIn");
    search_area.classList.add("animate__fadeOut");
    search_area.style.display = "none";
  }
};

// search to get all movies
// tip one
/*
using the spread operator to jojn all the arrays in one single array
then do the search query
*/

function searchItems(query) {
  // Use filter to find items matching the search query
  const searchResults = all_array_items.filter((item) => {
    // Implement the search logic based on item properties
    return item.title.toLowerCase().includes(query.toLowerCase());
  });

  return searchResults;
}

function renderSearchResults(query) {
  const searchResults = searchItems(query);
  const searchResultsContainer = document.querySelector(".search-grid");

  // Clear previous results
  searchResultsContainer.innerHTML = "";

  // Render new results
  searchResults.forEach((result) => {
    const image_path = movie_image_base_url + result.poster_path;
    const html = `<div class="search-item-box" data-id="${result.id}" data-genre="${result.genre_ids}">
            <img src="${image_path}" alt="" />
            <h3>${result.title}</h3>
          </div>`;

    // Append the result to the container
    searchResultsContainer.innerHTML = html;
  });
}

// Event listener for search input
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (event) => {
  event.preventDefault();
  const query = event.target.value;
  renderSearchResults(query);

  searchCast();
});

function getDetailsForSearchResult() {
  const search_box = document.querySelector(".search-item-box");
  search_box.addEventListener("click", (e) => {
    e.preventDefault();

    const movie_detail = document.querySelector(".movie-ful-detail");
    if (movie_detail.classList.contains("animate__fadeOut")) {
      movie_detail.classList.remove("animate__fadeOut");
      movie_detail.classList.add("animate__fadeIn");
      movie_detail.style.display = "block";
      movie_detail.style.zIndex = 1000000;
    }

    const cardId = e.target.parentElement.dataset.id;
    getCardDetails(cardId);
  });
}
setInterval(() => {
  getDetailsForSearchResult();
}, 0);

// now let's check if the items were mapped
window.onload = () => {
  const rated_wrapper = document.querySelector(".rated-wrapper");
  const items_in_rated_wrapper = rated_wrapper.querySelectorAll(".modal-box");
  items_in_rated_wrapper.forEach((item) => {
    // click function for the overlay-detail box
    item.addEventListener("click", (e) => {
      e.preventDefault();

      if (overlay.classList.contains("animate__fadeOut")) {
        overlay.classList.remove("animate__fadeOut");
        overlay.classList.add("animate__fadeIn");
        overlay.style.display = "block";
      }

      // get the id and genreId
      const Parent_id = e.target.parentElement.parentElement.dataset.id;
      // get the genreId
      const genre_id =
        e.target.parentElement.parentElement.getAttribute("data-genreId");

      // Now using the tmdb api to get the specific details for the movie
      const url = `https://api.themoviedb.org/3/movie/
    ${Parent_id}?api_key=${Api_Key}&language=en-US&append_to_response=credits`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          // setting the image path and replacing the root(css)
          const image_path = movie_image_base_url + data.poster_path;
          document
            .querySelector(":root")
            .style.setProperty("--url-box-modal", `url(${image_path})`);
          // end
          // check the length of the overview
          let overview = data.overview;
          if (overview.length >= 150) {
            const trimmedOverview = overview.slice(0, 150) + "...";
            overview = trimmedOverview;
          }
          // end
          // converting the runtime for the video
          const totalMinutes = data.runtime;

          // Calculate hours, minutes, and seconds
          const hours = Math.floor(totalMinutes / 60) + "hr";
          const minutes = totalMinutes % 60;
          const seconds = minutes / 60;
          const correctedSeconds = Math.floor(seconds % 60);

          const time_in_text = `${hours} ${minutes + "mins"} ${
            correctedSeconds + "sec"
          }`;

          const html = `<div class="card-overlay" data-id="${data.id}">
            <div class="backdrop-image-modal">


              <div class="detail">
                <hgroup>
                  <h1 class="logo-copy"></h1>
                  <h1>${data.title}</h1>
                </hgroup>
              </div>
            </div>
            <div class="cast">
              <div class="separate-cast">
                <div class="year-time">
                  <span class="year">${data.release_date}</span>
                  <span class="time">${time_in_text}</span>
                </div>
                <p class="overview-text">
                  ${overview}
                </p>
                  <button class="banner-info" style="padding:13px 16px; background:#fff;font-family:sans-serif;font-size:1em; margin-top:10px;border-radius:6px;border:none;cursor:pointer;" type="button">more info</button>
              </div>
            </div>
          </div>`;
          document.querySelector(".card-holder").innerHTML = html;
        })
        .catch((err) => console.error(err));

      // fetch the for more like this using tmdb api endpoint
      const get_related_movies = `https://api.themoviedb.org/3/discover/movie?api_key=${Api_Key}&language=en-US&sort_by=release_date.desc&page=1&with_genres=${genre_id}`;

      fetch(get_related_movies)
        .then((res) => res.json())
        .then((data) => {
          related_movies_arr = data.results;
          relatedMovies(related_movies_arr);
        })
        .catch((err) => console.log(err));
    });
  });
  GetRelatedPouplarMovie();

  // logo effect
  const logo_content = logo.textContent;

  setInterval(() => {
    const f = document.querySelector(".card-holder");
    const child = f.querySelector(".logo-copy");
    child.textContent = logo_content;

    const v = document.querySelector(".card-placement");
    const vChild = v.querySelectorAll(".logo-copy");
    vChild.forEach((item) => {
      item.textContent = logo_content;
    });
  }, 100);
  logo_copy.forEach((logo) => {
    logo.textContent = logo_content;
  });

  // adding all the array items in one array using the spread operator
  all_array_items = [...top_rated_arr, ...popular_arr, ...trending_arr];

  // Add a single click event listener to the parent container
  // more-info
  const more_info = document.querySelectorAll(".info");

  more_info.forEach((info) => {
    info.addEventListener("click", (e) => {
      e.preventDefault();
      const movie_detail = document.querySelector(".movie-ful-detail");
      // const overlay = document.querySelector(".overlay");
      if (movie_detail.classList.contains("animate__fadeOut")) {
        movie_detail.classList.remove("animate__fadeOut");
        movie_detail.classList.add("animate__fadeIn");
        movie_detail.style.display = "block";
        movie_detail.style.zIndex = 1000000;
      }
      setTimeout(() => {
        const overlay = document.querySelector(".overlay");
        overlay.style.display = "none";
      }, 0);
      const cardId =
        e.target.parentElement.parentElement.parentElement.parentElement.dataset
          .id;
      getCardDetails(cardId);
    });
  });

  // trending movies
  const trending_section = document.querySelectorAll(".trending-box");

  trending_section.forEach((trending) => {
    trending.addEventListener("click", (e) => {
      e.preventDefault();
      const movie_detail = document.querySelector(".movie-ful-detail");
      if (movie_detail.classList.contains("animate__fadeOut")) {
        movie_detail.classList.remove("animate__fadeOut");
        movie_detail.classList.add("animate__fadeIn");
        movie_detail.style.display = "block";
        movie_detail.style.zIndex = 1000000;
      }
      const cardId = e.target.parentElement.dataset.id;
      getCardDetails(cardId);
    });
  });

  // banner-info button
  setInterval(() => {
    const banner_info = document.querySelector(".banner-info");
    banner_info.addEventListener("click", (e) => {
      e.preventDefault();
      const movie_detail = document.querySelector(".movie-ful-detail");
      // const overlay = document.querySelector(".overlay");
      if (movie_detail.classList.contains("animate__fadeOut")) {
        movie_detail.classList.remove("animate__fadeOut");
        movie_detail.classList.add("animate__fadeIn");
        movie_detail.style.display = "block";
        movie_detail.style.zIndex = 1000000;
      }
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "none";
      const cardId =
        e.target.parentElement.parentElement.parentElement.dataset.id;
      getCardDetails(cardId);
    });
  }, 100);

  setInterval(() => {
    // adding a click to all related movies to see their details
    const related_movies_box = document.querySelectorAll(".card-box");
    related_movies_box.forEach((box) => {
      box.addEventListener("click", (e) => {
        e.preventDefault();
        if (overlay.classList.contains("animate__fadeIn")) {
          overlay.classList.remove("animate__fadeIn");
          overlay.classList.add("animate__fadeOut");
          overlay.style.display = "none";
        }

        const movie_detail = document.querySelector(".movie-ful-detail");
        // const overlay = document.querySelector(".overlay");
        if (movie_detail.classList.contains("animate__fadeOut")) {
          movie_detail.classList.remove("animate__fadeOut");
          movie_detail.classList.add("animate__fadeIn");
          movie_detail.style.display = "block";
          movie_detail.style.zIndex = 1000000;
        }
        // const overlay = document.querySelector(".overlay");
        // overlay.style.display = "none";
        const cardId = e.target.parentElement.parentElement.dataset.id;
        getCardDetails(cardId);
      });
    });
  }, 0);
};

// implementing the detail algorithm for the detail query

// Function to get card details by ID
function getCardDetails(cardId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDA5MWYxNGJkNTNiMWJhZDIwODg5YWQyMGU0YjZlYSIsInN1YiI6IjY1OGM4ZDkwMjIxYmE2MDE1OWRiNGMyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkYwzUX100__25r_Qb92H72_5E0NyxbhvJsVec2_TV0",
    },
  };

  fetch(
    `https://api.themoviedb.org/3/movie/
${cardId}?api_key=${Api_Key}&language=en-US&append_to_response=credits`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const image_path = movie_image_base_url;
      // looping through the cast and crew array
      /*
      cast
      */
      // create a function
      cast_array = response.credits["cast"];
      new_cast = cast_array
        .map((casts) => {
          return `<div class="Casts" data-id="${casts.id}">
              <img src="${image_path + casts.profile_path}" alt="" />
              <div class="casts-text">
                <pre><span>Character:</span> <span>${
                  casts.character
                }</span></pre>
                <pre><span>Real Name:</span> <span>${
                  casts.original_name
                }</span></pre>
                <pre><span>Role:</span> <span>${
                  casts.known_for_department
                }</span></pre>
              </div>
            </div>`;
        })
        .join("");

      // crew
      crew_array = response.credits["crew"];
      let new_crew = crew_array
        .map((crew) => {
          return `<div class="Crews">
      <img src="${image_path + crew.profile_path}" alt="" />
      <div class="crew-text">
        <pre><span>Job:</span> <span>${crew.job}</span></pre>
        <pre><span>Real Name:</span> <span>${crew.original_name}</span></pre>
        <pre><span>Role:</span> <span>${crew.known_for_department}</span></pre>
      </div>
    </div>`;
        })
        .join("");

      const html = `<div class="movie-" data-id="${response.id}">
        <img src="${
          image_path + response.backdrop_path
        }" alt="" class="banner-image"/>
        <div class="overview-for-movie">
          <h1>${response.title}</h1>
          <div class="full-desc">
            <p>${response.overview}</p>
          </div>
            <div class="separate-casts">
            <div class="casts-wrapper">
            <h1>Cast:</h1>
              ${new_cast}
          </div>
          <div class="crew-wrapper">
            <h1>Crew:</h1>
          ${new_crew}
          </div>
            </div>
        </div>
      </div>`;
      document.querySelector(".movie-ful-detail").innerHTML = html;
    })
    .catch((err) => console.error(err));
}

// all related movies

function relatedMovies(Prop) {
  const new_items = Prop.map((item) => {
    let image_path = movie_image_base_url + item.poster_path;

    // check the length of the overview and also check if the overview is empty
    let overview = item.overview;
    if (overview.length >= 70) {
      const trimmedOverview = overview.slice(0, 70) + "...";
      overview = trimmedOverview;
    } else if (overview.trim() === "") {
      overview =
        "Movie summary for this isn't available at the moment or simply check out their official website";
    }
    // end
    // Also check for any of the item without a poster image and replace it with the backdrop image instead
    let item_image_backdrop = item.backdrop_path;
    let item_image_poster = item.poster_path;
    // using the if statement check if they are available and switch them
    if (item_image_backdrop === null) {
      image_path = "../spiderman.png";
    }

    return `<div class="card-box" data-id="${item.id}" data-genreId="${item.genre_ids}">
              <div class="poster-image">
                <img src="${image_path}" alt="" />
                <span class="logo-copy"></span>
              </div>
              <div class="overview-texts">
                <span class="year"> ${item.release_date} </span><br /><br />
                <p class="movie-summary">
                  ${overview}
                </p>
              </div>
            </div>`;
  }).join("");
  document.querySelector(".card-placement").innerHTML = new_items;
}

// bars for menu
document.querySelector(".fa-bars").onclick = () => {
  document.querySelector("nav ul").classList.toggle("active_menu");
};