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
                location.reload()
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
    // Función para manejar agregar al carrito
    const handleAddToCart = async (id) => {

    }

    // Asignar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id')
            handleAddToCart(id)
        })
    })

    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/products`
        })
    })

})
