// TODO: replace with types ABI and starknetjs
import { CallData, ec, uint256 } from 'starknet';
import SystemData from '../contracts/starknet_systems.json' assert { type: 'json' };

const parseCairoType = (cairoType) => {
  const [match, matchGroup] = cairoType.match(/core::array::Span::<(.+)>/) || [];
  if (match) {
    return {
      ...parseCairoType(matchGroup),
      isArray: true
    };
  }

  let type;
  if (['influence::common::types::entity::Entity'].includes(cairoType)) type = 'Entity';
  else if (['core::starknet::contract_address::ContractAddress'].includes(cairoType)) type = 'ContractAddress';
  else if (['core::integer::u64', 'core::integer::u128', 'core::integer::u256'].includes(cairoType)) type = 'BigNumber';
  else if (['influence::common::types::string::String', 'core::felt252'].includes(cairoType)) type = 'String';
  else if (['influence::common::types::inventory_item::InventoryItem'].includes(cairoType)) type = 'InventoryItem';
  else if (['influence::interfaces::escrow::Withdrawal'].includes(cairoType)) type = 'Withdrawal';
  else if (['core::bool'].includes(cairoType)) type = 'Boolean';
  else if (['cubit::f64::types::fixed::Fixed'].includes(cairoType)) type = 'Fixed64';
  else if (['cubit::f128::types::fixed::Fixed'].includes(cairoType)) type = 'Fixed128';
  // else throw new Error(`Unknown input type! "${cairoType}"`);
  else {
    console.warn(`Unknown input type! "${cairoType}"`);
    type = 'Raw';
  }

  return { type };
};

const Systems = Object.keys(SystemData).reduce((acc, name) => {
  if (name.match(/^Seed/)) return acc;

  const inputs = SystemData[name].inputs.map(({ name, type }) => ({ name, ...parseCairoType(type) }));
  const outputs = SystemData[name].outputs.map(({ name, type }) => ({ name, ...parseCairoType(type) }));
  const isGetter = SystemData[name].state_mutability === 'view';

  acc[name] = { name, inputs, outputs, isGetter };
  return acc;
}, {});

const toBigInt = (value) => {
  try {
    return BigInt(value);
  } catch (e) {
    return BigInt(Math.round(Number(value || 0)));
  }
};

const formatCalldataValue = (type, value) => {
  if (type === 'ContractAddress') {
    return value;
  } else if (type === 'Entity') {
    return [value.label, value.id];
  } else if (type === 'Number') {
    return Number(value);
  } else if (type === 'String') {
    return value;
  } else if (type === 'Boolean') {
    return value;
  } else if (type === 'BigNumber') {
    return toBigInt(value);
  } else if (type === 'Ether') {
    return uint256.bnToUint256(value);
  } else if (type === 'InventoryItem') {
    return [value.product, value.amount];
  } else if (type === 'Withdrawal') {
    return { recipient: value.recipient, amount: uint256.bnToUint256(toBigInt(value.amount)) };
  } else if (type === 'Boolean') {
    return !!value;
  } else if (type === 'Fixed64') {
    const neg = value < 0;
    const val = toBigInt(Math.floor(Math.abs(value) * 2 ** 32));
    return [val, neg ? 1 : 0];
  } else if (type === 'Fixed128') {
    const neg = value < 0;
    const val = toBigInt(Math.floor(Math.abs(value) * 2 ** 64)); // TODO: this will cause precision loss, use bignumber
    return [val, neg ? 1 : 0];
  } else if (type === 'EscrowHook') {
    if (!value) return { contract: 0, entry_point_selector: '0', calldata: [] };
    return { contract: value.contractAddress, entry_point_selector: value.entrypoint, calldata: value.calldata };
  } else if (type === 'u256') {
    return uint256.bnToUint256(value);
  } else { // "Raw"
    return value;
  }
};

// this is specific to the system's calldata format (i.e. not the full calldata of execute())
const formatSystemCalldata = (name, vars, limitToVars = false) => {
  const system = Systems[name];
  if (!system) throw new Error(`Unknown system: ${name}`);

  const inputs = limitToVars
    ? system.inputs.filter(({ name }) => limitToVars.includes(name))
    : system.inputs;
  return inputs.reduce((acc, { name, type, isArray }) => {
    if (isArray) acc.push(vars[name]?.length || 0);
    (isArray ? vars[name] : [vars[name]]).forEach((v) => {
      const formattedVar = formatCalldataValue(type, v);
      try {
        (Array.isArray(formattedVar) ? formattedVar : [formattedVar]).forEach((val) => {
          acc.push(val);
        });
      } catch (e) {
        console.error(`${name} could not be formatted`, vars[name], e);
      }
    }, []);
    return acc;
  }, []);
};

const getFormattedCall = (contractAddress, entrypoint, calldata) => ({
  contractAddress,
  entrypoint,
  calldata: CallData.compile(
    calldata.map((entry) => {
      const { value, type } = typeof entry === 'object' && entry.hasOwnProperty('value')
        ? entry
        : { value: entry };
      return formatCalldataValue(type || 'Raw', value);
    })
  )
});

const getApproveErc20Call = (amount, erc20Address, dispatcherAddress) => getFormattedCall(
  erc20Address,
  'approve',
  [
    { value: dispatcherAddress, type: 'ContractAddress' },
    { value: amount, type: 'Ether' }
  ]
);

const getEscrowDepositCall = (amount, depositHook, withdrawHook, escrowAddress, swayAddress) => getFormattedCall(
  escrowAddress,
  'deposit',
  [
    { value: swayAddress, type: 'ContractAddress' },
    { value: amount, type: 'Ether' }, // using Ether b/c should match u256
    { value: withdrawHook, type: 'EscrowHook' },
    { value: depositHook, type: 'EscrowHook' }
  ]
);

const getEscrowWithdrawCall = (withdrawals, depositCaller, withdrawHook, withdrawData, escrowAddress, swayAddress) => getFormattedCall(
  escrowAddress,
  'withdraw',
  [
    { value: depositCaller, type: 'ContractAddress' },
    { value: swayAddress, type: 'ContractAddress' },
    { value: withdrawHook, type: 'EscrowHook' },
    // withdrawal data (not part of initial hook)
    withdrawData.length,
    ...withdrawData,
    // span of withdrawal structs
    withdrawals.length,
    ...(withdrawals.map((w) => ({ value: w, type: 'Withdrawal' })))
  ]
);

const getRunSystemCall = (name, input, dispatcherAddress, limitToVars = false) => getFormattedCall(
  dispatcherAddress,
  'run_system',
  [
    name,
    formatSystemCalldata(name, input, limitToVars)
  ]
);

const getTransferWithConfirmationCall = (recipient, amount, memo, consumerAddress, swayAddress) => getFormattedCall(
  swayAddress,
  'transfer_with_confirmation',
  [
    { value: recipient, type: 'ContractAddress' },
    { value: amount, type: 'BigNumber' },
    { value: Array.isArray(memo) ? ec.starkCurve.poseidonHashMany(memo.map((v) => toBigInt(v))) : memo },
    { value: consumerAddress, type: 'ContractAddress' }
  ]
);

export default {
  formatSystemCalldata,
  getApproveErc20Call,
  getEscrowDepositCall,
  getEscrowWithdrawCall,
  getFormattedCall,
  getRunSystemCall,
  getTransferWithConfirmationCall,
  toBigInt,
  Systems
};
