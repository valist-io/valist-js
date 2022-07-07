
import React from 'react';
import { useAppDispatch } from "../../../app/hooks";
import { TextInput, Tooltip as MantineTooltip, Textarea } from "@mantine/core";
import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';
import { setDescription, setShortDescription } from '../projectSlice';

interface DescriptionsFormProps {
    shortDescription: string;
    projectDescription: string;
}

export const DescriptionsForm = (props: DescriptionsFormProps) => {
    const dispatch = useAppDispatch();
    const rightSectionTooltip = (text: string) => { 
        return (
            <MantineTooltip label={text} >
                <AlertCircleIcon size={16} style={{ display: 'block', opacity: 0.5 }} />
            </MantineTooltip>
        );
    };
    return (
        <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
            <TextInput
                label="Short description"
                rightSection={rightSectionTooltip("A short description shown on searchs and previews of your project.")}
                id="shortDescription"
                name="shortDescription"
                type="text"
                onChange={(e) => dispatch(setShortDescription(e.target.value))}
                value={props.shortDescription}
                placeholder='A short description'
                required
            />
            <div className="mt-1">
                <Textarea
                    label="Description"
                    rightSection={rightSectionTooltip("A short description shown on searchs and previews of your project.")}
                    id= "description"
                    name= "description"
                    onChange={(e) => dispatch(setDescription(e.target.value))}
                    value={props.projectDescription}
                    minRows={8}
                    placeholder="An extended description"
                />
            </div>
        </form >
    );
};
