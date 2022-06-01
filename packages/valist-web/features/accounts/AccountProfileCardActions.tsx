import { Paper } from "@mantine/core";
import Link from "next/link";

interface TeamProfileActionsProps {
  accountName: string,
}

export default function TeamProfileCardActions(props: TeamProfileActionsProps) {
  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      <Link href={`/create/project?account=${props.accountName}`}>
        <a className="bg-transparent flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md
        bg-white mb-1">
          New Project
        </a>
      </Link>

      <Link href={`/edit/account/?name=${props.accountName}`}>
        <a className="bg-transparent flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md
        bg-white">
          Edit
        </a>
      </Link>
    </Paper>
  );
}