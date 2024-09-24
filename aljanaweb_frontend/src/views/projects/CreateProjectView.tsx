import { Link, useNavigate } from "react-router-dom"
import { useForm} from 'react-hook-form'
import { toast} from 'react-toastify'
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject} from "@/api/ProjectAPI"


/**   SubmitHandler<ProjectFormData> = (data)    */

/**   const {register, handleSubmit, formState: { errors },
      } = useForm<ProjectFormData>({ defaultValues });       */


export default function CreateProjectView() {
    const navigate =  useNavigate()

    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }
    const {register, handleSubmit, formState: { errors },
      } = useForm<ProjectFormData>({ defaultValues : initialValues});
    

      const handleForm= async (formData : ProjectFormData)=> {
        const data =await createProject(formData)
        toast.success(data)
        navigate('/')
      };

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black"> Publicar producto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5"> Llena el siguiente formulario</p>

                <nav className="my-5">
                    <Link
                        className="bg-green-400 hover:bg-green-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to='/'
                    >Volver a Productos</Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit = {handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register = {register}
                        errors = {errors}
                    />
                    <input
                        type="submit"
                        value='Crear Proyecto'
                        className=" bg-emerald-600 hover:bg-emerald-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />  
                </form>
            </div>
        </>
    )
}
