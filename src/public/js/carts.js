document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/api/products`
     })
 })
 
})

// Manejar clic en el botón de buscar ID
document.getElementById('IDB').addEventListener('submit', async (event) => {
    event.preventDefault() // Evitar que el formulario se envíe de la manera tradicional
    const id = document.getElementById('bID').value
    if (id!==''){
        window.location.href = `http://localhost:8080/api/carts/${id}`
        document.getElementById('bID').value = ''
    }else{   
        alert('Error, ingrese el id del producto')
    }
})
