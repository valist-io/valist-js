import { generateID } from "@valist/sdk";
import { useContext, useEffect } from "react";
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
  teamNames: string[];
  projectID: string | null;
  projectNames: string[];
  releaseTeam: string;
  releaseProject: string;
  releaseName: string;
  releaseDescription: string;
  releaseImage: FileList[];
  releaseFiles: FileList[];
  setProjectID: SetUseState<string | null>;
  setImage: UseListStateHandler<FileList>;
  setFiles: UseListStateHandler<FileList>;
  submit: () => void;
}

export default function PublishReleaseForm(props: PublishReleaseFormProps) {
  const { publicRuntimeConfig } = getConfig();
  const valistCtx = useContext(ValistContext);
  const dispatch = useAppDispatch();

  const releaseFormSchema = z.object({
    account: z.string(),
    project: z.string(),
    version: z.string()
      .min(1, { message: 'Version should have at least 1 character' })
      .regex(versionRegex, { message: 'Versions cannot contain [!@#$%^&*()[]] or spaces!' }),
    description: z.string(),
  });

  const releaseForm = useForm({
    schema: zodResolver(releaseFormSchema),
    initialValues: {
      account: props.releaseTeam,
      project: props.releaseProject,
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
      dispatch(setName(releaseForm.values.version));
    } else {
      return;
    }
      alert(`
Confirmation: You are about to publish "${releaseForm.values.version}" with the following details:

Team name: ${props.releaseTeam}
Project name: ${props.releaseProject}
Version tag: ${releaseForm.values.version}
`);

   props.submit();
  };

  // If props.projectNames changes, update selected project in form.
  useEffect(() => {
    releaseForm.setFieldValue('project', props.projectNames[0] || '');
  }, [props.projectNames]);

  useEffect(() => {
    dispatch(setTeam(releaseForm.values.account));
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
        data={props.teamNames}
        {...releaseForm.getInputProps('account')}
      />

      <Select
        label="Projects"
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
        label="Desciption"
        placeholder="Release description"
        {...releaseForm.getInputProps('description')}
      />

      <FileUpload
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
