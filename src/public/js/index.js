document.getElementById('formMP').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('idMP').value;
    const title = document.getElementById('titleMP').value;
    const description = document.getElementById('descriptionMP').value;
    const code = document.getElementById('codeMP').value;
    const price = document.getElementById('priceMP').value;
    const status = document.getElementById('statusMP').value;
    const stock = document.getElementById('stockMP').value;
    const category = document.getElementById('categoryMP').value;

    const data = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    };

    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('messageLogs').innerText = result.message;
        loadProductsWithDelete()
        loadProductsWithoutDelete()
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('messageLogs').innerText = 'Error al actualizar el producto';
    }
});

document.getElementById('formCP').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('titleCP').value;
    const description = document.getElementById('descriptionCP').value;
    const code = document.getElementById('codeCP').value;
    const price = document.getElementById('priceCP').value;
    const stock = document.getElementById('stockCP').value;
    const category = document.getElementById('categoryCP').value;

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
        loadProductsWithoutDelete()
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al agregar el producto';
    }
})

document.querySelectorAll('.toggle-form').forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.style.display = targetElement.style.display === 'block' ? 'none' : 'block';
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

// Función para cargar productos sin el botón de eliminar
async function loadProductsWithoutDelete() {
    try {
        const response = await fetch('http://localhost:8080/api/products/products');
        const products = await response.json();
        const productList = document.getElementById('productListWithoutDelete')
        productList.innerHTML = ''

        products.forEach(product => {
            const productItem = document.createElement('div')
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h1>${product._id}</h1>
                <p>Title: ${product.title}</p>
                <p>Descripción: ${product.description}</p>
                <p>Código: ${product.code}</p>
                <p>Precio: ${product.price}</p>
                <p>Estado: ${product.status}</p>
                <p>Stock: ${product.stock}</p>
                <p>Categoría: ${product.category}</p>
                <hr>
            `;
            productList.appendChild(productItem);
        })
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('messageLogs').innerText = 'Error al cargar los productos sin eliminación: ' + error.message;
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json()
        document.getElementById('messageLogs').innerText = result.message;
        loadProductsWithDelete() // Recargar la lista de productos con el botón de eliminar
        loadProductsWithoutDelete() // Recargar la lista de productos con el sin el botón de eliminar
    } catch (error) {
        console.error('Error:', error)
        document.getElementById('messageLogs').innerText = 'Error al eliminar el producto: ' + error.message
    }
}

// Mostrar los productos con y sin botón de eliminar cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    loadProductsWithDelete()
    loadProductsWithoutDelete()
})
