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
})

document.getElementById('formMP').addEventListener('submit', async function(event) {
    event.preventDefault();

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

        
        alert("Se cargo Producto ",response.json().message)
        location.reload()
        document.getElementById('idMP').value=''
        document.getElementById('titleMP').value=''
        document.getElementById('descriptionMP').value=''
        document.getElementById('codeMP').value=''
        document.getElementById('priceMP').value=''
        document.getElementById('stockMP').value=''
        document.getElementById('categoryMP').value=''
        document.getElementById('statusMP').value=''
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al actualizar el producto'
    }
})

document.getElementById('formCP').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('titleCP').value
    const description = document.getElementById('descriptionCP').value
    const code = document.getElementById('codeCP').value
    const price = document.getElementById('priceCP').value
    const stock = document.getElementById('stockCP').value
    const category = document.getElementById('categoryCP').value

    const data = {
        title,
        description,
        code,
        price,
        stock,
        category
    };

    try {
        const response = await fetch(`http://localhost:8080/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        
        alert("Se cargo Producto", response.json().message)
        location.reload()
        document.getElementById('titleCP').value=''
        document.getElementById('descriptionCP').value=''
        document.getElementById('codeCP').value=''
        document.getElementById('priceCP').value=''
        document.getElementById('stockCP').value=''
        document.getElementById('categoryCP').value=''
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al agregar el producto'
    }
})
 // Manejar clic en el botón de buscar ID
 document.getElementById('IDB').addEventListener('submit', async (event) => {
    event.preventDefault() // Evitar que el formulario se envíe de la manera tradicional
    const id = document.getElementById('bID').value
    try {
        window.location.href = `http://localhost:8080/api/products/${id}`
    } catch (error) {
        console.error('Error:', error)
        alert('Error al buscar el producto')
    }
})