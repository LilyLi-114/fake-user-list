(function () {

  // write your code here
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const navBar = document.getElementById('nav-bar')
  // const modalAddToFavorite = document.getElementById('add-to-favorite')
  //宣告一個搜尋要比對的變數
  const regex = new RegExp(searchInput, 'i') //i指的是不分大小寫
  //宣告一個分頁使用的變數
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 20


  //串連網頁資訊
  axios.get(INDEX_URL)
    .then((response) => {
      console.log(response.data.results)
      data.push(...response.data.results)
      // displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    }).catch((err) => console.log(err))


  //listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.card-img-top')) {
      showUser(event.target.dataset.id)
    }
  })

  //listen to the nav bar click
  navBar.addEventListener('click', event => {
    if (event.target.matches('#show-all')) {
      displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    } else if (event.target.matches('#show-female')) {
      let results = []
      results = data.filter(
        user => user.gender === 'female')
      displayDataList(results)
      getTotalPages(results)
      getPageData(1, results)
    } else if (event.target.matches('#show-male')) {
      let results = []
      results = data.filter(
        user => user.gender === 'male')
      displayDataList(results)
      getTotalPages(results)
      getPageData(1, results)
    }
  })

  //listen to the search form
  searchForm.addEventListener('submit', event => {
    let results = []
    event.preventDefault()
    //設定一個搜尋輸入值的常數
    //第一項參數是使用 regular expression 表達出來的文字結構，這裡傳入關鍵字 ，表示「含有 'searchInput' 的字串」
    const regex = new RegExp(searchInput.value, 'i') // i表示不分大小寫
    results = data.filter(
      user => user.name.match(regex))
    console.log(results)
    displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  //listen to the add to favorite 
  // modalAddToFavorite.addEventListener('click', event => {
  // addFavoriteItem(event.target.dataset.id)
  // })

  //listen to the pagination click event 
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })


  //將網頁資訊show在頁面上
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
      <div class = "col-6 col-lg-2 col-md-2 col-sm-3 px-2">
        <div class = "card mb-3">
          <img class = "card-img-top" data-id =${item.id} src = "${item.avatar}"  data-toggle="modal" data-target="#show-user-modal" alt: "card image cap">
          <div class = "card-body">
            <h6 class = "card-title">${item.name}</h6>
          </div>
        </div>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }
  //將資訊顯示在modal中
  function showUser(id) {
    //get element
    const modalName = document.getElementById('show-user-name')
    const modalAvatar = document.getElementById('show-user-avatar')
    const modalAge = document.getElementById('show-user-age')
    const modalBirthday = document.getElementById('show-user-birthday')
    const modalregion = document.getElementById('show-user-region')

    //set request url
    const url = INDEX_URL + id
    console.log(url)

    //send request
    axios.get(url).then(response => {
      const data = response.data
      console.log(data)

      //insert data into modal ui
      modalName.textContent = data.name
      modalAvatar.innerHTML = `<img class="img-fluid" src = "${data.avatar}">`
      modalAge.innerHTML = `Age : ${data.age}`
      modalBirthday.textContent = `Birthday : ${data.birthday}`
      modalregion.textContent = `Region : ${data.region}`
      // modalAddToFavorite.innerHTML = `<button class="btn btn-info btn-add-favorite" data-id="${data.id}">+</button>`

    })
  }

  //將資訊加入我的最愛
  // function addFavoriteItem(id) {
  //   const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  //   const user = data.find(item => item.id === Number(id))
  //   if (list.some(item => item.id === Number(id))) {
  //     alert(`${user.name} is already in your favorite list`)
  //   } else {
  //     list.push(user)
  //     alert(`Added ${user.name} to your favorite list`)
  //   }
  //   localStorage.setItem('favoriteUser', JSON.stringify(list))
  // }

  //分頁-計算分頁數
  let paginationData = []
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      //href="javascript:;" <<表示在javascript程式中進行跳頁
      pageItemContent += `
        <li class="page-item">
          <a class="page-link text-danger" href="javascript:;" data-page="${i + 1}">${i + 1}</a> 
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  //得到每一頁的資訊
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})()