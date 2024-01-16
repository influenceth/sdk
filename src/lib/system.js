// TODO: replace with types ABI and starknetjs
import { CallData, uint256 } from 'starknet';
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
  else if (['influence::systems::orders::fill_buy::Withdrawal'].includes(cairoType)) type = 'Withdrawal';
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
    return BigInt(value);
  } else if (type === 'Ether') {
    return uint256.bnToUint256(value);
  } else if (type === 'InventoryItem') {
    return [value.product, value.amount];
  } else if (type === 'Withdrawal') {
    return [value.recipient, BigInt(value.amount)];
  } else if (type === 'Boolean') {
    return !!value;
  } else if (type === 'Fixed64') {
    const neg = value < 0;
    const val = BigInt(Math.floor(Math.abs(value) * 2 ** 32));
    return [val, neg ? 1 : 0];
  } else if (type === 'Fixed128') {
    const neg = value < 0;
    const val = BigInt(Math.floor(Math.abs(value) * 2 ** 64)); // TODO: this will cause precision loss, use bignumber
    return [val, neg ? 1 : 0];
  } else { // "Raw"
    return value;
  }
};

// this is specific to the system's calldata format (i.e. not the full calldata of execute())
const formatSystemCalldata = (name, vars) => {
  const system = Systems[name];
  if (!system) throw new Error(`Unknown system: ${name}`);

  return system.inputs.reduce((acc, { name, type, isArray }) => {
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

const getApproveEthCall = (amount, erc20Address, dispatcherAddress) => ({
  contractAddress: erc20Address,
  entrypoint: 'approve',
  calldata: CallData.compile([
    formatCalldataValue('ContractAddress', dispatcherAddress),
    formatCalldataValue('Ether', amount)
  ])
});

const getTransferWithConfirmationCall = (recipient, amount, memo, consumerAddress, swayAddress) => ({
  contractAddress: swayAddress,
  entrypoint: 'transfer_with_confirmation',
  calldata: CallData.compile([
    formatCalldataValue('recipient', recipient),
    formatCalldataValue('amount', amount),
    formatCalldataValue('memo', memo),
    formatCalldataValue('consumer', consumerAddress)
  ])
});

const getRunSystemCall = (name, input, dispatcherAddress) => ({
  contractAddress: dispatcherAddress,
  entrypoint: 'run_system',
  calldata: CallData.compile({
    name,
    calldata: formatSystemCalldata(name, input)
  })
});

export default {
  getApproveEthCall,
  getRunSystemCall,
  getTransferWithConfirmationCall,
  Systems
};
