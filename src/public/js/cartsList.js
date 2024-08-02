document.addEventListener('DOMContentLoaded', () => {
    // Event listener para el botón 'Volver'
    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/carts/principal`
        })
    })
    document.querySelectorAll('.btn-delete-products-carts').forEach(button => {
        button.addEventListener('click', async () => {
            const idCart = button.getAttribute("data-id23")
            const idproducto = button.getAttribute("data-products")
            try {
                await fetch(`http://localhost:8080/api/carts/${idCart}/product/${idproducto}`, {
                    method: 'DELETE'
                })
                location.reload()
                alert('Se elimino producto del carrito')
            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar producto del carrito')
            }


        })
    })
    document.querySelectorAll('.btn-delete-products-carts1').forEach(button => {
        button.addEventListener('click', async () => {
            const idCart = button.getAttribute("data-id231")
            const idproducto = button.getAttribute("data-products1")
            try {
                await fetch(`http://localhost:8080/api/carts/${idCart}/product/${idproducto}`, {
                    method: 'DELETE'
                })
                location.reload()
                alert('Se elimino producto del carrito')
            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar producto del carrito')
            }


        })
    })

    document.querySelectorAll('.btn-delete-carts').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                const id = button.getAttribute('data-id32')
                await fetch(`http://localhost:8080/api/carts/${id}`, {
                    method: 'DELETE'
                })
                location.reload()
                alert('Se elimino el carrito')
                window.location.href = `http://localhost:8080/api/carts/principal`
            } catch (error) {
                console.error('Error:', error)
                alert('Error al eliminar carrito')
            }
        })
    })
})
