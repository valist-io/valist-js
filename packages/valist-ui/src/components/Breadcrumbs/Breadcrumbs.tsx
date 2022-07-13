import React from "react"
import { Breadcrumbs as MantineBreadcrumbs, Anchor } from "@mantine/core"
import * as Icons from "tabler-icons-react"
import useStyles from './Breadcrumbs.styles'

export interface BreadcrumbsProps {
  children?: React.ReactNode;
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { classes } = useStyles()
  return (
    <MantineBreadcrumbs classNames={classes}>
      {props.children}
    </MantineBreadcrumbs>
  )
}

Breadcrumbs.defaultProps = {
  items: []
}