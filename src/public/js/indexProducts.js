
document.addEventListener('DOMContentLoaded', () => {

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE'
            })
            location.reload()
            alert('Se elimino el producto')

        } catch (error) {
            console.error('Error:', error)
            alert('Error al eliminar el producto')
        }
    }

    const handleAddToCart = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/carts`)
            const data = await response.json()
            const h2 = document.getElementById('h2')
            h2.textContent = id
            h2.style.display = 'visible'
            openPopup(data)

        } catch (error) {
            console.error('Error:', error)
            alert('Error al agregar el producto al carrito')
        }
    }

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener( 'click', async () => await handleDelete(button.getAttribute('data-id')))
    })

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', () => handleAddToCart(button.getAttribute('data-id')))
    })


    // Navegar al carrito
    document.querySelectorAll('.cart-button').forEach(button => {
        button.addEventListener('click', () => window.location.href = 'http://localhost:8080/api/carts/principal')
    })

    document.querySelectorAll('.button_22').forEach(button => {
        button.addEventListener('click', async () => {
            const data = {
                id: document.getElementById('idMP').value,
                title: document.getElementById('titleMP').value,
                description: document.getElementById('descriptionMP').value,
                code: document.getElementById('codeMP').value,
                price: document.getElementById('priceMP').value,
                status: document.getElementById('statusMP').value,
                stock: document.getElementById('stockMP').value,
                category: document.getElementById('categoryMP').value
            }

            try {
                await fetch(`http://localhost:8080/api/products`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                document.getElementById('formMP').reset()
            } catch (error) {
                console.error('Error:', error)
                alert('Error al actualizar el producto')
            }


        })
    })

    document.querySelectorAll('.button2').forEach(button => {
        button.addEventListener('click', async () => {

            const data = {
                title: document.getElementById('titleCP').value,
                description: document.getElementById('descriptionCP').value,
                code: document.getElementById('codeCP').value,
                price: document.getElementById('priceCP').value,
                status: document.getElementById('statusCP').value,
                stock: document.getElementById('stockCP').value,
                category: document.getElementById('categoryCP').value
            }

            try {
                await fetch(`http://localhost:8080/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                document.getElementById('formCP').reset()
            } catch (error) {
                console.error('Error:', error)
                alert('Error al cargar el producto')
            }


        })
    })

    document.querySelectorAll('.button223').forEach(button => {
        button.addEventListener('click', async () => {
            const idInput = document.getElementById('bID')
            if (idInput) {
                const id = idInput.value
                if (id) {
                    window.location.href = `http://localhost:8080/api/products/${id}`
                } else {
                    alert('Error, ingrese el ID del producto')
                }
            } else {
                console.error('No se encontró ID')
            }

        })
    })

    document.querySelectorAll('.button32').forEach(button => {
        button.addEventListener('click', async () => {
            const texto = document.getElementById('IDbs').value
            const selectElement = document.getElementById('buscar')
            const buscar = selectElement.value
            try {
                window.location.href = (`http://localhost:8080/api/products/buscar?buscar=${buscar}&texto=${texto}`)
            } catch (error) {
                console.error('Error:', error)
                alert('Error al buscar')
            }
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
        const response = await fetch(`http://localhost:8080/api/carts/${carritoId}/product/${id}/?numberProducts=${numberProducts}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (response.ok) {
            location.reload()
            alert(`Se agregó al carrito: ${carritoId}`)
        } else {
            const errorData = await response.json()
            console.error('Error:', errorData)
            alert(`Error al agregar al carrito: ${errorData.message}`)
        }
    } catch (error) {
        console.error('Error:', error)
        alert(`Error al agregar al carrito: ${error.message}`)
    }
})
