import { useRouter } from "next/router"


export default function Test(){
    const router = useRouter()
    const { token } = router.query

    return <p>Votre token : {token}</p>
}