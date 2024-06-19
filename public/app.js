let removeTimer

document.addEventListener('click', ({ target }) => {
  if (target.dataset.type === 'remove') {
    const id = target.dataset.id

    remove(id).then(() => {
      target.closest('li').remove()

      const remainingNotes = document.querySelectorAll('.list-group-item')

      if (remainingNotes.length === 0) {
        const cardDiv = document.querySelector('.card')
        if (cardDiv) {
          cardDiv.remove()
        }
        createAlert('Заметок нет', 'info')
      }
    })
  }

  if (target.dataset.type === 'edit') {
    const id = target.dataset.id
    const titleNote = document.querySelector(`[data-type="note-${id}"]`)
    const correctNote = titleNote.childNodes[0].textContent
      .replace(/\s+/g, ' ')
      .trim()

    const title = prompt('Измените заголовок заметки', correctNote)

    if (title && title !== correctNote) {
      edit(id, title).then(() => {
        titleNote.childNodes[0].textContent = title
        createAlert('Заметка была изменена!')
      })
    }
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const alertSuccess = document.querySelector('.alert-success')

  if (alertSuccess) {
    if (removeTimer) {
      clearTimeout(removeTimer)
    }
    removeTimer = setTimeout(() => {
      alertSuccess.remove()
    }, 2000)
  }
})

async function remove(id) {
  await fetch(`/${id}`, { method: 'DELETE' }).then(() => {
    createAlert('Заметка была удалена!')
  })
}

async function edit(id, title) {
  await fetch(`/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })
}

function createAlert(text, type = 'success') {
  const alert = document.querySelector('.alert-success')

  if (!alert || type !== 'success') {
    const alertDiv = document.createElement('div')
    alertDiv.classList.add('alert', `alert-${type}`)
    alertDiv.setAttribute('role', 'alert')
    if (type === 'success') {
      alertDiv.style = 'margin-left: -15px;'
    }
    alertDiv.textContent = `${text}`
    if (type === 'success') {
      document.body.prepend(alertDiv)
    } else {
      const container = document.querySelector('.container')
      container.append(alertDiv)
    }

    removeAlert()
  } else {
    alert.textContent = `${text}`

    removeAlert()
  }
}

function removeAlert(delay = 2000) {
  const alert = document.querySelector('.alert-success')

  if (alert) {
    if (removeTimer) {
      clearTimeout(removeTimer)
    }
    removeTimer = setTimeout(() => {
      alert.remove()
    }, delay)
  }
}
