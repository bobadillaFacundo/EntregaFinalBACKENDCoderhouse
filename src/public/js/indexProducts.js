document.addEventListener('DOMContentLoaded', () => {
    // Función para manejar la eliminación de un producto
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json()
            alert(result.message); // Mostrar mensaje de éxito o error
            if (response.ok) {
                // Recargar la página solo si la eliminación fue exitosa
                location.reload()
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al eliminar el producto')
        }
    };

    // Función para manejar agregar al carrito
    const handleAddToCart = async (id) => {
        try {
            const response = await fetch(`/api/cart/${id}`, {
                method: 'POST'
            })
            const result = await response.json()
            alert(result.message) // Mostrar mensaje de éxito o error
        } catch (error) {
            console.error('Error:', error)
            alert('Error al agregar el producto al carrito')
        }
    }

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id')
            handleDelete(id)
        })
    })

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id')
            handleAddToCart(id)
        })
    })

    document.querySelectorAll('.cart-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/carts`
        })
    })
    
})

document.getElementById('formMP').addEventListener('submit', async function (event) {
    event.preventDefault()

    const id = document.getElementById('idMP').value
    const title = document.getElementById('titleMP').value
    const description = document.getElementById('descriptionMP').value
    const code = document.getElementById('codeMP').value
    const price = document.getElementById('priceMP').value
    const status = document.getElementById('statusMP').value
    const stock = document.getElementById('stockMP').value
    const category = document.getElementById('categoryMP').value

    const data = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    }

    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        location.reload()
        document.getElementById('idMP').value = ''
        document.getElementById('titleMP').value = ''
        document.getElementById('descriptionMP').value = ''
        document.getElementById('codeMP').value = ''
        document.getElementById('priceMP').value = ''
        document.getElementById('stockMP').value = ''
        document.getElementById('categoryMP').value = ''
        document.getElementById('statusMP').value = ''
        alert('Se Modifico el Producto', response.json().message)
    } catch (error) {
        console.error('Error:', error)
        alert('Error al actualizar el producto')
    }
})


// Manejar clic en el botón de buscar ID
document.getElementById('IDB').addEventListener('submit', async (event) => {
    event.preventDefault() // Evitar que el formulario se envíe de la manera tradicional
    const id = document.getElementById('bID').value
    if (id!==''){
        window.location.href = `http://localhost:8080/api/products/${id}`
    }else{   
        alert('Error, ingrese el id del producto')
    }
})


