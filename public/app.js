let removeTimer
const originalNoteContents = {}

document.addEventListener('click', handleDocumentClick)
document.addEventListener('DOMContentLoaded', handleDocumentLoad)

function handleDocumentClick(event) {
  const { target } = event
  const id = target.dataset.id

  if (!id) return

  const clickedBtn = target
  const btnSaveElem = document.querySelector(
    `[data-type="save"][data-id="${id}"]`
  )
  const titleNoteElem = document.querySelector(`[data-type="note-${id}"]`)
  const btnRemoveCancelElem =
    document.querySelector(`[data-type="remove"][data-id="${id}"]`) ||
    document.querySelector(`[data-type="cancel"][data-id="${id}"]`)

  if (target.dataset.type === 'remove' || target.dataset.type === 'cancel') {
    handleRemoveOrCancel(id, clickedBtn, titleNoteElem)
  } else if (target.dataset.type === 'edit' || target.dataset.type === 'save') {
    handleEditOrSave(
      id,
      clickedBtn,
      btnSaveElem,
      titleNoteElem,
      btnRemoveCancelElem
    )
  }
}

function handleRemoveOrCancel(id, clickedBtn, titleNoteElem) {
  const isRemove = clickedBtn.dataset.type === 'remove'

  if (isRemove) {
    remove(id).then(() => {
      clickedBtn.closest('li').remove()
      const remainingNotes = document.querySelectorAll('.list-group-item')
      if (remainingNotes.length === 0) {
        const cardDiv = document.querySelector('.card')
        if (cardDiv) cardDiv.remove()
        createAlert('Заметок нет', 'info')
      }
    })
  } else {
    resetToEditState(id, titleNoteElem, clickedBtn)
  }
}

function handleEditOrSave(
  id,
  clickedBtn,
  btnSaveElem,
  titleNoteElem,
  btnRemoveCancelElem
) {
  const isSave = clickedBtn.dataset.type === 'save'

  if (isSave) {
    saveNoteChanges(clickedBtn, titleNoteElem, btnRemoveCancelElem, id)
  } else {
    setToEditState(id, clickedBtn, titleNoteElem, btnRemoveCancelElem)
  }
}

function resetToEditState(id, titleNoteElem, clickedBtn) {
  const btnSaveElem = document.querySelector(
    `[data-type="save"][data-id="${id}"]`
  )
  if (btnSaveElem) {
    btnSaveElem.classList.replace('btn-success', 'btn-primary')
    btnSaveElem.textContent = 'Изменить'
    btnSaveElem.dataset.type = 'edit'
  }
  titleNoteElem.classList.remove(
    'border',
    'rounded',
    'border-2',
    'border-black'
  )
  titleNoteElem.removeAttribute('contentEditable')
  clickedBtn.dataset.type = 'remove'
  clickedBtn.innerHTML = '&times;'
  titleNoteElem.textContent = originalNoteContents[id]
}

function setToEditState(id, clickedBtn, titleNoteElem, btnRemoveCancelElem) {
  originalNoteContents[id] = titleNoteElem.textContent.trim()
  clickedBtn.classList.replace('btn-primary', 'btn-success')
  titleNoteElem.classList.add('border', 'rounded', 'border-2', 'border-black')
  clickedBtn.textContent = 'Сохранить'
  titleNoteElem.setAttribute('contentEditable', 'true')
  clickedBtn.dataset.type = 'save'
  titleNoteElem.focus()

  if (btnRemoveCancelElem) {
    btnRemoveCancelElem.dataset.type = 'cancel'
    btnRemoveCancelElem.textContent = 'Отменить'
  }
}

function saveNoteChanges(clickedBtn, titleNoteElem, btnRemoveCancelElem, id) {
  clickedBtn.classList.replace('btn-success', 'btn-primary')
  titleNoteElem.classList.remove(
    'border',
    'rounded',
    'border-2',
    'border-black'
  )
  clickedBtn.textContent = 'Изменить'
  titleNoteElem.removeAttribute('contentEditable')
  clickedBtn.dataset.type = 'edit'

  if (btnRemoveCancelElem) {
    btnRemoveCancelElem.dataset.type = 'remove'
    btnRemoveCancelElem.innerHTML = '&times;'
  }

  const titleNote = titleNoteElem.textContent.trim()
  if (titleNote !== '' && titleNote !== originalNoteContents[id]) {
    edit(id, titleNote).then(() => createAlert('Заметка была изменена!'))
  }
}

function handleDocumentLoad() {
  const alertSuccess = document.querySelector('.alert-success')
  if (alertSuccess) {
    if (removeTimer) clearTimeout(removeTimer)
    removeTimer = setTimeout(() => alertSuccess.remove(), 2000)
  }
}

async function remove(id) {
  await fetch(`/${id}`, { method: 'DELETE' })
  createAlert('Заметка была удалена!')
}

async function edit(id, title) {
  await fetch(`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
}

function createAlert(text, type = 'success') {
  let alert = document.querySelector(`.alert-${type}`)
  if (!alert) {
    alert = document.createElement('div')
    alert.className = `alert alert-${type}`
    alert.setAttribute('role', 'alert')
    alert.textContent = text

    if (type === 'success') {
      alert.style.marginLeft = '-15px'
      document.body.prepend(alert)
    } else {
      document.querySelector('.container').append(alert)
    }
  } else {
    alert.textContent = text
  }

  removeAlert()
}

function removeAlert(delay = 2000) {
  const alert = document.querySelector('.alert-success')
  if (alert) {
    if (removeTimer) clearTimeout(removeTimer)
    removeTimer = setTimeout(() => alert.remove(), delay)
  }
}
