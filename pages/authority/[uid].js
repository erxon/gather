import { useRouter } from "next/router"


export default function Authority(){
    const router = useRouter();
    const {uid} = router.query

    return <>
        <div>
            Authority profile will go here
            <p>{uid}</p>
        </div>
    </>
}