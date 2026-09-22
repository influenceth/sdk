/** Build an assignment without coercing deployment-specific felt values. */
const getAssignment = ({ campaign, subject, mission }) => {
  if (campaign === undefined || campaign === null || campaign === '') {
    throw new TypeError('A campaign is required');
  }
  if (!subject || subject.label === undefined || subject.id === undefined) {
    throw new TypeError('A subject with label and id is required');
  }
  if (!Number.isInteger(mission) || mission < 0 || mission > 0xffffffff) {
    throw new RangeError('Mission must be a u32 integer');
  }
  return { campaign, subject: { label: subject.label, id: subject.id }, mission };
};

export default { getAssignment };
