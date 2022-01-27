export type Action = {
  description: string,
  command: string,
};

export const GetActions = (location: string, teamName: string, projectName: string) => {
  const actions: Record<string, Action> = {
    curlBinary: {
      description: 'Download with cURL',
      command: `curl -Lo ${projectName} ${location}/api/${teamName}/${projectName}/latest`,
    },
  };
  return actions;
};

export const projectTypes: Record<string, any> = {
  binary: {
    actions: ['curlBinary'],
    default: ['curlBinary'],
  }
};
