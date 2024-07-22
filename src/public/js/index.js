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

        const result = await response.json()
        document.getElementById('messageLogs').innerText = result.message
        loadProductsWithDelete()
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

        
        document.getElementById('messageLogs').innerText = "Cargado con exito"
        loadProductsWithDelete()
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

document.querySelectorAll('.toggle-form').forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-target')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
            targetElement.style.display = targetElement.style.display === 'block' ? 'none' : 'block'
        }  
    })
})

// Función para cargar productos con el botón de eliminar
async function loadProductsWithDelete() {
    try {
        const response = await fetch('http://localhost:8080/api/products/products')
        const products = await response.json();
        const productList = document.getElementById('productListWithDelete')
        productList.innerHTML = ''

        products.forEach(product => {
            const productItem = document.createElement('div')
            productItem.className = 'product-item'
            productItem.innerHTML = `
                <h1>${product._id}</h1>
                <p>Title: ${product.title}</p>
                <p>Descripción: ${product.description}</p>
                <p>Código: ${product.code}</p>
                <p>Precio: ${product.price}</p>
                <p>Estado: ${product.status}</p>
                <p>Stock: ${product.stock}</p>
                <p>Categoría: ${product.category}</p>
                <button onclick="deleteProduct('${product._id}')">Eliminar</button>
                <hr>
            `
            productList.appendChild(productItem)
        } )       
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('messageLogs').innerText = 'Error al cargar los productos con eliminación: ' + error.message;
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        document.getElementById('messageLogs').innerText = result.message
        loadProductsWithDelete()
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al eliminar el producto: ' + error.message
    }
}

// Mostrar los productos con y sin botón de eliminar cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    loadProductsWithDelete()
})

document.getElementById('IDB').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('bID').value
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'GET',
        })

        const product = await response.json()
        if(typeof product._id !== 'undefined'){
        showModal(`
            <h1>${product._id}</h1>
            <p>Title: ${product.title}</p>
            <p>Descripción: ${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: ${product.price}</p>
            <p>Estado: ${product.status}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
            <hr>`)}
        else showModal('ID no existe')
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al actualizar el producto solicitado'
    }
})

// Función para mostrar el modal con el mensaje dado
function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerHTML = message;
    modal.style.display = 'block';
}

// Cerrar el modal cuando el usuario hace clic en la 'X'
document.querySelector('.close').onclick = function() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
};

// Cerrar el modal cuando el usuario hace clic fuera del contenido del modal
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};