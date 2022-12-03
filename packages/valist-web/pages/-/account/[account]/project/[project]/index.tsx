import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProjectIndex: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(`/${router.query.account}/${router.query.project}`);
    }, []);

    return (<></>);
};

export default ProjectIndex;
