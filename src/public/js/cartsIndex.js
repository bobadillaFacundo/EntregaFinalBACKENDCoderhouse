document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/products/principal`
        })
    })


    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/carts/principal`
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
                alert('Se elimino el Producto')
                location.reload()

            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar producto del carrito')
            }

        })
    })
    document.querySelectorAll('.product-button2').forEach(button => {
        button.addEventListener('click', async () => {
            const idInput = document.getElementById('CID').value
            alert(idInput)
                if (idInput) {
                    window.location.href = `http://localhost:8080/api/carts/${idInput}`
                } else {
                    alert('Error, ingrese el ID del producto')
                }
        })
    })

    document.querySelectorAll('.button_').forEach(button => {
        button.addEventListener('click', async () => {
            const idInput = document.getElementById('IDC').value
                if (idInput) {
                    window.location.href = `http://localhost:8080/api/carts/${idInput}`
                } else {
                    alert('Error, ingrese el ID del Carrito')
                }
        })
    })

     document.querySelectorAll('.btn-delete-Cart').forEach(button => {
        button.addEventListener('click', async () => {
            const idCart = button.getAttribute("data-id-carrito")
            try {
                await fetch(`http://localhost:8080/api/carts/${idCart}`, {
                    method: 'DELETE'
                })
                alert('Se elimino carrito')
                location.reload()
            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar el carrito')
            }

        })
    })
})
