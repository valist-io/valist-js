import {
  MappingEvent,
} from "../generated/ValistRegistry/ValistRegistry"
import { Organization } from "../generated/schema"

export function handleMappingEvent(event: MappingEvent): void {
  let org = Organization.load(event.params._orgID.toHexString());

  if (!org) return

  org.name = event.params._name;

  org.save();
}
