import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ShowAlerta } from '../functions/functions';

const ManageInventario = () => {


    const [products, SetProducts] = useState([]);
    const [id, SetId] = useState('');
    const [nombre, SetNombre] = useState('');
    const [descripcion, SetDescripcion] = useState('');
    const [talla, SetTalla] = useState('');
    const [categoria, SetCategoria] = useState('');
    const [stock, SetStock] = useState('');
    const [precio, SetPrecio] = useState('');

    const [categorias, SetCategorias] = useState([]); // Estado para almacenar las categorías
    const [selectedCategoria, SetSelectedCategoria] = useState(''); // Estado para la categoría seleccionada
    const [sortByStock, SetSortByStock] = useState(false); // Estado para el checkbox de stock
    const [loading, SetLoading] = useState(true); // Estado para manejar la carga
    const [error, SetError] = useState(null); // Estado para manejar errores
    const [title, SetTitle] = useState('');
    const [operation, SetOperation] = useState('');

    const [filteredProducts, setFilteredProducts] = useState([]); // Estado para almacenar productos filtrados
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    useEffect(()=>{
        fetchCategorias();
        fetchInventario();
    },[])

    useEffect(()=>{

        fetchInventario();
    },[selectedCategoria, sortByStock])

    useEffect(() => {
        // Filtrar productos según el término de búsqueda
        const results = products.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results); // Actualiza el estado de productos filtrados
      }, [searchTerm, products]);

    
    const fetchInventario = async () =>{
        SetLoading(true);
        try{
            let url = 'http://localhost:8080/api/inventario';

            //validaciones filtrado
            if (selectedCategoria && sortByStock) {
                url += `/filtrar-categoria-orden-stock?categoria=${encodeURIComponent(selectedCategoria)}&`; // Agrega el parámetro de categoría si está seleccionado
                console.log(url)
              }
              else if(selectedCategoria){
                url += `/filtrar-categoria?categoria=${encodeURIComponent(selectedCategoria)}&`; // Agrega el parámetro de categoría si está seleccionado
                console.log(url)
              }
              else if (sortByStock) {
                url += '/orden-stock'; // Agrega el parámetro de ordenamiento si está seleccionado
              }
        

            const response = await fetch(url)
            
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }

            const productsData = await response.json();
            SetProducts(productsData); // Almacena los productos en el estado
            setFilteredProducts(productsData);
        }
        catch(error){
            SetError(error.message); // Maneja el error
        } finally {
          SetLoading(false); // Cambia el estado de carga a false
        }
       
    }

    const fetchCategorias = async () =>{
       
        try{
            let url = 'http://localhost:8080/api/inventario/categorias';

            //validaciones filtrado

            const response = await fetch(url)
            
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }

            const categoriasData = await response.json();
            SetCategorias(categoriasData); // Almacena los productos en el estado
        }
        catch(error){
            SetError(error.message); // Maneja el error
        } 
       
    }



    const openModal = (op,id, nombre, categoria, descripcion, talla, precio, stock)=>{

        SetId('');
        SetNombre('');
        SetCategoria('');
        SetDescripcion('');
        SetTalla('');
        SetPrecio(0);
        SetStock(0);
        SetOperation(op); 
        if(op === 1){
            SetTitle('Registar Producto');  
   
        }
        else if(op === 2){
            SetTitle('Editar Producto');
            SetId(id);
            SetNombre(nombre);
            SetCategoria(categoria);
            SetDescripcion(descripcion);
            SetTalla(talla);
            SetPrecio(precio);
            SetStock(stock);   
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }

    const validar = ()=>{
        var newProduct;
        var metodo;
        if(nombre.trim() ===''){
            ShowAlerta('Escriba el nombre del producto', 'Warning')
        }
        else if(categoria.trim() ===''){
            ShowAlerta('Escriba la categoria del producto', 'Warning')
        }
        else if(precio.length <1 || precio <=0 ){
            ShowAlerta('Escriba el precio del producto', 'Warning')
        }
        else if(stock < 0 || stock.length < 1){
            ShowAlerta('Escriba un stock valido del producto', 'Warning')
        }
        else{
            if(operation === 1){
                newProduct = {nombre: nombre.trim(), categoria: categoria.trim(), descripcion: descripcion.trim(), talla: talla.trim(), precio: precio, stock: stock}
                metodo = 'POST'
                 
            }
            else{
                 newProduct = {id: id.trim() ,nombre: nombre.trim(), categoria: categoria.trim(), descripcion: descripcion.trim(), talla: talla.trim(), precio: precio, stock: stock}
                metodo = 'PUT'
            }
            fetchSolicitud(newProduct, metodo)
        } 

       

    }

    const fetchSolicitud = async(newProduct,metodo) => {
        try{
            let url = 'http://localhost:8080/api/inventario';

            const options = {
                method: metodo, // POST o PUT
                headers: {
                    'Content-Type': 'application/json', // Especifica que se envía JSON
                },
                body: JSON.stringify(newProduct), // Convierte el objeto a JSON
            }

            if (metodo === 'PUT' || metodo === 'DELETE') {
                url += `/${newProduct.id}`; 
            }
            else if(metodo === 'POST'){
                url = 'http://localhost:8080/api/inventario/agregar';
                //console.log('agregar' + url)
            }
    
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }   

            const msj = 'Operación realizada'; // Mensaje predeterminado si falta
    
            if (response.status >= 200 && response.status < 300) {
                // Respuesta exitosa (códigos 2xx)
                ShowAlerta(msj, 'success');
                document.getElementById('btnCerrar').click();
                fetchInventario();
            } else {
                // Respuesta de error (códigos 4xx o 5xx)
                ShowAlerta(msj, 'error');
            }
        }
        catch(error){
            SetError(error.message); // Maneja el error
            console.log(error)
        }
    }

    const deleteProduct = (id, nombre) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: '¿Seguro de eliminar el producto ' + nombre + '?',
            icon: 'question', text: 'No se podra dar marcha atras',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: "Cancelar"
        }).then((result) => {
            if(result.isConfirmed){
                SetId(id)
                fetchSolicitud({id: id} , 'DELETE')
            }
            else{
                ShowAlerta('El producto no fue eliminado', 'info')
            }
        })
    }

    const handleCategoryChange = (e) => {
        SetSelectedCategoria(e.target.value);
      };
    
      const handleSortChange = () => {
        SetSortByStock(!sortByStock);
      };

    if (loading) return <div>Cargando...</div>; // Muestra un mensaje mientras se carga
    if (error) return <div > <h1>Error:</h1> {error}</div>; // Muestra un mensaje de error si ocurre

    return (
    <div>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal'  data-bs-target='#modalProducto' >
                            <i className='fa-solid fa-cicle-plus'></i>Añadir
                        </button>
                    </div>
                    
                </div>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <label htmlFor="category">Selecciona una categoría:
                            <select id="categoria" value={selectedCategoria}  onChange={handleCategoryChange}>
                                <option value="">Todas</option>
                                {categorias.map((categoria, index) => (
                                <option key={index} value={categoria}>{categoria}</option> 
                                ))}
                            </select>
                        </label>
                        <label>
                            <input 
                            type="checkbox" 
                            checked={sortByStock} 
                            onChange={handleSortChange} 
                            />
                            Ordenar por Stock
                        </label>
                    </div>
                </div>
                 
     
            </div>

            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr> <th>#</th> <th>Nombre</th>  <th>Categoria</th> <th>Descripcion</th> <th>Talla</th> <th>Precio</th> <th>Stock</th><th>Acciones</th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {filteredProducts.map( (product, i)=>(
                                    <tr key={product.id}>
                                        <td>{(i+1)}</td>
                                        <td>{product.nombre}</td>
                                        <td>{product.categoria}</td>
                                        <td>{product.descripcion}</td>
                                        <td>{product.talla}</td>
                                        <td>${new Intl.NumberFormat("es-mx").format(product.precio)}</td>
                                        <td>{product.stock}</td>
                                        <td  className='d-flex align-items-center'>
                                            <button onClick={()=> openModal(2, product.id, product.nombre, product.categoria, product.descripcion, product.talla, product.precio, product.stock)}
                                             className='btn btn-warning' data-bs-toggle='modal'  data-bs-target='#modalProducto'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={()=> deleteProduct(product.id , product.nombre)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

        </div>
        <div id='modalProducto' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre(*)' 
                                value={nombre} onChange={(e)=> SetNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-list'></i></span>
                                <input type='text' id='categoria' className='form-control' placeholder='Categoria(*)' 
                                value={categoria} onChange={(e)=> SetCategoria(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripcion' 
                                value={descripcion} onChange={(e)=> SetDescripcion(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-expand'></i></span>
                                <input type='text' id='talla' className='form-control' placeholder='Talla' 
                                value={talla} onChange={(e)=> SetTalla(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='number' id='precio' className='form-control' placeholder='Precio(*)' 
                                value={precio} onChange={(e)=> SetPrecio(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-hashtag'></i></span>
                                <input type='number' id='stock' className='form-control' placeholder='Stock(*)' 
                                value={stock} onChange={(e)=> SetStock(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={()=> validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                    </div>
                    <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
            
        </div>

    </div>
  )
}

export default ManageInventario