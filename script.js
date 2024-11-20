// Obtener referencias a elementos
const listaLibros = document.getElementById("listaLibros");
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputGenero = document.getElementById("genero");
const inputDescripcion = document.getElementById("descripcion");
const inputBusqueda = document.getElementById("busqueda");

// Cargar libros desde LocalStorage
let libros = JSON.parse(localStorage.getItem("libros")) || [];

// Función para guardar libros en LocalStorage
function guardarLibros() {
    localStorage.setItem("libros", JSON.stringify(libros));
}

// Función para mostrar libros
function mostrarLibros(filtrados = libros) {
    listaLibros.innerHTML = "";

    if (filtrados.length === 0) {
        const noResult = document.createElement("li");
        noResult.textContent = "No hay libros en la biblioteca.";
        noResult.classList.add("no-result");
        listaLibros.appendChild(noResult);
        return;
    }

    filtrados.forEach((libro, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>Título:</strong> ${libro.titulo}, <strong>Autor:</strong> ${libro.autor}, <strong>Género:</strong> ${libro.genero}, <strong>Descripción:</strong> ${libro.descripcion}</span>
            <button onclick="eliminarLibro(${index})"><i class="fas fa-trash-alt"></i></button>
            <button onclick="editarLibro(${index})"><i class="fas fa-edit"></i></button>
            <button onclick="descargarLibro(${index})"><i class="fas fa-download"></i> Descargar</button>
        `;
        listaLibros.appendChild(li);
    });
}

// Función para agregar libro
function agregarLibro() {
    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const genero = inputGenero.value.trim();
    const descripcion = inputDescripcion.value.trim();

    if (!titulo || !autor || !genero || !descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Comprobar si el libro ya existe
    if (libros.some(libro => libro.titulo.toLowerCase() === titulo.toLowerCase())) {
        alert("Este libro ya está en la biblioteca.");
        return;
    }

    libros.push({ titulo, autor, genero, descripcion });
    guardarLibros();
    mostrarLibros();
    inputTitulo.value = "";
    inputAutor.value = "";
    inputGenero.value = "";
    inputDescripcion.value = "";
}

// Función para eliminar libro
function eliminarLibro(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este libro?")) {
        libros.splice(index, 1);
        guardarLibros();
        mostrarLibros();
    }
}

// Función para editar libro
function editarLibro(index) {
    const libro = libros[index];
    inputTitulo.value = libro.titulo;
    inputAutor.value = libro.autor;
    inputGenero.value = libro.genero;
    inputDescripcion.value = libro.descripcion;

    // Eliminar el libro y permitir editarlo
    eliminarLibro(index);
}

// Función para ordenar libros
function ordenarLibros() {
    libros.sort((a, b) => a.titulo.localeCompare(b.titulo));
    guardarLibros();
    mostrarLibros();
}

// Función para filtrar libros
function filtrarLibros() {
    const texto = inputBusqueda.value.toLowerCase();
    const filtrados = libros.filter(
        libro =>
            libro.titulo.toLowerCase().includes(texto) ||
            libro.autor.toLowerCase().includes(texto) ||
            libro.genero.toLowerCase().includes(texto)
    );
    mostrarLibros(filtrados);
}

// Función para limpiar biblioteca
function limpiarBiblioteca() {
    if (confirm("¿Estás seguro de que quieres eliminar toda la biblioteca?")) {
        libros = [];
        localStorage.removeItem("libros");
        mostrarLibros();
    }
}

// Función para descargar libro
function descargarLibro(index) {
    const libro = libros[index];
    const contenido = `
        Título: ${libro.titulo}
        Autor: ${libro.autor}
        Género: ${libro.genero}
        Descripción: ${libro.descripcion}
    `;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `${libro.titulo}.txt`;
    enlace.click();
    URL.revokeObjectURL(url);
}

// Agregar eventos a botones
document.getElementById("btn-agregar").addEventListener("click", agregarLibro);
document.getElementById("btn-limpiar").addEventListener("click", limpiarBiblioteca);
document.getElementById("btn-ordenar").addEventListener("click", ordenarLibros);
inputBusqueda.addEventListener("input", filtrarLibros);

// Mostrar los libros al cargar la página
mostrarLibros();

