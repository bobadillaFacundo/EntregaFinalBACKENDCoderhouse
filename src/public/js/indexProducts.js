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
                location.reload()
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto')
        }
    }

    // Función para manejar agregar al carrito
    const handleAddToCart = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/carts/?principal=false`)
            if (!response.ok) {
                throw new Error('Página no disponible')
            }
            const data = await response.json()
            const h2 = document.getElementById('h2')
            h2.textContent = id
            h2.style.display = 'visible'
            openPopup(data);

        } catch (error) {
            console.error('Error:', error)
            alert('Error al agregar el producto al carrito')
        }
    }

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => handleDelete(button.getAttribute('data-id')))
    })

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', () => handleAddToCart(button.getAttribute('data-id')))
    })


    // Navegar al carrito
    document.querySelectorAll('.cart-button').forEach(button => {
        button.addEventListener('click', () => window.location.href = 'http://localhost:8080/api/carts')
    })

    // Navegar al carrito
    document.querySelectorAll('.button2').forEach(button => {
        button.addEventListener('click', async () => {

            const data = {
                title: document.getElementById('titleMP').value,
                description: document.getElementById('descriptionMP').value,
                code: document.getElementById('codeMP').value,
                price: document.getElementById('priceMP').value,
                status: document.getElementById('statusMP').value,
                stock: document.getElementById('stockMP').value,
                category: document.getElementById('categoryMP').value
            }

            try {
                const response = await fetch(`http://localhost:8080/api/products/${document.getElementById('idMP').value}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json()
                alert('Producto modificado: ' + result.message)
                location.reload()
                document.getElementById('formMP').reset()
            } catch (error) {
                console.error('Error:', error)
                alert('Error al actualizar el producto')
            }


        })
    })

    document.querySelectorAll('.button223').forEach(button => {
        button.addEventListener('click', async () => {
            // Verifica si los botones con clase 'button223' existen y agrega los eventos
    const buttons = document.querySelectorAll('.button223');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const idInput = document.getElementById('bID')
                if (idInput) {
                    const id = idInput.value
                    if (id) {
                        console.log(`Redirigiendo a: http://localhost:8080/api/products/${id}`)
                        window.location.href = `http://localhost:8080/api/products/${id}`
                    } else {
                        alert('Error, ingrese el ID del producto');
                    }
                } else {
                    console.error('No se encontró el elemento con ID "bID"')
                }
            })
        })
    } else {
        console.error('No se encontraron botones con la clase "button223"')
    }
        })
    })

})

// Función para abrir la ventana emergente y agregar una lista
function openPopup(items) {
    const overlay = document.getElementById('popupOverlay')
    const select = document.getElementById('popupList')
    select.innerHTML = '' // Limpiar las opciones existentes

    items.forEach(item => {
        const option = document.createElement('option')
        option.textContent = item._id
        option.value = item._id
        select.appendChild(option)
    });
    overlay.style.display = 'flex'
}

// Función para cerrar la ventana emergente
function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none'
}

document.getElementById("carritoForm").addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    const selectElement = document.getElementById('popupList');
    const carritoId = selectElement.value;
    const h2 = document.getElementById('h2');
    const id = h2.textContent;
    const numberProducts = document.getElementById('numberProducts').value; // Asegúrate de que este elemento existe y tenga un valor

    try {
        // Usar parámetros de consulta o el cuerpo de la solicitud para enviar datos adicionales
        const response = await fetch(`http://localhost:8080/api/carts/${carritoId}/product/${id}/?numberProducts=${numberProducts}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (response.ok) {
            location.reload();
            alert(`Se agregó al carrito: ${carritoId}`);
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert(`Error al agregar al carrito: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al agregar al carrito: ${error.message}`);
    }
})
