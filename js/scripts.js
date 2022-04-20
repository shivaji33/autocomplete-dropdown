const input = document.getElementById("searchInput");
const ul = document.querySelector(".usersList");
let listItems;
let currentFocus;

input.addEventListener("input", debounce(onInputChange, 500));

async function fakeApi(countryName) {
  let url = "https://restcountries.com/v2/all";
  if (countryName) {
    url = `https://restcountries.com/v2/name/${countryName}`;
  }
  try {
    const data = await fetch(url).then((response) => response.json());
    listInit(data);
  } catch (err) {
    ul.innerHTML = "";
    console.log(err);
  }
}

function listInit(newUsers) {
  if (!newUsers || !newUsers.length) {
    return;
  }
  newUsers.forEach((user, i) => {
    const li = document.createElement("li");
    li.innerText = user.name;
    li.className = "list-item";
    li.id = i;
    li.title = user.name;
    ul.appendChild(li);
  });
  if (newUsers) {
    ul.style.removeProperty("display");
  }
  listItems = document.querySelectorAll(".list-item");
  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      input.value = item.innerText;
      ul.style.display = "none";
    });
  });
}

function onInputChange(event) {
  const inputValue = event.target.value.toString().toLowerCase().trim();
  console.log(inputValue, "debouncing........");
  currentFocus = -1;
  ul.innerHTML = "";
  fakeApi(inputValue);
}

input.addEventListener("keydown", () => {
  // keyboard events
  const items = document.querySelectorAll(".list-item");
  if (!items) {
    return;
  }
  if (event.keyCode === 40) {
    currentFocus++;
    addActiveToItem(items);
    if (!isVisible(ul, items[currentFocus])) {
      customScroll(40);
    }
  } else if (event.keyCode === 38) {
    currentFocus--;
    addActiveToItem(items);
    if (!isVisible(ul, items[currentFocus])) {
      customScroll(38);
    }
  } else if (event.keyCode === 13) {
    if (currentFocus > -1) {
      items[currentFocus].click();
    }
  }
});

function addActiveToItem(items) {
  removeActiveItems(items);
  if (currentFocus >= items.length) {
    currentFocus = 0;
  }
  if (currentFocus < 0) {
    currentFocus = items.length - 1;
  }
  items[currentFocus].classList.add("active-item");
}
let scrollheight = 0;
function customScroll(type) {
  if (scrollheight < 0) {
    scrollheight = ul.scrollHeight;
    ul.scrollTop = ul.scrollHeight;
  }

  if (type === 40) {
    if (scrollheight < ul.scrollHeight || scrollheight < ul.scrollHeight) {
      scrollheight += 241;
    } else if (scrollheight === ul.scrollHeight) {
      scrollheight = 0;
      ul.scrollTop = 0;
    }
  } else {
    if (scrollheight < ul.scrollHeight || scrollheight < ul.scrollHeight || (scrollheight === ul.scrollHeight)) {
      scrollheight -= 241;
    }
  }
  ul.scroll(0, scrollheight);
}

const isVisible = function (ele, container) {
  const { bottom, height, top } = ele.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return top <= containerRect.top
    ? containerRect.top - top <= height
    : bottom - containerRect.bottom <= height;
};

function removeActiveItems(items) {
  items.forEach((item) => {
    item.classList.remove("active-item");
  });
}

function debounce(fn, ms) {
  let timer;
  return function () {
    let context = this,
      arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, arg);
    }, ms);
  };
}

document.addEventListener("click", function (event) {
  const specifiedElement = document.querySelector(".dropdown-wrapper");
  const isClickInside = specifiedElement.contains(event.target);
  if (!isClickInside) {
    ul.style.removeProperty("display");
  }
});
