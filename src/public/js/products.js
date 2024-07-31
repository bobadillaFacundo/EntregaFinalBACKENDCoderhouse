document.addEventListener('DOMContentLoaded', () => {
    // Función para manejar la eliminación de un producto
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            alert(result.message)
            if (response.ok) {
                window.location.href = `http://localhost:8080/api/products`
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al eliminar el producto')
        }
    }

    // Asignar eventos a loss botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id')
            handleDelete(id)
        })
    })

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/carts/?principal=false`)
                const data = await response.json()
                const h2 = document.getElementById('h2')
                h2.style.display = 'visible'
                openPopup(data)

            } catch (error) {
                console.error('Error:', error)
                alert('Error al agregar el producto al carrito')
            }
        })
    })

    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/products`
        })
    })



})

function openPopup(items) {
    const overlay = document.getElementById('popupOverlay')
    const select = document.getElementById('popupList')
    select.innerHTML = '' // Limpiar las opciones existentes

    items.forEach(item => {
        const option = document.createElement('option')
        option.textContent = item._id
        option.value = item._id
        select.appendChild(option)
    })
    overlay.style.display = 'flex'
}

// Función para cerrar la ventana emergente
function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none'
}

document.getElementById("carritoForm").addEventListener('submit', async (event) => {
    event.preventDefault()

    const selectElement = document.getElementById('popupList')
    const carritoId = selectElement.value
    const h2 = document.getElementById('h2')
    const id = h2.textContent
    const numberProducts = document.getElementById('numberProducts').value

    try {
        // Usar parámetros de consulta o el cuerpo de la solicitud para enviar datos adicionales
        await fetch(`http://localhost:8080/api/carts/${carritoId}/product/${id}/?numberProducts=${numberProducts}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            alert(`Se agregó al carrito: ${carritoId}`)
            location.reload()

    } catch (error) {
        console.error('Error:', error)
        alert(`Error al agregar al carrito: ${error.message}`)
    }
})