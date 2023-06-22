import { CallData } from 'starknet';
import { Entity } from './entity.js';

export class CrewExchange {
  static format (srcCrew, srcComp, destCrew, destComp) {
    return {
      name: 'CrewExchange',
      calldata: CallData.compile({
        srcCrew: Entity.format(srcCrew),
        srcComp,
        destCrew: Entity.format(destCrew),
        destComp
      })
    };
  }
};

export class CrewStation {
  static format (station, callerCrew) {
    return {
      name: 'CrewStation',
      calldata: CallData.compile({ station: Entity.format(station), callerCrew: Entity.format(callerCrew) })
    };
  }
};

export class CrewmateRecruitment {
  static format (entity) {
    return {
      name: 'CrewmateRecruitment',
      calldata: CallData.compile({ entity: Entity.format(entity) })
    };
  }
};

export class Delegate {
  static format (crew, delegatedTo) {
    return {
      name: 'Delegate',
      calldata: CallData.compile({ crew: Entity.format(crew), delegatedTo })
    };
  }
};

export class FoodSupply {
  static format (entity, slot, food, callerCrew) {
    return {
      name: 'FoodSupply',
      calldata: CallData.compile({
        entity: Entity.format(entity),
        slot,
        food,
        callerCrew: Entity.format(callerCrew)
      })
    };
  }
};

export class InventoryTransfer {
  static format (entity, originSlot, products, dest, destSlot, crew) {
    return {
      name: 'InventoryTransfer',
      calldata: CallData.compile({
        entity: Entity.format(entity),
        originSlot,
        products,
        dest: Entity.format(dest),
        destSlot,
        crew: Entity.format(crew)
      })
    };
  }
}

export class GrantPermission {
  static format (entity, permission, crew, callerCrew, data) {
    return {
      name: 'GrantPermission',
      calldata: CallData.compile({
        entity: Entity.format(entity),
        permission,
        crew: Entity.format(crew),
        callerCrew: Entity.format(callerCrew),
        data
      })
    };
  }
}

export class RevokePermission {
  static format (entity, permission, crew, callerCrew, data) {
    return {
      name: 'RevokePermission',
      calldata: CallData.compile({
        entity: Entity.format(entity),
        permission,
        crew: Entity.format(crew),
        callerCrew: Entity.format(callerCrew),
        data
      })
    };
  }
};

export class AssignPolicy {
  static format (entity, permission, policy, callerCrew) {
    return {
      name: 'AssignPolicy',
      calldata: CallData.compile({
        entity: Entity.format(entity),
        permission,
        policy: Entity.format(policy),
        callerCrew: Entity.format(callerCrew)
      })
    };
  }
};

export class RemovePolicy {
  static format (entity, permission, crew) {
    return {
      name: 'RemovePolicy',
      calldata: CallData.compile({ entity: Entity.format(entity), permission, crew: Entity.format(crew) })
    };
  }
};

export class NameChange {
  static format (entity, name) {
    return {
      name: 'NameChange',
      calldata: CallData.compile({ entity: Entity.format(entity), name })
    };
  }
};

export class Recruitment {
  static format (crew) {
    return {
      name: 'Recruitment',
      calldata: CallData.compile({ crew: Entity.format(crew) })
    };
  }
};

export class ResourceScanStart {
  static format (asteroid, crew) {
    return {
      name: 'ResourceScanStart',
      calldata: CallData.compile({ asteroid: Entity.format(asteroid), crew: Entity.format(crew) })
    };
  }
};

export class ResourceScanFinish {
  static format (asteroid, crew) {
    return {
      name: 'ResourceScanFinish',
      calldata: CallData.compile({ asteroid: Entity.format(asteroid), crew: Entity.format(crew) })
    };
  }
};

export class SurfaceScanStart {
  static format (asteroid, crew) {
    return {
      name: 'SurfaceScanStart',
      calldata: CallData.compile({ asteroid: Entity.format(asteroid), crew: Entity.format(crew) })
    };
  }
};

export class SurfaceScanFinish {
  static format (asteroid) {
    return {
      name: 'SurfaceScanFinish',
      calldata: CallData.compile({ asteroid: Entity.format(asteroid) })
    };
  }
};
