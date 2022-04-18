import { Magic } from "magic-sdk";
import { SetUseState } from "../Account/types";

export type ProviderParams = {
  email?: string,
  setMagic?: SetUseState<Magic>,
}