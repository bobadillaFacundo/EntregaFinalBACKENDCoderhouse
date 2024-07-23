

document.querySelectorAll('.btn-delete-carts').forEach(button => {
    button.addEventListener('click', async () => {
        try {
            const id = button.getAttribute('data-id2')
            console.log(id);
            const response = await fetch(`http://localhost:8080/api/carts/${id}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            alert(result.message) // Mostrar mensaje de éxito o error
            window.location.href = `http://localhost:8080/api/carts`
        } catch (error) {
            console.error('Error:', error)
            alert('Error al agregar al eliminar carrito')
        }
    })
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-volver').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/carts`
        })

    })

})
