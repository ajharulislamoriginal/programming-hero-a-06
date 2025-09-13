const categoryContainer = document.getElementById("categoryContainer");
const planContainer = document.getElementById("planContainer");
const detailsContainer = document.getElementById("detailsContainer");
const history = document.getElementById("history");
const mainPrice = document.getElementById("mainPrice");
let cartPlants = [];

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};
const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
        <li id="${cat.id}" class="cursor-pointer w-full hover:bg-[#2ea754] p-2 rounded-md hover:transition duration-500 hover:text-white ">
                ${cat.category_name}
              </li>
        `;
  });

  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");

    allLi.forEach((li) => {
      li.classList.remove("bg-green-700");
      li.classList.remove("text-white");
    });

    if (e.target.localName === "li") {
      showLoading();
      e.target.classList.add("bg-green-700");
      e.target.classList.add("text-white");
      plantsByCategory(e.target.id);
    }
  });
};

const plantsByCategory = (plantId) => {
  fetch(`https://openapi.programming-hero.com/api/category/${plantId}`)
    .then((res) => res.json())
    .then((data) => {
      showPlantByCategory(data.plants);
    });
};

const showPlantByCategory = (plants) => {
  planContainer.innerHTML = "";
  plants.forEach((plant) => {
    planContainer.innerHTML += `
    <div class="bg-white shadow-lg hover:transition hover:translate-2 duration-300  space-y-3 p-4 rounded-lg h-[550px]">
    <img class="rounded-lg h-[250px] w-full" src="${plant.image}">
      <div id="plant-${plant.id}" class="space-y-3">
         <h1  onclick="plantdetails(${plant.id})" class=" font-semibold text-lg cursor-pointer">${plant.name}</h1>
      <p class="text-gray-600">${plant.description}</p>
      <div class="flex justify-between">
        <button class="btn bg-[#DCFCE7] rounded-full text-[#15803D]">${plant.category}</button>
        <p><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</p>
      </div>
    <button  class=" btn w-full rounded-full text-white bg-green-700 p-2">Add to Cart</button>
      </div>
    </div>

    `;
  });
};

loadCategory();

const loadAllCategorys = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      const cardAll = data.plants;
      showAllCategor(cardAll);
    });
};
const showAllCategor = (cardAll) => {
  planContainer.innerHTML = "";
  cardAll.forEach((card) => {
    planContainer.innerHTML += `
       <div class="bg-white shadow-lg hover:transition hover:translate-2 duration-300  space-y-3 p-4 rounded-lg h-[550px]">
    <img class="rounded-lg h-[250px] w-full" src="${card.image}">
     <div id="plant-${card.id}" class="space-y-3">
           <h1  onclick="plantdetails(${card.id})" class=" w-[135px] font-semibold text-lg cursor-pointer">${card.name}</h1>
      <p class="text-gray-600">${card.description}</p>
      <div class="flex justify-between">
        <button class="btn bg-[#DCFCE7] rounded-full text-[#15803D]">${card.category}</button>
        <p><i class="fa-solid fa-bangladeshi-taka-sign"></i>${card.price}</p>
      </div>
    <button  class="btn w-full rounded-full text-white bg-green-700 p-2">Add to Cart</button>
     </div>
    </div>
        `;
  });
};
loadAllCategorys();

const plantdetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.plants);
};

const displayDetails = (trees) => {
  detailsContainer.innerHTML = `
  <div class="space-y-3">
            <h1 class="text-2xl font-bold">${trees.name}</h1>
            <img class="rounded-lg h-[350px] w-full" src="${trees.image}" alt="">
            <p><span class="font-bold text-lg">Categories</span> : ${trees.category}</p>
            <p><span class="font-bold text-lg">Price</span> : <i class="fa-solid fa-bangladeshi-taka-sign"></i>${trees.price}</p>
            <p><span class="font-bold text-lg">Description</span> : ${trees.description}</p>
          </div>
  `;
  document.getElementById("my_modal_5").showModal();
};

planContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") {
    handlePlantCart(e);
  }
});

const handlePlantCart = (e) => {
  const title = e.target.parentNode.children[0].innerText;
  const price = e.target.parentNode.children[2].children[1].innerText;

  const id = e.target.parentNode.id;

  cartPlants.push({
    title: title,
    price: price,
    id: id,
  });

  showCart(cartPlants);
};

const showCart = (cartPlants) => {
  history.innerHTML = "";
  mainPrice.innerText = "";
 
  let total = 0;
  cartPlants.forEach((plantCart) => {
    plantCart.innerHTML = "";
    history.innerHTML += `
            
           <div class="bg-[#F0FDF4] flex justify-between items-center rounded-lg p-3 my-3 shadow-lg hover:translate-1 duration-300">
            <div>
              <h1 class="font-bold">${plantCart.title}</h1>
             <p class="text-gray-400 "><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plantCart.price} <i  class="fa-solid fa-xmark"></i> 1</p>
           </div>
            <i onclick="deleteCart('${plantCart.id}')" class="fa-solid fa-xmark text-gray-400 text-2xl cursor-pointer"></i>
          </div>
  `;
    total += Number(plantCart.price);
    
  });

  mainPrice.innerText = total;
};

const deleteCart = (cartId) => {
  const filterCart = cartPlants.filter((plantCart) => plantCart.id !== cartId);
  cartPlants = filterCart;
  showCart(cartPlants);
};

const showLoading = () => {
  planContainer.innerHTML = `
  <div class="col-span-full flex flex-col items-center">
        <span class="loading loading-dots loading-xl"></span>
      </div>
  `;
};

 
