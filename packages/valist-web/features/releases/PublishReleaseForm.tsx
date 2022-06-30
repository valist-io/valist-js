import { generateID } from "@valist/sdk";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import FileUpload, { FileList } from "../../components/Files/FileUpload";
import {  versionRegex } from "../../utils/Validation";
import ValistContext from "../valist/ValistContext";
import { setDescription, setName, setProject, setTeam } from "./releaseSlice";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { useForm, zodResolver } from '@mantine/form';
import getConfig from 'next/config';
import { z } from 'zod';
import { Select, TextInput } from "@mantine/core";
import { SetUseState } from "@/utils/Account/types";

interface PublishReleaseFormProps {
  initialValues: { account: string, project: string }
  accountNames: string[];
  projectNames: string[];
  releaseImage: FileList[];
  releaseFiles: FileList[];
  setProjectList: (account: string) => string;
  setImage: UseListStateHandler<FileList>;
  setFiles: UseListStateHandler<FileList>;
  submit: (projectID: string, name: string) => void;
}

export default function PublishReleaseForm(props: PublishReleaseFormProps) {
  const { publicRuntimeConfig } = getConfig();
  const valistCtx = useContext(ValistContext);
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState<boolean>(false);

  const releaseFormSchema = z.object({
    account: z.string(),
    project: z.string(),
    version: z.string()
      .min(1, { message: 'Version should have at least 1 character' })
      .regex(versionRegex, { message: 'Versions cannot contain [!@#$%^&*()[]] or spaces!' }),
    description: z.string(),
  });

  console.log('intial account', props.initialValues.account);

  const releaseForm = useForm({
    schema: zodResolver(releaseFormSchema),
    initialValues: {
      account: props.initialValues.account,
      project: props.initialValues.project,
      version: '',
      description: '',
    },
  });

  const handleSubmit = async () => {
    const { account, project, version } = releaseForm.values;
    let chainID:string, accountID:string, projectID:string, releaseID:string;

    if (account && project) {
      chainID = publicRuntimeConfig.CHAIN_ID;
      accountID = generateID(chainID, account);
      projectID = generateID(accountID, project);
      releaseID = generateID(projectID, version);

      const releaseExists = await valistCtx.releaseExists(releaseID);
      if (releaseExists) {
        releaseForm.setFieldError('version', 'Version/tag is already in use! 😢');
        return;
      }
      dispatch(setName(version));
    } else {
      return;
    }
    
      alert(`
Confirmation: You are about to publish "${version}" with the following details:

Team name: ${releaseForm.values.account}
Project name: ${releaseForm.values.project}
Version tag: ${version}
`);

   props.submit(projectID, version);
  };

  useEffect(() => {
    dispatch(setTeam(releaseForm.values.account));
    if (loaded) {
      const projectName = props.setProjectList(releaseForm.values.account);
      releaseForm.setFieldValue('project', projectName);
    }
    setLoaded(true);
  }, [dispatch, releaseForm.values.account]);

  useEffect(() => {
    dispatch(setProject(releaseForm.values.project));
  }, [dispatch, releaseForm.values.project]);

  useEffect(() => {
    dispatch(setDescription(releaseForm.values.description));
  }, [dispatch, releaseForm.values.description]);

  return (
    <form onSubmit={releaseForm.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-y-4 sm:gap-x-8">
      <FileUpload
        title={'Set Release Image'}
        files={[]}
        setFiles={props.setImage}
        fileView={"none"}
        multiple={false}
      />
    
      <Select
        label="Account"
        data={props.accountNames}
        {...releaseForm.getInputProps('account')}
      />

      <Select
        label="Project"
        data={props.projectNames}
        {...releaseForm.getInputProps('project')}
      />

      <TextInput
        required
        label="Version"
        placeholder="1.0.3"
        {...releaseForm.getInputProps('version')}
      />

      <TextInput
        label="Description"
        placeholder="Release description"
        {...releaseForm.getInputProps('description')}
      />

      <FileUpload
        title="Files (Will be wrapped if folder is dropped)"
        files={props.releaseFiles}
        setFiles={props.setFiles} 
        fileView={"none"}
        multiple={true}     
      />

      <button value="Submit" type="submit" className="button">
        Publish Release
      </button>
    </form>
  );
}
