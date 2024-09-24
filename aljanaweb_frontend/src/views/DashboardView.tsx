import { Link } from "react-router-dom"

export default function DashboardView(){
    return (
        <>
            <h1 className="text-5xl font-black"> Productos</h1>
            <p className="text-2xl font-light text-gray-500 mt-5"> Lista de productos</p>

            <nav className="my-5">
                <Link
                    className="bg-green-400 hover:bg-green-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    to='/projects/create'
                >Lista de Productos</Link>
            </nav>
            

        </>
    )
}