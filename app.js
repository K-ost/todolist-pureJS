
// Elelemnts
const formInput = document.querySelector('#formInput')
const submitForm = document.querySelector('#submitForm')
const listItems = document.querySelector('#listItems')
const checkedOnly = document.querySelector('#checkedOnly')
const sortingContainer = document.querySelector('#sortingContainer')
const sortBtn = document.querySelector('#sortBtn')
const sortOptions = document.querySelectorAll('.jsSort')
const pagination = document.querySelector('#pagination')
const paginationPages = document.querySelector('#paginationPages')


// Variables
let value = ''
let perPage = 5
let currentPage = 1
let startPage = 0
let endPage = perPage
let editValue = ''
let alertMessage = 'The input field should not be empty or contain less than 3 characters.'


// Data
let items = [
  {
    id: 1691909351248,
    title: "Wake up and got up",
    checked: true
  },
  {
    id: 1691909354646,
    title: "Taking a shower",
    checked: true
  },
  {
    id: 1691909358358,
    title: "Having a breakfast",
    checked: false
  },
  {
    id: 1691909358758,
    title: "Drinking coffee",
    checked: false
  },
  {
    id: 1691909358858,
    title: "Going to work",
    checked: true
  },
  {
    id: 1691909358758,
    title: "Gym time",
    checked: false
  },
  {
    id: 1691909358758,
    title: "Coming back home after all",
    checked: false
  }
]
items.reverse()
let itemsReserve = items


// dateCreate
const dateCreate = (number, time) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const date = new Date(number)
  const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
  const minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()
  if (time) {
    return `${month}, ${day} ${year} | ${hours}:${minutes}`
  }
  return `${month}, ${day} ${year}`
}


// Onchange function
formInput?.addEventListener('input', e => {
  e.preventDefault()
  value = e.target.value
})

// Render function
function render() {
  if (items.length === 0) {
    listItems.innerHTML = '<li>Items are not found</li>'
  } else {

    renderPagination()

    // Sort showing
    if (items.length < 2 && checkedOnly.checked !== true) {
      sortingContainer.style.display = 'none'
    } else {
      sortingContainer.style.display = 'block'
    }
    
    // Pagination showing
    if (items.length < 6) {
      pagination.style.display = 'none'
    } else {
      pagination.style.display = 'block'
    }

    // Pager
    let list = items.slice(startPage, endPage)

    // Clear list before creation
    listItems.innerHTML = ''

    // Create list
    list.forEach(el => {
      const date = dateCreate(el.id, true)
      const div = document.createElement('li')
      div.setAttribute('class', `d-flex todo_item align-items-center mb-2 rounded p-2 ps-3 ${el.checked ? 'bg-body-secondary' : ''} border`)
      div.innerHTML = `
        <div class="me-auto">
          <div class="shown_name ${el.checked ? ' text-decoration-line-through' : ''}"><b>${el.title}</b></div>
          <div class="none mw-400 mb-1 hidden_form">
            <input type=""text" class="form-control me-1 sm" value="${el.title}" data-type="rename">
            <button class="btn btn-sm btn-warning" data-id="${el.id}" data-title="${el.title}" data-type="save">Edit</button>
          </div>
          <div class="small text-secondary">${date}</div>
        </div>
        <button class="btn btn-info ms-1" data-id="${el.id}" data-title="${el.title}" data-type="edit" ${el.checked ? 'disabled' : ''}>&#9998;</button>
        <button class="btn btn-${el.checked ? 'warning' : 'success'} ms-1" data-id="${el.id}" data-type="checked">&check;</button>
        <button class="btn btn-danger ms-1" data-id="${el.id}" data-type="remove">&times;</button>
      `
      listItems.append(div)
    })
  }
}
render()

// Submit form
submitForm?.addEventListener('submit', e => {
  e.preventDefault()
  if (value.length < 3) {
    alert(alertMessage)
  } else {
    const newTodo = {
      id: Date.now(),
      title: value,
      checked: false
    }
    items = [newTodo, ...items]
    itemsReserve = items
    render()
    formInput.value = ''
  }
})

// checkedOnly
checkedOnly.addEventListener('change', e => {
  if (e.target.checked) {
    items = items.filter(el => el.checked === true)
  } else {
    items = itemsReserve
  }
  render()
})

// changeCheckedItem
function changeCheckedItem(id) {
  items.forEach(el => {
    if (el.id === Number(id)) {
      el.checked = !el.checked
    }
  })
}

// removeItem
function removeItem(id) {
  items = items.filter(el => el.id !== Number(id))
}

// Check/uncheck or Remove item
listItems.addEventListener('click', e => {
  let title = e.target.closest('.todo_item').children[0].children[0]
  let form = e.target.closest('.todo_item').children[0].children[1]

  if (e.target.dataset.id) {

    // checked item
    if (e.target.dataset.type === 'checked') {
      changeCheckedItem(e.target.dataset.id)
      render()
    }

    // remove item
    if (e.target.dataset.type === 'remove') {
      removeItem(e.target.dataset.id)
      render()
    }

    // show edit field
    if (e.target.dataset.type === 'edit') {
      let editInput = e.target.closest('.todo_item').children[0].children[1].children[0]
      editValue = e.target.dataset.title
      editInput.value = e.target.dataset.title
      document.querySelectorAll('.shown_name').forEach(el => el.style.display = 'block')
      document.querySelectorAll('.hidden_form').forEach(el => el.style.display = 'none')
      title.style.display = 'none'
      form.style.display = 'flex'
    }

    // Save
    if (e.target.dataset.type === 'save') {
      if (editValue.length > 2) {
        items = items.map(el => {
          if (el.id === Number(e.target.dataset.id)) {
            if (!editValue.length) {
              editValue = e.target.dataset.title
            } else {
              el.title = editValue
              editValue = ''
            }
            title.style.display = 'block'
            form.style.display = 'none'
          }
          return el
        })
        render()
      } else {
        alert(alertMessage)
      }
    }
  }
})


// Rename todo item
listItems.addEventListener('input', e => {
  if (e.target.dataset.type) {
    if (e.target.dataset.type === 'rename') {
      editValue = e.target.value
    }
  }
})


// Sorting
sortOptions.forEach(option => {
  option.addEventListener('click', e => {
    let { title } = option.dataset
    sortBtn.innerText = option.innerText

    if (title === 'asc') {
      items.sort((a, b) => {
        if (a.title > b.title) return 1
        else return -1
      })
    } else if (title === 'desc') {
      items.sort((a, b) => {
        if (a.title > b.title) return -1
        else return 1
      })
    }
    render()
  })
})


// renderPagination
function renderPagination() {
  const count = Math.ceil(items.length / perPage)
  paginationPages.innerHTML = ''
  for (let i = 0; i < count; i++) {
    paginationPages.insertAdjacentHTML('beforeend', `
      <li class="page-item"><a class="page-link ${(currentPage === i + 1) ? 'active' : ''}" data-type="page" href="#">${i + 1}</a></li>
    `)
  }
  paginationPages.insertAdjacentHTML('afterbegin', `
    <li class="page-item ${(currentPage === 1) ? 'disabled' : ''}">
      <a class="page-link" href="#" data-type="prev">Previous</a>
    </li>
  `)
  paginationPages.insertAdjacentHTML('beforeend', `
    <li class="page-item ${(currentPage === count) ? 'disabled' : ''}">
      <a class="page-link" href="#" data-type="next">Next</a>
    </li>
  `)
}

// click pagination
paginationPages.addEventListener('click', e => {
  e.preventDefault()
  if (e.target.dataset.type) {
    if (e.target.dataset.type === 'page') {
      startPage = (e.target.innerText - 1) * perPage
      endPage = startPage + perPage
      currentPage = Number(e.target.innerText)
    } else if (e.target.dataset.type === 'prev') {
      startPage -= perPage 
      endPage -= perPage
      currentPage -=1
    } else if (e.target.dataset.type === 'next') {
      startPage += perPage 
      endPage += perPage
      currentPage +=1
    }
    render()
  }
})
