// import { Calldata } from 'starknet';
// import { Entity } from './entity.js';
import SystemData from '../contracts/starknet_systems.json' assert { type: 'json' };

const parseCairoType = (cairoType) => {
  const [match, matchGroup] = cairoType.match(/core::array::Span::<(.+)>/) || [];
  if (match) {
    return {
      ...parseCairoType(matchGroup),
      isArray: true
    }
  }

  let type;
  if (['influence::common::types::entity::Entity'].includes(cairoType)) type = 'Entity';
  else if (['core::starknet::contract_address::ContractAddress'].includes(cairoType)) type = 'ContractAddress';
  else if (['core::integer::u64', 'core::integer::u128'].includes(cairoType)) type = 'Number';
  else if (['influence::common::types::string::String', 'core::felt252'].includes(cairoType)) type = 'String';
  else throw new Error(`Unknown input type!`, type);

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

Systems.ApproveEth = {
  name: 'ApproveEth',
  inputs: [{ name: 'amount', type: 'Number' }],
  outputs: [],
  isGetter: false
};

const formatCalldataType = (type, value) => {
  if (type === 'ContractAddress') {
    return value;
  }
  else if (type === 'Entity') {
    return value;
  }
  else if (type === 'Number') {
    return value;
  }
  else if (type === 'String') {
    return value;
  }
};

// TODO: this needs a test
// TODO: is this doing anything?
const formatCalldata = (name, vars) => {
  const system = Systems[name];
  if (!system) throw new Error(`Unknown system: ${name}`);

  const calldata = Object.keys(vars).reduce((acc, key) => {
    const inputConfig = system.inputs.find(input => input.name === key);
    if (!inputConfig) throw new Error(`Unknown input key: ${name} > ${key}`);

    const { type, isArray } = inputConfig;
    acc[key] = isArray ? vars[key].map((v) => formatCalldataType(type, v)) : formatCalldataType(type, vars[key]);
    return acc;
  }, []);

  return calldata;
};

export default {
  formatCalldata,
  Systems
};

