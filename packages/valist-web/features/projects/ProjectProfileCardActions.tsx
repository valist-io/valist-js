import { Paper } from "@mantine/core";
import Link from "next/link";

interface ProjectProfileActionsProps {
  accountName: string,
  projectName: string,
}

export default function ProjectProfileCardActions(props: ProjectProfileActionsProps) {
  return (
    <Paper shadow="xs" p="md" radius={"md"} withBorder>
      <Link href={`/create/release?account=${props.accountName}&project=${props.projectName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 rounded-md mb-1">
          Publish
        </a>
      </Link>

      {/* <Link href={`/create/release?account=${props.accountName}&project=${props.projectName}`} passHref>
        <Button component="a">Next link button</Button>
      </Link> */}

      <Link href={`/edit/project/?account=${props.accountName}&project=${props.projectName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm rounded-md">
          Settings
        </a>
      </Link>
    </Paper>
  );
}