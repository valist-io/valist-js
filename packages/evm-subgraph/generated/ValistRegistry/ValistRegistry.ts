// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class MappingEvent extends ethereum.Event {
  get params(): MappingEvent__Params {
    return new MappingEvent__Params(this);
  }
}

export class MappingEvent__Params {
  _event: MappingEvent;

  constructor(event: MappingEvent) {
    this._event = event;
  }

  get _orgID(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get _nameHash(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get _name(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class RoleAdminChanged extends ethereum.Event {
  get params(): RoleAdminChanged__Params {
    return new RoleAdminChanged__Params(this);
  }
}

export class RoleAdminChanged__Params {
  _event: RoleAdminChanged;

  constructor(event: RoleAdminChanged) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get previousAdminRole(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get newAdminRole(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class RoleGranted extends ethereum.Event {
  get params(): RoleGranted__Params {
    return new RoleGranted__Params(this);
  }
}

export class RoleGranted__Params {
  _event: RoleGranted;

  constructor(event: RoleGranted) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get account(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class RoleRevoked extends ethereum.Event {
  get params(): RoleRevoked__Params {
    return new RoleRevoked__Params(this);
  }
}

export class RoleRevoked__Params {
  _event: RoleRevoked;

  constructor(event: RoleRevoked) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get account(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class ValistRegistry extends ethereum.SmartContract {
  static bind(address: Address): ValistRegistry {
    return new ValistRegistry("ValistRegistry", address);
  }

  ADMIN_ROLE(): Bytes {
    let result = super.call("ADMIN_ROLE", "ADMIN_ROLE():(bytes32)", []);

    return result[0].toBytes();
  }

  try_ADMIN_ROLE(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("ADMIN_ROLE", "ADMIN_ROLE():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  DEFAULT_ADMIN_ROLE(): Bytes {
    let result = super.call(
      "DEFAULT_ADMIN_ROLE",
      "DEFAULT_ADMIN_ROLE():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_DEFAULT_ADMIN_ROLE(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "DEFAULT_ADMIN_ROLE",
      "DEFAULT_ADMIN_ROLE():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getNameCount(): BigInt {
    let result = super.call("getNameCount", "getNameCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getNameCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getNameCount", "getNameCount():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getNames(_page: BigInt, _resultsPerPage: BigInt): Array<string> {
    let result = super.call(
      "getNames",
      "getNames(uint256,uint256):(string[])",
      [
        ethereum.Value.fromUnsignedBigInt(_page),
        ethereum.Value.fromUnsignedBigInt(_resultsPerPage)
      ]
    );

    return result[0].toStringArray();
  }

  try_getNames(
    _page: BigInt,
    _resultsPerPage: BigInt
  ): ethereum.CallResult<Array<string>> {
    let result = super.tryCall(
      "getNames",
      "getNames(uint256,uint256):(string[])",
      [
        ethereum.Value.fromUnsignedBigInt(_page),
        ethereum.Value.fromUnsignedBigInt(_resultsPerPage)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toStringArray());
  }

  getRoleAdmin(role: Bytes): Bytes {
    let result = super.call("getRoleAdmin", "getRoleAdmin(bytes32):(bytes32)", [
      ethereum.Value.fromFixedBytes(role)
    ]);

    return result[0].toBytes();
  }

  try_getRoleAdmin(role: Bytes): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getRoleAdmin",
      "getRoleAdmin(bytes32):(bytes32)",
      [ethereum.Value.fromFixedBytes(role)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  hasRole(role: Bytes, account: Address): boolean {
    let result = super.call("hasRole", "hasRole(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(role),
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBoolean();
  }

  try_hasRole(role: Bytes, account: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("hasRole", "hasRole(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(role),
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isTrustedForwarder(forwarder: Address): boolean {
    let result = super.call(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );

    return result[0].toBoolean();
  }

  try_isTrustedForwarder(forwarder: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  nameToID(param0: string): Bytes {
    let result = super.call("nameToID", "nameToID(string):(bytes32)", [
      ethereum.Value.fromString(param0)
    ]);

    return result[0].toBytes();
  }

  try_nameToID(param0: string): ethereum.CallResult<Bytes> {
    let result = super.tryCall("nameToID", "nameToID(string):(bytes32)", [
      ethereum.Value.fromString(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  names(param0: BigInt): string {
    let result = super.call("names", "names(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_names(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("names", "names(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  versionRecipient(): string {
    let result = super.call(
      "versionRecipient",
      "versionRecipient():(string)",
      []
    );

    return result[0].toString();
  }

  try_versionRecipient(): ethereum.CallResult<string> {
    let result = super.tryCall(
      "versionRecipient",
      "versionRecipient():(string)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get metaTxForwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class GrantRoleCall extends ethereum.Call {
  get inputs(): GrantRoleCall__Inputs {
    return new GrantRoleCall__Inputs(this);
  }

  get outputs(): GrantRoleCall__Outputs {
    return new GrantRoleCall__Outputs(this);
  }
}

export class GrantRoleCall__Inputs {
  _call: GrantRoleCall;

  constructor(call: GrantRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class GrantRoleCall__Outputs {
  _call: GrantRoleCall;

  constructor(call: GrantRoleCall) {
    this._call = call;
  }
}

export class InitCall extends ethereum.Call {
  get inputs(): InitCall__Inputs {
    return new InitCall__Inputs(this);
  }

  get outputs(): InitCall__Outputs {
    return new InitCall__Outputs(this);
  }
}

export class InitCall__Inputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class InitCall__Outputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class LinkNameToIDCall extends ethereum.Call {
  get inputs(): LinkNameToIDCall__Inputs {
    return new LinkNameToIDCall__Inputs(this);
  }

  get outputs(): LinkNameToIDCall__Outputs {
    return new LinkNameToIDCall__Outputs(this);
  }
}

export class LinkNameToIDCall__Inputs {
  _call: LinkNameToIDCall;

  constructor(call: LinkNameToIDCall) {
    this._call = call;
  }

  get _orgID(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _name(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class LinkNameToIDCall__Outputs {
  _call: LinkNameToIDCall;

  constructor(call: LinkNameToIDCall) {
    this._call = call;
  }
}

export class OverrideNameToIDCall extends ethereum.Call {
  get inputs(): OverrideNameToIDCall__Inputs {
    return new OverrideNameToIDCall__Inputs(this);
  }

  get outputs(): OverrideNameToIDCall__Outputs {
    return new OverrideNameToIDCall__Outputs(this);
  }
}

export class OverrideNameToIDCall__Inputs {
  _call: OverrideNameToIDCall;

  constructor(call: OverrideNameToIDCall) {
    this._call = call;
  }

  get _orgID(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _name(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class OverrideNameToIDCall__Outputs {
  _call: OverrideNameToIDCall;

  constructor(call: OverrideNameToIDCall) {
    this._call = call;
  }
}

export class RenounceRoleCall extends ethereum.Call {
  get inputs(): RenounceRoleCall__Inputs {
    return new RenounceRoleCall__Inputs(this);
  }

  get outputs(): RenounceRoleCall__Outputs {
    return new RenounceRoleCall__Outputs(this);
  }
}

export class RenounceRoleCall__Inputs {
  _call: RenounceRoleCall;

  constructor(call: RenounceRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RenounceRoleCall__Outputs {
  _call: RenounceRoleCall;

  constructor(call: RenounceRoleCall) {
    this._call = call;
  }
}

export class RevokeRoleCall extends ethereum.Call {
  get inputs(): RevokeRoleCall__Inputs {
    return new RevokeRoleCall__Inputs(this);
  }

  get outputs(): RevokeRoleCall__Outputs {
    return new RevokeRoleCall__Outputs(this);
  }
}

export class RevokeRoleCall__Inputs {
  _call: RevokeRoleCall;

  constructor(call: RevokeRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RevokeRoleCall__Outputs {
  _call: RevokeRoleCall;

  constructor(call: RevokeRoleCall) {
    this._call = call;
  }
}