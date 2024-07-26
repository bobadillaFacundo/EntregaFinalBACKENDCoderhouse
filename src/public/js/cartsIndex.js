document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/products`
        })
    })


    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/carts`
        })
    })

    // Event listener para el botón 'Eliminar Carrito'
    document.querySelectorAll('.btn-delete-productsCarts').forEach(button => {
        button.addEventListener('click', async () => {
            const idCart = button.getAttribute("data-id-carrito")
            const idproducto = button.getAttribute("data-id-producto")
            try {
                await fetch(`http://localhost:8080/api/carts/${idCart}/product/${idproducto}`, {
                    method: 'DELETE'
                })
                location.reload()
            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar producto del carrito')
            }

        })
    })


})

// Manejar clic en el botón de buscar ID
document.getElementById('IDB').addEventListener('submit', (event) => {
    event.preventDefault() // Evitar que el formulario se envíe de la manera tradicional
    const id = document.getElementById('bID').value
    if (id !== '') {
        window.location.href = `http://localhost:8080/api/carts/${id}`
        document.getElementById('bID').value = ''
    } else {
        alert('Error, ingrese el id del carrito')
    }
})

