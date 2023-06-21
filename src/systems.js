import { CallData } from 'starknet';

export class CrewExchange {
  static format (srcCrew, srcComp, destCrew, destComp) {
    return {
      name: 'CrewExchange',
      calldata: CallData.compile({ srcCrew, srcComp, destCrew, destComp })
    };
  }
};

export class CrewStation {
  static format (station, callerCrew) {
    return {
      name: 'CrewStation',
      calldata: CallData.compile({ station, callerCrew })
    };
  }
};

export class CrewmateRecruitment {
  static format (entity) {
    return {
      name: 'CrewmateRecruitment',
      calldata: CallData.compile({ entity })
    };
  }
};

export class Delegate {
  static format (crew, delegatedTo) {
    return {
      name: 'Delegate',
      calldata: CallData.compile({ crew, delegatedTo })
    };
  }
};

export class FoodSupply {
  static format (entity, slot, food, callerCrew) {
    return {
      name: 'FoodSupply',
      calldata: CallData.compile({ entity, slot, food, callerCrew })
    };
  }
};

export class InventoryTransfer {
  static format (entity, originSlot, products, dest, destSlot, crew) {
    return {
      name: 'InventoryTransfer',
      calldata: CallData.compile({ entity, originSlot, products, dest, destSlot, crew })
    };
  }
}

export class GrantPermission {
  static format (entity, permission, crew, callerCrew, data) {
    return {
      name: 'GrantPermission',
      calldata: CallData.compile({ entity, permission, crew, callerCrew, data })
    };
  }
}

export class RevokePermission {
  static format (entity, permission, crew, callerCrew, data) {
    return {
      name: 'RevokePermission',
      calldata: CallData.compile({ entity, permission, crew, callerCrew, data })
    };
  }
};

export class AssignPolicy {
  static format (entity, permission, policy, callerCrew) {
    return {
      name: 'AssignPolicy',
      calldata: CallData.compile({ entity, permission, policy, callerCrew })
    };
  }
};

export class RemovePolicy {
  static format (entity, permission, crew) {
    return {
      name: 'RemovePolicy',
      calldata: CallData.compile({ entity, permission, crew })
    };
  }
};

export class NameChange {
  static format (entity, name) {
    return {
      name: 'NameChange',
      calldata: CallData.compile({ entity, name })
    };
  }
};

export class Recruitment {
  static format (crew) {
    return {
      name: 'Recruitment',
      calldata: CallData.compile({ crew })
    };
  }
};

export class ResourceScanStart {
  static format (asteroid, crew) {
    return {
      name: 'ResourceScanStart',
      calldata: CallData.compile({ asteroid, crew })
    };
  }
};

export class ResourceScanFinish {
  static format (asteroid, crew) {
    return {
      name: 'ResourceScanFinish',
      calldata: CallData.compile({ asteroid, crew })
    };
  }
};

export class SurfaceScanStart {
  static format (asteroid, crew) {
    return {
      name: 'SurfaceScanStart',
      calldata: CallData.compile({ asteroid, crew })
    };
  }
};

export class SurfaceScanFinish {
  static format (asteroid) {
    return {
      name: 'SurfaceScanFinish',
      calldata: CallData.compile({ asteroid })
    };
  }
};
