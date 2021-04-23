const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users"
const userList = []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector('#paginator')

const USER_PER_PAGE = 12

let filteredList = [] //搜尋清單


// function renderUserList
function renderUserList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-2">
    <div class="mt-2">
      <div class="card">
        <img src="${item.avatar}" alt="avatar" class="btn avatar" data-toggle="modal"
          data-target="#user-info-modal"  data-id="${item.id}">
        <div class="card-body">
          <h2 class="h6 user-name" data-toggle="modal"
          data-target="#user-info-modal" data-id="${item.id}}">${item.name} ${item.surname}</h2>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

//paginator
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getListByPage(page) {
  const data = filteredList.length ? filteredList : userList
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

//listen to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderUserList(getListByPage(page))
})

// clicking event setting
dataPanel.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches(".avatar") || event.target.matches(".user-name")) {
    console.log(event.target)
    console.log(event.target.dataset.id)
    showUserModal(Number(event.target.dataset.id))
  }
})



searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredList = userList.filter((list) =>
    list.name.toLowerCase().includes(keyword)
  )

  if (filteredList.length === 0) {
    return alert(`您輸入的關鍵字 : ${keyword} 並沒有符合的對象`)
  }
  renderPaginator(filteredList.length)
  renderUserList(getListByPage(1))
})




// function showUserModal
function showUserModal(id) {
  const modalImage = document.querySelector("#modal-image")
  const modalName = document.querySelector("#modal-name")
  const modalSurname = document.querySelector("#modal-surname")
  const modalId = document.querySelector("#modal-id")
  const modalGender = document.querySelector("#modal-gender")
  const modalBirthday = document.querySelector("#modal-birthday")
  const modalAge = document.querySelector("#modal-age")
  const modalRegion = document.querySelector("#modal-region")
  const modalEmail = document.querySelector("#modal-email")


  axios.get(INDEX_URL + `/${id}`).then((response) => {
    console.log(response.data.id)
    modalImage.src = `${response.data.avatar}`
    modalName.innerText = `NAME: ${response.data.name}`
    modalSurname.innerText = `Surname: ${response.data.surname}`
    modalId.innerText = `ID: ${response.data.id}`
    modalGender.innerText = `GENDER: ${response.data.gender}`
    modalBirthday.innerText = `BIRTHDAY: ${response.data.birthday}`
    modalAge.innerText = `AGE: ${response.data.age}`
    modalRegion.innerText = `REGION: ${response.data.region}`
    modalEmail.innerText = `EMAIL: ${response.data.email}`
  })
}


// get data from api using Axios and create userList
axios.get(INDEX_URL).then((response) => {
  userList.push(...response.data.results)
  renderPaginator(userList.length)
  renderUserList(getListByPage(1))
})