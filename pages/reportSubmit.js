import { useRouter } from "next/router";

export default function ReportSubmit(){
    const router = useRouter();
    const report = router.query
    console.log(report.reporter)
}